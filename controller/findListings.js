import InrixController from "./inrixController.js";

export default class FindListings {
  static async getListings(req, res) {
    const lat = req.query.lat;
    const long = req.query.long;

    const incidents = await InrixController.getIncidents(lat, long);
    const parkingLots = await InrixController.getParkingLots(lat, long);
    console.log("test");
    console.log(parkingLots);
    res.status(200).json({parkingLots});

    
  }
}
