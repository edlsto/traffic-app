const express = require("express");
const router = new express.Router();
const port = process.env.PORT || 3000;
const cors = require("cors");
const Traffic = require("./traffic");
const { getCameraData, getTravelTimeData } = require("./apiCalls");
const moment = require("moment");
require("./mongoose.js");
require("moment-timezone");

const app = express();
app.use(express.json());
app.use(cors());

router.get("/photos", async (req, res) => {
  try {
    const data = await getCameraData();
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/speed", async (req, res) => {
  try {
    const data = await getTravelTimeData();
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/today", async (req, res) => {
  try {
    let data = await Traffic.find({
      timeStamp: {
        $gte: moment().tz("America/Denver").startOf("day").hour(3).format(),
      },
    });
    data = data.map((d) => ({
      timeStamp: d.timeStamp,
      travelTime: parseInt(d.travelTime),
      direction: d.direction,
    }));
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/lastweek", async (req, res) => {
  try {
    let data = await Traffic.find({
      timeStamp: {
        $gte: moment()
          .tz("America/Denver")
          .startOf("day")
          .hour(3)
          .subtract(7, "days")
          .format(),
        $lte: moment()
          .tz("America/Denver")
          .endOf("day")
          .subtract(7, "days")
          .format(),
      },
    });
    data = data.map((d) => ({
      timeStamp: d.timeStamp,
      travelTime: parseInt(d.travelTime),
      direction: d.direction,
    }));
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.use(router);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
