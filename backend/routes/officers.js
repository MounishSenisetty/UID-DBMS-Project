const express = require('express');
const router = express.Router();
const Officer = require('../models/Officer');
const PollingStation = require('../models/PollingStation');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Get all officers
router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const officers = await Officer.findAll({ 
      include: [PollingStation]
    });
    res.json(officers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get officer by ID
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const officer = await Officer.findByPk(req.params.id, {
      include: [PollingStation]
    });
    if (!officer) {
      return res.status(404).json({ error: 'Officer not found' });
    }
    res.json(officer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new officer
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const officer = await Officer.create(req.body);
    const officerWithIncludes = await Officer.findByPk(officer.id, {
      include: [PollingStation]
    });
    res.status(201).json(officerWithIncludes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update officer
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const officer = await Officer.findByPk(req.params.id);
    if (!officer) {
      return res.status(404).json({ error: 'Officer not found' });
    }
    await officer.update(req.body);
    const updatedOfficer = await Officer.findByPk(officer.id, {
      include: [PollingStation]
    });
    res.json(updatedOfficer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete officer
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const officer = await Officer.findByPk(req.params.id);
    if (!officer) {
      return res.status(404).json({ error: 'Officer not found' });
    }
    await officer.destroy();
    res.json({ message: 'Officer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get officer profile by ID
router.get('/profile/:id', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const officer = await Officer.findByPk(req.params.id, { 
      include: [PollingStation]
    });
    // Return demo officer if not found and demo id
    if (!officer && req.params.id == '2') {
      return res.json({ id: 2, name: 'Demo Officer', role: 'polling_officer', pollingStation: { id: 1, name: 'Demo Station' } });
    }
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    res.json(officer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get officers by polling station
router.get('/by-station/:stationId', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const officers = await Officer.findAll({ 
      where: { pollingStationId: req.params.stationId },
      include: [PollingStation]
    });
    res.json(officers);  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
