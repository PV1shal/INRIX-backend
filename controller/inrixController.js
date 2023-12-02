import axios from "axios";
import tokenValidation from "./tokenValidation.js";
import { response } from "express";

export default class InrixController {
  static async getIncidents(lat, long) {
    const token = await tokenValidation.getToken();
    console.log(token);
    await axios
      .get("https://api.iq.inrix.com/v1/incidents", {
        params: {
          point: "37.757386|-122.490667",
          radius: 5,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }
}
