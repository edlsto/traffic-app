const axios = require("axios");
const { parseXMLData } = require("./utils");

const getTravelTimeData = async () => {
  const res = await axios.get(
    `https://api.cotrip.org/xml/speed_routes.xml?apiKey=${process.env.CDOT_API_KEY}`
  );
  let parsedData = parseXMLData(res);
  return parsedData.SpeedDetails.Route.filter(
    (route) => route.RouteId[0] === "18" || route.RouteId[0] === "116"
  );
};

const getCameraData = async () => {
  const res = await axios.get(
    `https://api.cotrip.org/xml/cameras.xml?apiKey=${process.env.CDOT_API_KEY}`
  );
  let parsedData = parseXMLData(res);
  return parsedData.CameraDetails.CameraTour[0];
};

module.exports = { getTravelTimeData, getCameraData };
