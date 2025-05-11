const express = require('express');
const router = express.Router();
const Elector = require('../models/Elector');
const PollingStation = require('../models/PollingStation');
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

module.exports = router;
