
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email, role });
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials or role' });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        
        // Return user info without password
        const userResponse = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        
        // Add member-specific fields if applicable
        if (user.role === 'member') {
          userResponse.rfidNumber = user.rfidNumber;
          userResponse.membershipHours = user.membershipHours;
          userResponse.totalHoursUsed = user.totalHoursUsed;
          userResponse.isActive = user.isActive;
        }
        
        res.json({ token, user: userResponse });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
