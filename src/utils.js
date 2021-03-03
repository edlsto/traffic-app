const xml2js = require("xml2js");

const parseXMLData = (xml) => {
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

const parseTravelTimeData = (data) => {
  return data.map((datapoint) => ({
    timeStamp: new Date(datapoint.CalculatedDate[0]),
    travelTime: parseInt(datapoint.TravelTimeInSeconds[0]),
    direction: datapoint.RoadInfo[0].DirectionTxt[0],
  }));
};

module.exports = { parseXMLData, parseTravelTimeData };
