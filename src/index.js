const axios = require("axios");
const xml2js = require("xml2js");
const express = require("express");
const router = new express.Router();
const port = process.env.PORT;
const cors = require("cors");
const Traffic = require("./traffic");

const app = express();
app.use(express.json());
app.use(cors());

router.get("/photos", async (req, res) => {
  const data = await getData();
  res.send(JSON.stringify(data));
});

router.get("/speed", async (req, res) => {
  const data = await getTravelTime();
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

const getTravelTime = async () => {
  const res = await axios.get(
    `https://api.cotrip.org/xml/speed_routes.xml?apiKey=${process.env.CDOT_API_KEY}`
  );
  let parsedData = parseData(res);
  return parsedData.SpeedDetails.Route.filter(
    (route) => route.RouteId[0] === "18" || route.RouteId[0] === "116"
  );
};

const getData = async () => {
  const res = await axios.get(
    `https://api.cotrip.org/xml/cameras.xml?apiKey=${process.env.CDOT_API_KEY}`
  );
  let parsedData = parseData(res);
  return parsedData.CameraDetails.CameraTour[0];
};

const parseData = (xml) => {
  let data;
  xml2js.parseString(
    xml.data,
    { tagNameProcessors: [xml2js.processors.stripPrefix] },
    (err, result) => {
      if (err) {
        throw err;
      }
      data = result;
    }
  );
  return data;
};
