const mongoose = require("mongoose");

const trafficSchema = new mongoose.Schema({
  timeStamp: {
    type: String,
    trim: true,
    required: true,
  },
  travelTime: {
    type: String,
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
