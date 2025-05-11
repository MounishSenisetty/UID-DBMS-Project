const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');



router.post('/signup', async (req, res) => {
  try {
    const { username, password, role, email, linkedId } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // ⚡ NO hashing. Directly store password
    const user = await User.create({ username, password, role, email, linkedId });

    const token = jwt.sign({ id: user.linkedId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    console.log("User registered successfully", user);

    res.status(201).json({ token, userID: user.linkedId });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;

    const user = await User.findOne({ where: { linkedId: id } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ⚡ Compare plain password directly
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.linkedId, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      user: { id: user.id, username: user.username, role: user.role, linkedId: user.linkedId }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    res.json({ user: { id: user.id, username: user.username, role: user.role, linkedId: user.linkedId } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
