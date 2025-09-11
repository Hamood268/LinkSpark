const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  shortenUrl: {
    type: String,
    required: true,
    unique: true,
  },
  urlUsage: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const shortner = mongoose.model("Shortner", urlSchema);

module.exports = shortner;