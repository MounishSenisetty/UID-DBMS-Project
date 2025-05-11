const express = require('express');
const router = express.Router();
const Party = require('../models/Party');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector'), async (req, res) => {
  try {
    const parties = await Party.findAll();
    res.json(parties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name } = req.body;
    const party = await Party.create({ name });
    res.status(201).json(party);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
