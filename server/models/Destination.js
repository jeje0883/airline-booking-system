const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  destination: {
    type: String,
    //required: true,
    trim: true
  },
  rating: {
    type: Number,
    //required: true,
    min: 0, // Rating should be a positive number (can be from 0-5 or 0-10 based on your app logic)
    max: 5, // Assuming a max rating of 5 stars
    default: 0
  },
  photoUrl1: {
    type: String,
    //required: true,
    trim: true
  },
  photoUrl2: {
    type: String,
    //required: true,
    trim: true
  },
  title: {
    type: String,
    //required: true,
    trim: true // First paragraph of description
  },
  p1: {
    type: String,
    //required: true,
    trim: true // First paragraph of description
  },
  p2: {
    type: String,
    trim: true // Second paragraph of description (optional)
  },
  p3: {
    type: String,
    trim: true // Third paragraph of description (optional)
  },
  isActive: {
    type: Boolean,
    default: true // Destination is active by default
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
