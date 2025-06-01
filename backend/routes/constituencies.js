const express = require('express');
const router = express.Router();
const Constituency = require('../models/Constituency');
const PollingStation = require('../models/PollingStation');
const Elector = require('../models/Elector');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// GET /api/constituencies - Get all constituencies
router.get('/', authenticateJWT, authorizeRoles('admin', 'returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer', 'elector'), async (req, res) => {
  try {
    const constituencies = await Constituency.findAll({
      order: [['name', 'ASC']]
    });

    // Add mock statistics for each constituency
    const constituenciesWithStats = constituencies.map((constituency) => {
      return {
        id: constituency.id,
        name: constituency.name,
        code: constituency.code || `${constituency.name.substring(0, 2).toUpperCase()}-001`,
        registeredVoters: Math.floor(Math.random() * 5000) + 3000,
        pollingStations: Math.floor(Math.random() * 8) + 4,
        status: 'active',
        description: constituency.description || `${constituency.name} constituency area`,
        area: constituency.area || `${Math.floor(Math.random() * 200) + 100} sq km`
      };
    });

    res.json(constituenciesWithStats);
  } catch (error) {
    console.error('Error fetching constituencies:', error);
    res.status(500).json({ error: 'Failed to fetch constituencies' });
  }
});

// GET /api/constituencies/:id - Get constituency by ID
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'returning_officer'), async (req, res) => {
  try {
    const constituency = await Constituency.findByPk(req.params.id);

    if (!constituency) {
      return res.status(404).json({ error: 'Constituency not found' });
    }

    res.json({
      ...constituency.toJSON(),
      registeredVoters: Math.floor(Math.random() * 5000) + 3000
    });
  } catch (error) {
    console.error('Error fetching constituency:', error);
    res.status(500).json({ error: 'Failed to fetch constituency' });
  }
});

// POST /api/constituencies - Create new constituency
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, description, area } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Constituency name is required' });
    }

    const constituency = await Constituency.create({
      name,
      description,
      area
    });

    res.status(201).json(constituency);
  } catch (error) {
    console.error('Error creating constituency:', error);
    res.status(500).json({ error: 'Failed to create constituency' });
  }
});

// PUT /api/constituencies/:id - Update constituency
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, description, area } = req.body;
    
    const constituency = await Constituency.findByPk(req.params.id);
    
    if (!constituency) {
      return res.status(404).json({ error: 'Constituency not found' });
    }

    await constituency.update({
      name: name || constituency.name,
      description: description || constituency.description,
      area: area || constituency.area
    });

    res.json(constituency);
  } catch (error) {
    console.error('Error updating constituency:', error);
    res.status(500).json({ error: 'Failed to update constituency' });
  }
});

// DELETE /api/constituencies/:id - Delete constituency
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const constituency = await Constituency.findByPk(req.params.id);
    
    if (!constituency) {
      return res.status(404).json({ error: 'Constituency not found' });
    }

    await constituency.destroy();
    res.json({ message: 'Constituency deleted successfully' });
  } catch (error) {
    console.error('Error deleting constituency:', error);
    res.status(500).json({ error: 'Failed to delete constituency' });
  }
});

module.exports = router;
