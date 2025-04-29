const express = require('express');
const router = express.Router();
const Officer = require('../models/Officer');
const PollingStation = require('../models/PollingStation');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Get all officers
router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const officers = await Officer.findAll({ include: PollingStation });
    res.json(officers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get officer by id
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const officer = await Officer.findByPk(req.params.id, { include: PollingStation });
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    res.json(officer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new officer
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, role, pollingStationId } = req.body;
    const officer = await Officer.create({ name, role, pollingStationId });
    res.status(201).json(officer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update officer
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, role, pollingStationId } = req.body;
    const officer = await Officer.findByPk(req.params.id);
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    officer.name = name;
    officer.role = role;
    officer.pollingStationId = pollingStationId;
    await officer.save();
    res.json(officer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete officer
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const officer = await Officer.findByPk(req.params.id);
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    await officer.destroy();
    res.json({ message: 'Officer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
