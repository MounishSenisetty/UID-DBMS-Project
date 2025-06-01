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

router.post('/', authenticateJWT, authorizeRoles('elector'), checkIfVoted, async (req, res) => {
  try {
    const { electorSerialNumber, candidateId } = req.body;
    const vote = await Vote.create({ electorSerialNumber, candidateId });
    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/count', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'presiding_officer', 'elector'), async (req, res) => {
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

// Get voting statistics for officer dashboard
router.get('/stats/:stationId', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const totalElectors = await Elector.count({ where: { pollingStationId: req.params.stationId } });
    const totalVotes = await Vote.count({
      include: [{
        model: Elector,
        where: { pollingStationId: req.params.stationId }
      }]
    });
    
    res.json({ 
      totalElectors, 
      totalVotes, 
      turnoutPercentage: totalElectors > 0 ? ((totalVotes / totalElectors) * 100).toFixed(2) : 0 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
