const express = require('express');
const router = express.Router();
const PoliticalParty = require('../models/PoliticalParty');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector'), async (req, res) => {
  try {
    const politicalParties = await PoliticalParty.findAll();
    res.json(politicalParties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, abbreviation, foundedYear, ideology } = req.body;
    const politicalParty = await PoliticalParty.create({ name, abbreviation, foundedYear, ideology });
    res.status(201).json(politicalParty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, abbreviation, foundedYear, ideology } = req.body;
    const politicalParty = await PoliticalParty.findByPk(id);
    if (!politicalParty) {
      return res.status(404).json({ message: 'Political Party not found' });
    }
    await politicalParty.update({ name, abbreviation, foundedYear, ideology });
    res.json(politicalParty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const politicalParty = await PoliticalParty.findByPk(id);
    if (!politicalParty) {
      return res.status(404).json({ message: 'Political Party not found' });
    }
    await politicalParty.destroy();
    res.json({ message: 'Political Party deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
