const express = require("express");
const router = new express.Router();
const port = process.env.PORT;
const cors = require("cors");
const Traffic = require("./traffic");
const { getCameraData } = require("./apiCalls");
require("./mongoose.js");

const app = express();
app.use(express.json());
app.use(cors());

router.get("/photos", async (req, res) => {
  const data = await getCameraData();
  res.send(JSON.stringify(data));
});

router.get("/historical", async (req, res) => {
  let data = await Traffic.find({});
  data = data.map((d) => ({
    timeStamp: d.timeStamp,
    travelTime: d.travelTime,
    direction: d.direction,
  }));
  res.send(JSON.stringify(data));
});

app.use(router);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
