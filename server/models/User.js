const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phoneNo: {
    type: String,
    required: true,
    match: [/^\d{11}$/, 'Please enter a valid 10-digit phone number']
  },
  acculatedDistance: {
    type: Number,
    min: 0,
    default: 0
  },
  acculatedPayment: {
    type: Number,
    min: 0,
    default: 0
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',  // Reference to the Booking schema
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
