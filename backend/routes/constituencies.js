const express = require('express');
const router = express.Router();
const { Constituency } = require('../models');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Get all constituencies
router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector'), async (req, res) => {
  try {
    const constituencies = await Constituency.findAll();
    res.json(constituencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get constituency by id
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const constituency = await Constituency.findByPk(req.params.id);
    if (!constituency) {
      return res.status(404).json({ message: 'Constituency not found' });
    }
    res.json(constituency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new constituency
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name } = req.body;
    const newConstituency = await Constituency.create({ name });
    res.status(201).json(newConstituency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update constituency
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name } = req.body;
    const constituency = await Constituency.findByPk(req.params.id);
    if (!constituency) {
      return res.status(404).json({ message: 'Constituency not found' });
    }
    constituency.name = name;
    await constituency.save();
    res.json(constituency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete constituency
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const constituency = await Constituency.findByPk(req.params.id);
    if (!constituency) {
      return res.status(404).json({ message: 'Constituency not found' });
    }
    await constituency.destroy();
    res.json({ message: 'Constituency deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
