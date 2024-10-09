// const mongoose = require('mongoose');

// const commercialFlightSchema = new mongoose.Schema(
//   {
//     flight: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Flight',
//       required: true,
//     },
//     pricing: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Pricing',
//       required: true,
//     },
//     date: {
//       type: String,
//       required: true,
//       match: /^\d{4}-\d{2}-\d{2}$/, // Enforce "YYYY-MM-DD" format
//     },
//     departureTime: {
//       type: String,
//       match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Regex to match "HH:mm" format
//     },
//     bookings: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
//       default: [],
//     },
//     availableSeats: {
//       totalSeats: {
//         type: Number,
//         required: true,
//       },
//       economySeat: {
//         type: Number,
//         required: true,
//       },
//       premiumSeat: {
//         type: Number,
//         required: true,
//       },
//       businessSeat: {
//         type: Number,
//         required: true,
//       },
//       firstClass: {
//         type: Number,
//         required: true,
//       },
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     isCancelled: {
//       type: Boolean,
//       default: false,
//     },
//     isDone: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt fields
//   }
// );

// // Create a unique compound index on flight, date, and departureTime
// commercialFlightSchema.index(
//   { flight: 1, date: 1, departureTime: 1 },
//   { unique: true }
// );

// module.exports = mongoose.model('CommercialFlight', commercialFlightSchema);


// models/commercialFlight.js

const mongoose = require('mongoose');




// Airplane Sub-Schema
const airplaneSubSchema = new mongoose.Schema({
  planeId: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  airlineName: { type: String, required: true, trim: true },
  totalSeats: { type: Number, required: true },
  economySeat: { type: Number, required: true },
  premiumSeat: { type: Number, required: true },
  businessSeat: { type: Number, required: true },
  firstClass: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { _id: false });

// Airport Sub-Schema
const airportSubSchema = new mongoose.Schema({
  airportName: { type: String, required: true, trim: true },
  airportCode: { type: String, required: true, trim: true, minlength: 3, maxlength: 3 },
  airportCity: { type: String, required: true, trim: true },
  airportCountry: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true }
}, { _id: false });

// Route Sub-Schema
const routeSubSchema = new mongoose.Schema({
  departure: { type: airportSubSchema, required: true },
  destination: { type: airportSubSchema, required: true },
  distanceKM: { type: Number, required: true },
  durationMins: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { _id: false });

// Flight Sub-Schema
const flightSubSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Include flight ID
  flightNo: { type: String, required: true },
  airplane: { type: airplaneSubSchema, required: true },
  route: { type: routeSubSchema, required: true },
  days: [{ type: Number, required: true, min: 1, max: 7 }],
  time: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  isActive: { type: Boolean, default: true, required: true }
}, { _id: false });

// Pricing Sub-Schema
const pricingSubSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Include pricing ID
  priceName: { type: String, required: true, trim: true },
  basePrice: { type: Number, required: true, min: 0 },
  distanceFactor: { type: Number, required: true, min: 0 },
  firstClassFactor: { type: Number, required: true, min: 0 },
  businessFactor: { type: Number, required: true, min: 0 },
  premiumFactor: { type: Number, required: true, min: 0 },
  economyFactor: { type: Number, required: true, min: 0 }
}, { _id: false });

const commercialFlightSchema = new mongoose.Schema(
  {
    flight: {
      type: flightSubSchema,
      required: true,
    },
    pricing: {
      type: pricingSubSchema,
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    departureTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    bookings: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
      default: [],
    },
    availableSeats: {
      totalSeats: { type: Number, required: true },
      economySeat: { type: Number, required: true },
      premiumSeat: { type: Number, required: true },
      businessSeat: { type: Number, required: true },
      firstClass: { type: Number, required: true },
    },
    isActive: { type: Boolean, default: true },
    isCancelled: { type: Boolean, default: false },
    isDone: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

commercialFlightSchema.index(
  { 'flight._id': 1, date: 1, departureTime: 1 },
  { unique: true }
);

module.exports = mongoose.model('CommercialFlight', commercialFlightSchema);