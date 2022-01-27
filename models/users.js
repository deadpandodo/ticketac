const mongoose = require('mongoose');


var userSchema = mongoose.Schema({
  lastname: String,
  firstname: String,
  email: String,
  password: String,
});

module.exports = mongoose.model('users', userSchema);