import InrixController from "./inrixController.js";

export default class FindListings {
  static async getListings(req, res) {
    const lat = req.query.lat;
    const long = req.query.long;
    const incidents = await InrixController.getIncidents(lat, long);
    res.send(incidents);
  }
}
