import InrixController from "./inrixController.js";

export default class FindListings {
  static async getListings(req, res) {
    const lat = req.query.lat;
    const long = req.query.long;
    const noisePreference = req.query.noise;
    const parkingPreference = req.query.parking;


    const incidents = await InrixController.getIncidents(lat, long);
    var numIncidents = incidents.result.incidents.length;
    var noiseScore = 100;
    if (numIncidents > 5) {
      noiseScore = 0;
    }
    else if (numIncidents == 4) {
      noiseScore = 20;
    }
    else if (numIncidents == 3) {
      noiseScore = 40;
    }
    else if (numIncidents == 2) {
      noiseScore = 60;
    }
    else if (numIncidents == 1) {
      noiseScore = 80;
    }

    
    const parkingLots = await InrixController.getParkingLots(lat, long);
    var parkingLotSpots = 0;
    for (let i = 0; i < parkingLots.result.length; i++) {
      parkingLotSpots += parkingLots.result[i].spacesTotal;
    }

    const streetParking = await InrixController.getStreetParking(lat, long);
    var streetParkingSpots = 0;
    for (let x = 0; x < streetParking.result.length; x++) {
      for (let y = 0; y < streetParking.result[x].segments.length; y++) {
        streetParkingSpots += streetParking.result[x].segments[y].spacesTotal;
      }
    }

    var totalParkingSpots = parkingLotSpots + streetParkingSpots;
    var parkingScore = 100;
    if (totalParkingSpots < 5) {
      parkingScore = 0;
    }
    else if (totalParkingSpots > 5 && totalParkingSpots <= 10) {
      parkingScore = 20;
    }
    else if (totalParkingSpots > 10 && totalParkingSpots <= 20) {
      parkingScore = 40;
    }
    else if (totalParkingSpots > 20 && totalParkingSpots <= 30) {
      parkingScore = 60;
    }
    else if (totalParkingSpots > 30 && totalParkingSpots <= 40) {
      parkingScore = 80;
    }

    var propertyScore = (noiseScore * noisePreference) + (parkingScore * parkingPreference);

    console.log(streetParking);
    res.status(200).json({streetParking});

  }
}
