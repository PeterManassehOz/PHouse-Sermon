const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phcode: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, default: "" },
  lastname: { type: String, default: "" },
  phonenumber: { type: String, default: "" },
  city: { type: String, default: "" },
  churchbranch: { type: String, default: "" },
  state: { type: String, default: "" },
  zipcode: { type: String, default: "" },
  address: { type: String, default: "" },
  image: { type: String, default: "" },
  profileCompleted: { type: Boolean, default: false },
  resetToken: { type: String, default: null },
  resetTokenExpires: { type: Date, default: null },
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;