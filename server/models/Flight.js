// const mongoose = require('mongoose');

// const flightSchema = new mongoose.Schema({
//   flightNo: { 
//     type: String, 
//     required: true 
//   },
//   airplane: {
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Airplane', 
//     required: true 
//   },
//   route: {
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Route', 
//     required: true 
//   },
//   days: [{
//     type: Number,
//     required: true,
//     min: 1,
//     max: 7
//   }],
//   time: {
//     type: String,
//     required: true,
//     match: /^([01]\d|2[0-3]):[0-5]\d$/
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//     required: true
//   }
// },{ timestamps: true });

// const Flight = mongoose.model('Flight', flightSchema);
// module.exports = Flight;


// models/flight.js


const mongoose = require('mongoose');

// Define the Airplane sub-schema
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

// Define the Airport sub-schema
const airportSubSchema = new mongoose.Schema({
  airportName: { type: String, required: true, trim: true },
  airportCode: { type: String, required: true, trim: true, minlength: 3, maxlength: 3 },
  airportCity: { type: String, required: true, trim: true },
  airportCountry: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true }
}, { _id: false });

// Define the Route sub-schema
const routeSubSchema = new mongoose.Schema({
  departure: { type: airportSubSchema, required: true },
  destination: { type: airportSubSchema, required: true },
  distanceKM: { type: Number, required: true },
  durationMins: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { _id: false });

// Define the main Flight schema
const flightSchema = new mongoose.Schema({
  flightNo: { type: String, required: true },
  airplane: { type: airplaneSubSchema, required: true },
  route: { type: routeSubSchema, required: true },
  days: [{ type: Number, required: true, min: 1, max: 7 }],
  time: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  isActive: { type: Boolean, default: true, required: true }
}, { timestamps: true });

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
