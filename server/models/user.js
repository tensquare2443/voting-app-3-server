const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: 6,
    maxLength: 18
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 18
  },
  accountCreatedAt: {
    type: Number
  },
  pollsCreated: {
    type: Array
  }
});

UserSchema.path("username").validate(function(username) {
  return username.length <= 18 && username.length >= 6;
}, "Username must be between 6 and 18 characters.");

UserSchema.path("username").validate(function(username) {
  return username === username.replace(/[\W]/g, "");
}, "Username must contain only alphanumeric characters.");


UserSchema.path("password").validate(function(password) {
  return password.length <= 18 && password.length >= 6;
}, "Password must be between 6 and 18 characters.");

var User = mongoose.model("User", UserSchema);

module.exports = {User};
