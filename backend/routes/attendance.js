
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { Member } = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const { validateRFID, checkActive } = require('../middleware/rfid');

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
router.post('/checkin', adminAuth, validateRFID, checkActive, async (req, res) => {
  try {
    const member = req.member;
    
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
    
    res.json({
      attendance,
      member: {
        id: member._id,
        name: member.name,
        totalHoursUsed: member.totalHoursUsed,
        membershipHours: member.membershipHours
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/attendance/checkout
// @desc    Check out a member by RFID
// @access  Private (Admin)
router.put('/checkout', adminAuth, validateRFID, async (req, res) => {
  try {
    const member = req.member;
    
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

// @route   GET api/attendance/current
// @desc    Get all current check-ins (admin only)
// @access  Private (Admin)
router.get('/current', adminAuth, async (req, res) => {
  try {
    const currentAttendance = await Attendance.find({ checkOutTime: null });
    res.json(currentAttendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/attendance/stats
// @desc    Get attendance statistics (admin only)
// @access  Private (Admin)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    // Get count of members currently present
    const presentCount = await Attendance.countDocuments({ checkOutTime: null });
    
    // Get total hours for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const todayAttendance = await Attendance.find({
      $or: [
        { checkInTime: { $gte: startOfDay, $lte: endOfDay } },
        { checkOutTime: null }
      ]
    });
    
    let totalHoursToday = 0;
    
    todayAttendance.forEach(record => {
      if (record.hoursSpent) {
        totalHoursToday += record.hoursSpent;
      } else if (!record.checkOutTime) {
        // For active sessions, calculate hours spent so far
        const now = new Date();
        const checkIn = new Date(record.checkInTime);
        const hoursSpentSoFar = parseFloat(((now - checkIn) / (1000 * 60 * 60)).toFixed(2));
        totalHoursToday += hoursSpentSoFar;
      }
    });
    
    // Get last check-in
    const lastCheckIn = await Attendance.findOne({})
      .sort({ checkInTime: -1 })
      .limit(1);
    
    res.json({
      presentCount,
      totalHoursToday,
      lastCheckIn
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
