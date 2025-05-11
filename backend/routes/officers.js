const express = require('express');
const router = express.Router();
const Officer = require('../models/Officer');
const PollingStation = require('../models/PollingStation');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const officers = await Officer.findAll({ include: PollingStation });
    res.json(officers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, role, pollingStationId } = req.body;
    const officer = await Officer.create({ name, role, pollingStationId });
    res.status(201).json(officer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
