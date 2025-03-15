
const mongoose = require('mongoose');

const paymentRequestSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  memberName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  hoursRequested: {
    type: Number,
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  paymentProofImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: {
    type: Date
  }
});

module.exports = mongoose.model('PaymentRequest', paymentRequestSchema);
