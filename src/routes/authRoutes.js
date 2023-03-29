const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getRepository } = require('typeorm');
const UserRepository = require('../repositories/UserRepository');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const userRepository = getRepository(UserRepository);

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userRepository.createUser(email, hashedPassword);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ user, token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userRepository = getRepository(UserRepository);

  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ user, token });
});

module.exports = router;
