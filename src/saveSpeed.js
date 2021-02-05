const axios = require("axios");
const Traffic = require("./traffic");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const getData = async () => {
  const data = await axios.get("http://localhost:3000/speed");

  return data.data.map((datapoint) => ({
    timeStamp: datapoint.CalculatedDate[0],
    travelTime: parseInt(datapoint.TravelTimeInSeconds[0]),
    direction: datapoint.RoadInfo[0].DirectionTxt[0],
  }));
};

const saveSpeed = async () => {
  const data = await getData();
  console.log(data);
  data.forEach(async (datapoint) => {
    const traffic = new Traffic(datapoint);
    try {
      await traffic.save();
    } catch (error) {
      console.log(error);
    }
  });
};

saveSpeed();
