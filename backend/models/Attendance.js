
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  memberName: {
    type: String,
    required: true
  },
  rfidNumber: {
    type: String,
    required: true
  },
  checkInTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkOutTime: {
    type: Date
  },
  hoursSpent: {
    type: Number
  },
  checkInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  checkOutBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String
  }
});

// Virtual for whether attendance is currently active
attendanceSchema.virtual('isActive').get(function() {
  return this.checkOutTime === null;
});

// Configure virtuals to be included in the JSON output
attendanceSchema.set('toJSON', { virtuals: true });
attendanceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
