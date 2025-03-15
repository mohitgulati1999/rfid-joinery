
const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  hoursIncluded: {
    type: Number,
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  features: [{
    type: String
  }],
  isPopular: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
