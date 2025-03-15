
const express = require('express');
const router = express.Router();
const { User, Member, Admin } = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/members
// @desc    Get all members (admin only)
// @access  Private (Admin)
router.get('/members', adminAuth, async (req, res) => {
  try {
    const members = await Member.find().select('-password');
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/members
// @desc    Create a new member (admin only)
// @access  Private (Admin)
router.post('/members', adminAuth, async (req, res) => {
  const { email, password, name, rfidNumber, membershipHours, isActive } = req.body;
  
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Create new member
    const member = new Member({
      email,
      password,
      name,
      role: 'member',
      rfidNumber,
      membershipHours: membershipHours || 0,
      totalHoursUsed: 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await member.save();
    
    res.json({ msg: 'Member created successfully', member: { ...member.toObject(), password: undefined } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/members/:id
// @desc    Update a member (admin only)
// @access  Private (Admin)
router.put('/members/:id', adminAuth, async (req, res) => {
  const { name, email, phone, address, rfidNumber, membershipHours, isActive } = req.body;
  
  try {
    let member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }
    
    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (rfidNumber) updateFields.rfidNumber = rfidNumber;
    if (membershipHours !== undefined) updateFields.membershipHours = membershipHours;
    if (isActive !== undefined) updateFields.isActive = isActive;
    
    // Update member
    member = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');
    
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/members/:id/hours
// @desc    Add hours to a member (admin only)
// @access  Private (Admin)
router.put('/members/:id/hours', adminAuth, async (req, res) => {
  const { hoursToAdd } = req.body;
  
  if (!hoursToAdd || hoursToAdd <= 0) {
    return res.status(400).json({ msg: 'Please provide a valid number of hours to add' });
  }
  
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }
    
    member.membershipHours += hoursToAdd;
    await member.save();
    
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user's own profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { name, phone, address } = req.body;
  
  try {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
