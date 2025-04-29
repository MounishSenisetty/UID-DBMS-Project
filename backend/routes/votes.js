const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const Candidate = require('../models/Candidate');
const Elector = require('../models/Elector');
const Party = require('../models/Party');
const Vote = require('../models/Vote');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Middleware to ensure elector can vote only once
const checkIfVoted = async (req, res, next) => {
  const { electorSerialNumber } = req.body;
  const existingVote = await Vote.findOne({ where: { electorSerialNumber } });
  if (existingVote) {
    return res.status(400).json({ message: 'Elector has already voted' });
  }
  next();
};

// Create new vote
router.post('/', authenticateJWT, authorizeRoles('elector'), checkIfVoted, async (req, res) => {
  try {
    const { electorSerialNumber, candidateId } = req.body;
    const vote = await Vote.create({ electorSerialNumber, candidateId });
    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vote counts and winner
router.get('/count', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'presiding_officer'), async (req, res) => {
  try {
    const voteCounts = await Vote.findAll({
      attributes: [
        'candidateId',
        [Sequelize.fn('COUNT', Sequelize.col('candidateId')), 'voteCount'],
      ],
      group: ['candidateId'],
      include: [{ model: Candidate, include: [Party] }],
    });
    const winner = voteCounts.reduce((prev, curr) =>
      parseInt(curr.dataValues.voteCount) > parseInt(prev.dataValues.voteCount) ? curr : prev
    );
    res.json({ voteCounts, winner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all votes
router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const votes = await Vote.findAll({
      include: [{ model: Candidate, include: [Party] }, Elector]
    });
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vote by id
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const vote = await Vote.findByPk(req.params.id, {
      include: [{ model: Candidate, include: [Party] }, Elector]
    });
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }
    res.json(vote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update vote
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { electorSerialNumber, candidateId } = req.body;
    const vote = await Vote.findByPk(req.params.id);
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }
    vote.electorSerialNumber = electorSerialNumber;
    vote.candidateId = candidateId;
    await vote.save();
    res.json(vote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete vote
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const vote = await Vote.findByPk(req.params.id);
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }
    await vote.destroy();
    res.json({ message: 'Vote deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
