const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Party = require('../models/Party');
const Constituency = require('../models/Constituency');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Get all candidates with optional filtering by constituencyId
router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector'), async (req, res) => {
  try {
    const whereClause = {};
    if (req.query.constituencyId) {
      whereClause.constituencyId = req.query.constituencyId;
    }
    const candidates = await Candidate.findAll({ where: whereClause, include: [Party, Constituency] });
    const mappedCandidates = candidates.map(c => ({
      id: c.id,
      name: c.name,
      partyId: c.partyId,
      constituencyId: c.constituencyId,
      partyName: c.Party ? c.Party.name : null,
      constituencyName: c.Constituency ? c.Constituency.name : null,
    }));
    res.json(mappedCandidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get candidate by id
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector'), async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id, { include: [Party, Constituency] });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new candidate
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, partyId, constituencyId } = req.body;
    const candidate = await Candidate.create({ name, partyId, constituencyId });
    res.status(201).json(candidate);
  } catch (error) {
    console.error('Error creating candidate:', error);
    console.error(error.stack);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Update candidate
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, partyId, constituencyId } = req.body;
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    candidate.name = name;
    candidate.partyId = partyId;
    candidate.constituencyId = constituencyId;
    await candidate.save();
    res.json(candidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete candidate
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    await candidate.destroy();
    res.json({ message: 'Candidate deleted' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
