const express = require('express');
const router = express.Router();
const PollingStation = require('../models/PollingStation');
const Constituency = require('../models/Constituency');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Get all polling stations
router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const pollingStations = await PollingStation.findAll({
      include: [Constituency]
    });
    res.json(pollingStations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get polling station by ID
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const pollingStation = await PollingStation.findByPk(req.params.id, {
      include: [Constituency]
    });
    if (!pollingStation) {
      return res.status(404).json({ error: 'Polling station not found' });
    }
    res.json(pollingStation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new polling station
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const pollingStation = await PollingStation.create(req.body);
    const stationWithIncludes = await PollingStation.findByPk(pollingStation.id, {
      include: [Constituency]
    });
    res.status(201).json(stationWithIncludes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update polling station
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const pollingStation = await PollingStation.findByPk(req.params.id);
    if (!pollingStation) {
      return res.status(404).json({ error: 'Polling station not found' });
    }
    await pollingStation.update(req.body);
    const updatedStation = await PollingStation.findByPk(pollingStation.id, {
      include: [Constituency]
    });
    res.json(updatedStation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete polling station
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const pollingStation = await PollingStation.findByPk(req.params.id);
    if (!pollingStation) {
      return res.status(404).json({ error: 'Polling station not found' });
    }
    await pollingStation.destroy();
    res.json({ message: 'Polling station deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
