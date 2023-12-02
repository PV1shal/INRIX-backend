import axios from "axios";
import tokenValidation from "./tokenValidation.js";
import { response } from "express";

export default class InrixController {
  static async getIncidents(lat, long) {
    try {
      const token = await tokenValidation.getToken();
      const response = await axios.get("https://api.iq.inrix.com/v1/incidents", {
        params: {
          point: "37.754341|-122.482207",
          radius: 500,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw error; 
    }
  }

  static async getParkingLots(lat, long) {
    try {
      const token = await tokenValidation.getToken();
      const response = await axios.get("https://api.iq.inrix.com/lots/v3", {
        params: {
          point: "37.754341|-122.482207",
          radius: 500,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw error; 
    }
  }

  static async getStreetParking(lat, long) {
    try {
      const token = await tokenValidation.getToken();
      const response = await axios.get("https://api.iq.inrix.com/blocks/v3", {
        params: {
          point: "37.754341|-122.482207",
          radius: 500,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw error; 
    }
  }
}

