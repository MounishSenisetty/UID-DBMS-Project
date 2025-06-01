const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Party = require('../models/Party');
const Constituency = require('../models/Constituency');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Get all candidates - Allow electors to view candidates for voting
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const candidates = await Candidate.findAll({ 
      include: [Party, Constituency],
      order: [['name', 'ASC']]
    });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get candidate by ID
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector'), async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id, {
      include: [Party, Constituency]
    });
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new candidate
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    const candidateWithIncludes = await Candidate.findByPk(candidate.id, {
      include: [Party, Constituency]
    });
    res.status(201).json(candidateWithIncludes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update candidate
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    await candidate.update(req.body);
    const updatedCandidate = await Candidate.findByPk(candidate.id, {
      include: [Party, Constituency]
    });
    res.json(updatedCandidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete candidate
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    await candidate.destroy();
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get candidates by constituency
router.get('/by-constituency/:constituencyId', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector'), async (req, res) => {
  try {
    const candidates = await Candidate.findAll({ 
      where: { constituencyId: req.params.constituencyId },
      include: [Party, Constituency]
    });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get candidates for elector's constituency
router.get('/for-elector/:electorId', authenticateJWT, authorizeRoles('elector'), async (req, res) => {
  try {
    // First get the elector's constituency
    const Elector = require('../models/Elector');
    const PollingStation = require('../models/PollingStation');
    
    const elector = await Elector.findByPk(req.params.electorId, {
      include: [{
        model: PollingStation,
        attributes: ['constituencyId']
      }]
    });
    
    if (!elector || !elector.PollingStation) {
      return res.status(404).json({ error: 'Elector or polling station not found' });
    }
    
    const candidates = await Candidate.findAll({ 
      where: { constituencyId: elector.PollingStation.constituencyId },
      include: [Party, Constituency],
      order: [['name', 'ASC']]
    });
    
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
