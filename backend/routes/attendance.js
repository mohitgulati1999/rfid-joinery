
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { Member } = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET api/attendance
// @desc    Get all attendance records (admin only)
// @access  Private (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ checkInTime: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/attendance/member/:id
// @desc    Get attendance records for a specific member
// @access  Private
router.get('/member/:id', auth, async (req, res) => {
  try {
    // Check if user is admin or the member themselves
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const attendance = await Attendance.find({ memberId: req.params.id }).sort({ checkInTime: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/attendance/checkin
// @desc    Check in a member by RFID
// @access  Private (Admin)
router.post('/checkin', adminAuth, async (req, res) => {
  const { rfidNumber } = req.body;
  
  if (!rfidNumber) {
    return res.status(400).json({ msg: 'RFID number is required' });
  }
  
  try {
    // Find member by RFID
    const member = await Member.findOne({ rfidNumber });
    
    if (!member) {
      return res.status(404).json({ msg: 'Member not found with this RFID' });
    }
    
    if (!member.isActive) {
      return res.status(400).json({ msg: 'Member account is inactive' });
    }
    
    // Check if member already has an active session
    const activeSession = await Attendance.findOne({
      memberId: member._id,
      checkOutTime: null
    });
    
    if (activeSession) {
      return res.status(400).json({ msg: 'Member already checked in' });
    }
    
    // Create new attendance record
    const newAttendance = new Attendance({
      memberId: member._id,
      memberName: member.name,
      checkInTime: new Date()
    });
    
    const attendance = await newAttendance.save();
    
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/attendance/checkout
// @desc    Check out a member by RFID
// @access  Private (Admin)
router.put('/checkout', adminAuth, async (req, res) => {
  const { rfidNumber } = req.body;
  
  if (!rfidNumber) {
    return res.status(400).json({ msg: 'RFID number is required' });
  }
  
  try {
    // Find member by RFID
    const member = await Member.findOne({ rfidNumber });
    
    if (!member) {
      return res.status(404).json({ msg: 'Member not found with this RFID' });
    }
    
    // Find active session
    const activeSession = await Attendance.findOne({
      memberId: member._id,
      checkOutTime: null
    });
    
    if (!activeSession) {
      return res.status(400).json({ msg: 'No active session found for this member' });
    }
    
    // Calculate hours spent
    const checkOutTime = new Date();
    const checkInTime = new Date(activeSession.checkInTime);
    const hoursSpent = Math.max(0.25, parseFloat(((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2)));
    
    // Update attendance record
    activeSession.checkOutTime = checkOutTime;
    activeSession.hoursSpent = hoursSpent;
    await activeSession.save();
    
    // Update member's hours used
    member.totalHoursUsed += hoursSpent;
    await member.save();
    
    res.json({ 
      attendance: activeSession,
      member: {
        id: member._id,
        name: member.name,
        totalHoursUsed: member.totalHoursUsed,
        membershipHours: member.membershipHours,
        remainingHours: member.membershipHours - member.totalHoursUsed
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
