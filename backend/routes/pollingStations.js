const express = require('express');
const router = express.Router();
const PollingStation = require('../models/PollingStation');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const pollingStations = await PollingStation.findAll();
    res.json(pollingStations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, area, ward } = req.body;
    const pollingStation = await PollingStation.create({ name, area, ward });
    res.status(201).json(pollingStation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
