const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const invalidatedTokens = new Set();

if (!process.env.JWT_SECRET) {
    throw new Error('No .env file definition for JWT');
  }

  const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token || invalidatedTokens.has(token)) {
      return res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    //exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    //hash
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //new
    const newUser = new User({ username, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

//login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    //exists
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    //pswrd match
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    //gen jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    res.json({ message: 'Login successful', token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

//Middleware profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password'); //no pswrd
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.post('/logout', authMiddleware, (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    invalidatedTokens.add(token); //blacklist
    res.json({ message: 'Logged out successfully' });
  });

module.exports = router