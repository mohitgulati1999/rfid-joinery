
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    required: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  profileImage: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { discriminatorKey: 'role' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare passwords
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

// Create Member model as a discriminator of User
const memberSchema = new mongoose.Schema({
  rfidNumber: {
    type: String,
    required: true,
    unique: true
  },
  membershipHours: {
    type: Number,
    default: 0
  },
  totalHoursUsed: {
    type: Number,
    default: 0
  },
  membershipPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MembershipPlan'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Member = User.discriminator('member', memberSchema);

// Create Admin model as a discriminator of User
const adminSchema = new mongoose.Schema({
  position: {
    type: String
  }
});

const Admin = User.discriminator('admin', adminSchema);

module.exports = { User, Member, Admin };
