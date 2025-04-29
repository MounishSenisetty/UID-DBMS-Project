const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all officers
router.get('/officers', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const officerRoles = ['returning_officer', 'registration_officer', 'polling_officer', 'presiding_officer'];
    const officers = await User.findAll({
      where: {
        role: officerRoles
      }
    });
    res.json(officers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { username, password, role, email, linkedId } = req.body;
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const user = await User.create({ username, password, role, email, linkedId });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role, email, linkedId } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update({ username, password, role, email, linkedId });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
