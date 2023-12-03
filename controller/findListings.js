import InrixController from "./inrixController.js";
import { getPropertiesByAddress } from "./zillowController.js";
import xml2j from "xml2js";


export default class FindListings {
  static async getListings(req, res) {
    // {
    //   location: '',
    //   minPrice: 0,
    //   maxPrice: 0,
    //   bathPref: 1,
    //   bedPref: 1,
    //   preferences: { noise: 1, parking: 1, transit: 1 },
    //   commuteSelection: false,
    //   preferredTime: '',
    //   destination: ''
    // }
    console.log(req.body);
    const lat = req.body.lat;
    const long = req.body.long;
    const noisePreference = req.body.preferences.noise;
    const parkingPreference = req.body.preferences.parking;
    const address = req.body.location;
    const minPrice = req.body.minPrice;
    const maxPrice = req.body.maxPrice;
    const bathPref = req.body.bathPref;
    const bedPref = req.body.bedPref;
    const commuteSelection = req.body.commuteSelection;
    const workAddress = req.body.destination;
    const preferredTime = req.body.preferredTime;

    console.log(
      lat,
      long,
      noisePreference,
      parkingPreference,
      address,
      minPrice,
      maxPrice,
      bathPref,
      bedPref,
      commuteSelection,
      workAddress,
      preferredTime
    );

    // Filter all properties based on address
    const properties = await getPropertiesByAddress(address);
    
    if (commuteSelection) {
      const poly = await InrixController.getDriveTimePoly(workAddress[0], workAddress[1], preferredTime);
      const polyBorder = await new Promise((resolve, reject) => {
        xml2j.parseString(poly.data, (err, result) => {
          if (err) {
            reject(err);
          } else {
            const posList =
              result.Inrix.Polygons[0].DriveTime[0].Polygon[0].exterior[0]
                .LinearRing[0].posList[0];
            const postList = posList.split(" ");
            resolve(InrixController.convertToPairs(postList));
          }
        });
      });
      for (let i = 0; i < properties.results.length; i++) {
        if (!InrixController.pointInPoly(polyBorder, properties.results[i].latitude, properties.results[i].longitude)) {
          properties.results.splice(i, 1);
        };
      };
    }
    console.log(properties);
    // Generate filtered data based on user's parameters
    const filteredData = properties.results.filter(property => {
      return property.maxPrice <= maxPrice && 
      property.bathPref > bathPref && 
      property.bedPref > bedPref;
    });

    console.log(filteredData);

    // const incidents = await InrixController.getIncidents(lat, long);
    // var numIncidents = incidents.result.incidents.length;
    // var noiseScore = 100;
    // if (numIncidents > 5) {
    //   noiseScore = 0;
    // } else if (numIncidents == 4) {
    //   noiseScore = 20;
    // } else if (numIncidents == 3) {
    //   noiseScore = 40;
    // } else if (numIncidents == 2) {
    //   noiseScore = 60;
    // } else if (numIncidents == 1) {
    //   noiseScore = 80;
    // }

    // const parkingLots = await InrixController.getParkingLots(lat, long);
    // var parkingLotSpots = 0;
    // for (let i = 0; i < parkingLots.result.length; i++) {
    //   parkingLotSpots += parkingLots.result[i].spacesTotal;
    // }

    // const streetParking = await InrixController.getStreetParking(lat, long);
    // var streetParkingSpots = 0;
    // for (let x = 0; x < streetParking.result.length; x++) {
    //   for (let y = 0; y < streetParking.result[x].segments.length; y++) {
    //     streetParkingSpots += streetParking.result[x].segments[y].spacesTotal;
    //   }
    // }

    // var totalParkingSpots = parkingLotSpots + streetParkingSpots;
    // var parkingScore = 100;
    // if (totalParkingSpots < 5) {
    //   parkingScore = 0;
    // } else if (totalParkingSpots > 5 && totalParkingSpots <= 10) {
    //   parkingScore = 20;
    // } else if (totalParkingSpots > 10 && totalParkingSpots <= 20) {
    //   parkingScore = 40;
    // } else if (totalParkingSpots > 20 && totalParkingSpots <= 30) {
    //   parkingScore = 60;
    // } else if (totalParkingSpots > 30 && totalParkingSpots <= 40) {
    //   parkingScore = 80;
    // }

    // var propertyScore =
    //   noiseScore * noisePreference + parkingScore * parkingPreference;

    // console.log(streetParking);
    // res.status(200).json({ streetParking });
  }
}
