
const express = require('express');
const router = express.Router();
const Elector = require('../models/Elector');
const PollingStation = require('../models/PollingStation');
const Constituency = require('../models/Constituency');
const User = require('../models/User');
const Vote = require('../models/Vote');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Get current elector details with relations
router.get('/me', authenticateJWT, authorizeRoles('elector'), async (req, res) => {
  try {
    console.log('Fetching elector profile for user id:', req.user.id);
    const user = await User.findOne({ where: { linkedId: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const elector = await Elector.findOne({
      where: { id: user.linkedId },
      include: [
        {
          model: PollingStation,
          include: [Constituency]
        },
        {
          model: User
        }
      ]
    });
    console.log('Elector found:', elector);
    if (!elector) {
      return res.status(404).json({ message: 'Elector not found' });
    }
    res.json(elector);
  } catch (error) {
    console.error('Error fetching elector profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all electors
router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const electors = await Elector.findAll({
      include: [
        {
          model: PollingStation,
          include: [Constituency]
        }
      ]
    });
    res.json(electors);
  } catch (error) {
    console.error('Error fetching electors:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get electors assigned to the officer's polling station
router.get('/assigned', authenticateJWT, authorizeRoles('polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    // Find officer by user id
    const officerUserId = req.user.id;
    const officer = await User.findOne({ where: { id: officerUserId } });
    if (!officer) {
      return res.status(404).json({ message: 'Officer user not found' });
    }
    // Find officer's polling station
    const officerPollingStation = await PollingStation.findOne({
      include: [{
        model: User,
        where: { id: officerUserId }
      }]
    });
    if (!officerPollingStation) {
      return res.status(404).json({ message: 'Polling station not found for officer' });
    }
    // Find electors assigned to this polling station
    const electors = await Elector.findAll({
      where: { pollingStationId: officerPollingStation.id },
      include: [
        {
          model: PollingStation,
          include: [Constituency]
        }
      ]
    });
    res.json(electors);
  } catch (error) {
    console.error('Error fetching assigned electors:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify an elector
router.post('/:id/verify', authenticateJWT, authorizeRoles('polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const elector = await Elector.findByPk(req.params.id);
    if (!elector) {
      return res.status(404).json({ message: 'Elector not found' });
    }
    elector.verified = true;
    await elector.save();
    res.json({ message: 'Elector verified successfully' });
  } catch (error) {
    console.error('Error verifying elector:', error);
    res.status(500).json({ error: error.message });
  }
});

// Record a vote for an elector
router.post('/:id/vote', authenticateJWT, authorizeRoles('polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const elector = await Elector.findByPk(req.params.id);
    if (!elector) {
      return res.status(404).json({ message: 'Elector not found' });
    }
    // Check if elector has already voted
    const existingVote = await Vote.findOne({ where: { electorSerialNumber: elector.serialNumber } });
    if (existingVote) {
      return res.status(400).json({ message: 'Elector has already voted' });
    }
    // Create vote record
    const { candidateId } = req.body;
    if (!candidateId) {
      return res.status(400).json({ message: 'Candidate ID is required' });
    }
    const vote = await Vote.create({ electorSerialNumber: elector.serialNumber, candidateId });
    elector.voted = true;
    await elector.save();
    res.status(201).json(vote);
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new elector
router.post('/', authenticateJWT, authorizeRoles('admin', 'registration_officer'), async (req, res) => {
  try {
    const elector = await Elector.create(req.body);
    res.json(elector);
  } catch (error) {
    console.error('Error creating elector:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update an elector
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'registration_officer'), async (req, res) => {
  try {
    const elector = await Elector.findByPk(req.params.id);
    if (!elector) {
      return res.status(404).json({ message: 'Elector not found' });
    }
    await elector.update(req.body);
    res.json(elector);
  } catch (error) {
    console.error('Error updating elector:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete an elector
router.delete('/:id', authenticateJWT, authorizeRoles('admin', 'registration_officer'), async (req, res) => {
  try {
    const elector = await Elector.findByPk(req.params.id);
    if (!elector) {
      return res.status(404).json({ message: 'Elector not found' });
    }
    await elector.destroy();
    res.json({ message: 'Elector deleted successfully' });
  } catch (error) {
    console.error('Error deleting elector:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
