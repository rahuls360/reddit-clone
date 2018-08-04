const mongoose = require('mongoose');
const passportLocalSchema = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalSchema);

var User = mongoose.model('User', userSchema);

module.exports = User;