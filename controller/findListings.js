import InrixController from "./inrixController.js";

export default class FindListings {
  static async getListings(req, res) {
    const lat = req.query.lat;
    const long = req.query.long;


    const incidents = await InrixController.getIncidents(lat, long);
    var numIncidents = incidents.result.incidents.length;

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

    console.log(incidents);
    res.status(200).json({incidents});

  }
}
