const mongoose = require('mongoose');


var tripSchema = mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  departureTime: String,
  price: Number
});


var userSchema = mongoose.Schema({
  lastname: String,
  firstname: String,
  email: String,
  password: String,
  trips: [tripSchema]
});

module.exports = mongoose.model('users', userSchema);