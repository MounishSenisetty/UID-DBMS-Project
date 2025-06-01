const express = require('express');
const router = express.Router();
const Elector = require('../models/Elector');
const PollingStation = require('../models/PollingStation');
const Vote = require('../models/Vote');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const electors = await Elector.findAll({ include: PollingStation });
    res.json(electors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateJWT, authorizeRoles('admin', 'registration_officer'), async (req, res) => {
  try {
    const { serialNumber, name, pollingStationId } = req.body;
    const elector = await Elector.create({ serialNumber, name, pollingStationId });
    res.status(201).json(elector);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get elector profile by ID
router.get('/profile/:id', authenticateJWT, authorizeRoles('elector', 'admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const elector = await Elector.findByPk(req.params.id, { 
      include: [PollingStation] 
    });
    if (!elector) {
      return res.status(404).json({ message: 'Elector not found' });
    }
    res.json(elector);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if elector has voted
router.get('/vote-status/:serialNumber', authenticateJWT, authorizeRoles('elector', 'admin', 'returning_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const vote = await Vote.findOne({ where: { electorSerialNumber: req.params.serialNumber } });
    res.json({ hasVoted: !!vote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get electors by polling station (for officers)
router.get('/by-station/:stationId', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const electors = await Elector.findAll({ 
      where: { pollingStationId: req.params.stationId },
      include: [PollingStation]
    });
    res.json(electors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
