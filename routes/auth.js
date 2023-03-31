const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();


// Signup route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).send('Username already taken');
    }

    // Hash password and create new user
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.createUser(username, hash);

    const token = jwt.sign({userId: user.user_id}, 'root', {expiresIn: '1h'});
    res.json({user, token});
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


//refresh token
router.post('/refresh-token', async (req, res) => {
  const username = req.body.username;
  const user = await User.getUserByUsername(username);
  const userId = user.user_id;
  
  
  try {
    // Generate new JWT for user
    const token = jwt.sign({ userId }, 'root', { expiresIn: '1h' });
    
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists and password is correct
    const user = await User.getUserByUsername(username);
    if (!user) {
      return res.status(401).send('Invalid username or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid username or password');
    }

    // Generate and send new token
    const token = jwt.sign({ userId: user.user_id }, 'root', { expiresIn: '1h' });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.send('Logged out successfully');
});

router.get('/', (req, res) => {
    res.send('Hello, World!');
  });

module.exports = router;