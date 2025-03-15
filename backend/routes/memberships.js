
const express = require('express');
const router = express.Router();
const MembershipPlan = require('../models/MembershipPlan');
const { adminAuth, auth } = require('../middleware/auth');

// @route   GET api/memberships
// @desc    Get all membership plans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const plans = await MembershipPlan.find().sort({ hoursIncluded: 1 });
    res.json(plans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/memberships/:id
// @desc    Get membership plan by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ msg: 'Membership plan not found' });
    }
    
    res.json(plan);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Membership plan not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   POST api/memberships
// @desc    Create a membership plan (admin only)
// @access  Private (Admin)
router.post('/', adminAuth, async (req, res) => {
  const { name, description, hoursIncluded, pricePerHour, totalPrice, features, isPopular } = req.body;
  
  try {
    const newPlan = new MembershipPlan({
      name,
      description,
      hoursIncluded,
      pricePerHour,
      totalPrice,
      features,
      isPopular
    });
    
    const plan = await newPlan.save();
    
    res.json(plan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/memberships/:id
// @desc    Update a membership plan (admin only)
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  const { name, description, hoursIncluded, pricePerHour, totalPrice, features, isPopular } = req.body;
  
  try {
    let plan = await MembershipPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ msg: 'Membership plan not found' });
    }
    
    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (hoursIncluded) updateFields.hoursIncluded = hoursIncluded;
    if (pricePerHour) updateFields.pricePerHour = pricePerHour;
    if (totalPrice) updateFields.totalPrice = totalPrice;
    if (features) updateFields.features = features;
    if (isPopular !== undefined) updateFields.isPopular = isPopular;
    
    // Update plan
    plan = await MembershipPlan.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    
    res.json(plan);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Membership plan not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/memberships/:id
// @desc    Delete a membership plan (admin only)
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ msg: 'Membership plan not found' });
    }
    
    await plan.remove();
    
    res.json({ msg: 'Membership plan removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Membership plan not found' });
    }
    
    res.status(500).send('Server error');
  }
});

module.exports = router;
