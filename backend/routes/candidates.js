const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Party = require('../models/Party');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector'), async (req, res) => {
  try {
    const candidates = await Candidate.findAll({ include: Party });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, partyId } = req.body;
    const candidate = await Candidate.create({ name, partyId });
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
