const express = require("express");
const router = new express.Router();
const port = process.env.PORT || 3000;
const cors = require("cors");
const Traffic = require("./traffic");
const { getCameraData, getTravelTimeData } = require("./apiCalls");
require("./mongoose.js");

const app = express();
app.use(express.json());
app.use(cors());

const getMidnight = (date) => new Date(date.setHours(0, 0, 0, 0));
const getMidnightAfter = (date) => new Date(date.setHours(24, 0, 0, 0));

function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

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
  const date = convertTZ(new Date(), "America/Denver");
  const midnight = getMidnight(date);
  try {
    let data = await Traffic.find({
      timeStamp: {
        $gte: midnight,
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
  const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
  const date = convertTZ(oneWeekAgo, "America/Denver");
  const midnightOneWeekAgo = getMidnight(date);
  const midnightAfterOneWeekAgo = getMidnightAfter(date);
  try {
    let data = await Traffic.find({
      timeStamp: {
        $gte: midnightOneWeekAgo,
        $lte: midnightAfterOneWeekAgo,
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
