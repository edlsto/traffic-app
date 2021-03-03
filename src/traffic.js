const mongoose = require("mongoose");

const trafficSchema = new mongoose.Schema({
  timeStamp: {
    type: Date,
    trim: true,
    required: true,
  },
  travelTime: {
    type: Number,
    trim: true,
    required: true,
  },
  direction: {
    type: String,
    trim: true,
    required: true,
  },
});

const Traffic = mongoose.model("Traffic", trafficSchema);

module.exports = Traffic;
