
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
    required: true,
    min: 1
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  features: [{
    type: String
  }],
  isPopular: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number, // Duration in days
    default: 30
  },
  maxHoursPerDay: {
    type: Number, // Optional limit for hours per day
    default: null
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for price per hour
membershipPlanSchema.virtual('hourlyRate').get(function() {
  return this.totalPrice / this.hoursIncluded;
});

// Configure virtuals to be included in the JSON output
membershipPlanSchema.set('toJSON', { virtuals: true });
membershipPlanSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
