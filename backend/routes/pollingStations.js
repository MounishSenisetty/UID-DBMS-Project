
const express = require('express');
const router = express.Router();
const PollingStation = require('../models/PollingStation');
const Constituency = require('../models/Constituency');
const User = require('../models/User');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Get all polling stations
router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const pollingStations = await PollingStation.findAll({
      include: [{ model: Constituency, attributes: ['name'] }]
    });
    res.json(pollingStations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get polling station by id
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const pollingStation = await PollingStation.findByPk(req.params.id, {
      include: [{ model: Constituency, attributes: ['name'] }]
    });
    if (!pollingStation) {
      return res.status(404).json({ message: 'Polling Station not found' });
    }
    res.json(pollingStation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get polling stations assigned to the logged-in officer
router.get('/assigned', authenticateJWT, authorizeRoles('polling_officer', 'presiding_officer'), async (req, res) => {
  try {
    const officerUserId = req.user.id;
    // Find polling stations assigned to this officer
    const pollingStations = await PollingStation.findAll({
      include: [{
        model: User,
        where: { id: officerUserId }
      }]
    });
    res.json(pollingStations);
  } catch (error) {
    console.error('Error fetching assigned polling stations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new polling station
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, area, ward, constituencyId } = req.body;
    const pollingStation = await PollingStation.create({ name, area, ward, constituencyId });
    res.status(201).json(pollingStation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update polling station
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, area, ward, constituencyId } = req.body;
    const pollingStation = await PollingStation.findByPk(req.params.id);
    if (!pollingStation) {
      return res.status(404).json({ message: 'Polling Station not found' });
    }
    pollingStation.name = name;
    pollingStation.area = area;
    pollingStation.ward = ward;
    pollingStation.constituencyId = constituencyId;
    await pollingStation.save();
    res.json(pollingStation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete polling station
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const pollingStation = await PollingStation.findByPk(req.params.id);
    if (!pollingStation) {
      return res.status(404).json({ message: 'Polling Station not found' });
    }
    await pollingStation.destroy();
    res.json({ message: 'Polling Station deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
