
const { Member } = require('../models/User');

// Check if an RFID number is valid and get the member
const validateRFID = async (req, res, next) => {
  const { rfidNumber } = req.body;
  
  if (!rfidNumber) {
    return res.status(400).json({ msg: 'RFID number is required' });
  }
  
  try {
    const member = await Member.findOne({ rfidNumber });
    
    if (!member) {
      return res.status(404).json({ msg: 'Member not found with this RFID' });
    }
    
    req.member = member;
    next();
  } catch (err) {
    console.error('RFID validation error:', err);
    res.status(500).json({ msg: 'Server error validating RFID' });
  }
};

// Check if member is active
const checkActive = async (req, res, next) => {
  if (!req.member.isActive) {
    return res.status(400).json({ msg: 'Member account is inactive' });
  }
  
  next();
};

module.exports = { validateRFID, checkActive };
