const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    default:'New User'
  },
  mobileNumber: {
    type: String,
    trim: true,
  },
  imageUrl: { type: String},
  rating: {
    type: Number,
    default: 0, // Default rating value
    min: 0, // Minimum rating value
    max: 5, // Maximum rating value
  },
  peopleRated: {
    type: Number,
    default: 0, // Default number of people who rated
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
