
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
    unique: true,
    validate: {
      validator: function(v) {
        // Validate RFID format (e.g., RF followed by 6 digits)
        return /^RF\d{6}$/.test(v);
      },
      message: props => `${props.value} is not a valid RFID number! Format should be RF followed by 6 digits.`
    }
  },
  membershipHours: {
    type: Number,
    default: 0,
    min: 0
  },
  totalHoursUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  membershipPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MembershipPlan'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  hoursHistory: [{
    hours: Number,
    type: {
      type: String,
      enum: ['added', 'used'],
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String
  }]
});

// Method to add hours to a member
memberSchema.methods.addHours = async function(hoursToAdd, notes = '') {
  this.membershipHours += hoursToAdd;
  
  this.hoursHistory.push({
    hours: hoursToAdd,
    type: 'added',
    notes
  });
  
  return this.save();
};

// Method to use hours from a member
memberSchema.methods.useHours = async function(hoursToUse, notes = '') {
  this.totalHoursUsed += hoursToUse;
  
  this.hoursHistory.push({
    hours: hoursToUse,
    type: 'used',
    notes
  });
  
  return this.save();
};

// Virtual for remaining hours
memberSchema.virtual('remainingHours').get(function() {
  return Math.max(0, this.membershipHours - this.totalHoursUsed);
});

// Configure virtuals to be included in the JSON output
memberSchema.set('toJSON', { virtuals: true });
memberSchema.set('toObject', { virtuals: true });

const Member = User.discriminator('member', memberSchema);

// Create Admin model as a discriminator of User
const adminSchema = new mongoose.Schema({
  position: {
    type: String
  },
  permissions: {
    manageUsers: {
      type: Boolean,
      default: true
    },
    manageAttendance: {
      type: Boolean,
      default: true
    },
    managePayments: {
      type: Boolean,
      default: true
    },
    manageMemberships: {
      type: Boolean,
      default: true
    }
  }
});

const Admin = User.discriminator('admin', adminSchema);

module.exports = { User, Member, Admin };
