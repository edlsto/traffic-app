const Traffic = require("./traffic");
const { getTravelTimeData } = require("./apiCalls");
const { parseTravelTimeData } = require("./utils");
require("./mongoose.js");

const saveToDatabase = (data) => {
  data.forEach((datapoint) => {
    const traffic = new Traffic(datapoint);
    traffic.save();
  });
};

const saveSpeed = async () => {
  try {
    const data = await getTravelTimeData();
    const parsedData = parseTravelTimeData(data);
    saveToDatabase(parsedData);
  } catch (error) {
    console.log(error.message);
  }
};

saveSpeed();
