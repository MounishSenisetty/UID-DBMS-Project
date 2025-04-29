const express = require('express');
const router = express.Router();
const Party = require('../models/Party');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Get all parties
router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector'), async (req, res) => {
  try {
    const parties = await Party.findAll();
    res.json(parties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get party by id
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector'), async (req, res) => {
  try {
    const party = await Party.findByPk(req.params.id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json(party);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new party
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, symbol } = req.body;
    const party = await Party.create({ name, symbol });
    res.status(201).json(party);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update party
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, symbol } = req.body;
    const party = await Party.findByPk(req.params.id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    party.name = name;
    party.symbol = symbol;
    await party.save();
    res.json(party);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete party
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const party = await Party.findByPk(req.params.id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    await party.destroy();
    res.json({ message: 'Party deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
