
const express = require('express');
const router = express.Router();
const PaymentRequest = require('../models/PaymentRequest');
const { Member } = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for payment proof screenshots
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/payments';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG and PDF are allowed.'), false);
  }
};

// Set up upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   GET api/payments
// @desc    Get all payment requests (admin only)
// @access  Private (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const payments = await PaymentRequest.find().sort({ requestDate: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/payments/member/:id
// @desc    Get payment requests for a specific member
// @access  Private
router.get('/member/:id', auth, async (req, res) => {
  try {
    // Check if user is admin or the member themselves
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const payments = await PaymentRequest.find({ memberId: req.params.id }).sort({ requestDate: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/payments
// @desc    Create a new payment request (member)
// @access  Private
router.post('/', auth, upload.single('paymentProof'), async (req, res) => {
  const { amount, hoursRequested } = req.body;
  
  if (!amount || !hoursRequested) {
    return res.status(400).json({ msg: 'Please provide amount and hours requested' });
  }
  
  try {
    if (req.user.role !== 'member') {
      return res.status(403).json({ msg: 'Only members can create payment requests' });
    }
    
    const member = await Member.findById(req.user.id);
    
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }
    
    // Create new payment request
    const newPayment = new PaymentRequest({
      memberId: member._id,
      memberName: member.name,
      amount: parseFloat(amount),
      hoursRequested: parseInt(hoursRequested),
      paymentProofImage: req.file ? `/uploads/payments/${req.file.filename}` : undefined
    });
    
    const payment = await newPayment.save();
    
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/payments/:id/approve
// @desc    Approve a payment request (admin only)
// @access  Private (Admin)
router.put('/:id/approve', adminAuth, async (req, res) => {
  try {
    const payment = await PaymentRequest.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ msg: 'Payment request not found' });
    }
    
    if (payment.status !== 'pending') {
      return res.status(400).json({ msg: `Payment request already ${payment.status}` });
    }
    
    // Update payment status
    payment.status = 'approved';
    payment.approvedBy = req.user.id;
    payment.approvalDate = new Date();
    
    // Add hours to member
    const member = await Member.findById(payment.memberId);
    
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }
    
    member.membershipHours += payment.hoursRequested;
    
    // Save both records
    await payment.save();
    await member.save();
    
    res.json({ 
      payment,
      member: {
        id: member._id,
        name: member.name,
        membershipHours: member.membershipHours,
        totalHoursUsed: member.totalHoursUsed,
        remainingHours: member.membershipHours - member.totalHoursUsed
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/payments/:id/reject
// @desc    Reject a payment request (admin only)
// @access  Private (Admin)
router.put('/:id/reject', adminAuth, async (req, res) => {
  try {
    const payment = await PaymentRequest.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ msg: 'Payment request not found' });
    }
    
    if (payment.status !== 'pending') {
      return res.status(400).json({ msg: `Payment request already ${payment.status}` });
    }
    
    // Update payment status
    payment.status = 'rejected';
    payment.approvedBy = req.user.id;
    payment.approvalDate = new Date();
    
    await payment.save();
    
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
