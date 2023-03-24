const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();


// Signup route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username already exists
    const user = await User.getUserByUsername(username);
    if (user) {
      return res.status(409).send('Username already taken');
    }

    // Hash password and create new user
    const hash = await bcrypt.hash(password, 10);
    const userId = await User.createUser(username, hash);
    res.send(`User ${userId} created`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send(`Welcome, ${req.user.username}!`);
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