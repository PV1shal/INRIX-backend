import axios from "axios";
import tokenValidation from "./tokenValidation.js";
import xml2j from "xml2js";

export default class InrixController {
  static async getIncidents(lat, long) {
    try {
      const token = await tokenValidation.getToken();
      const response = await axios.get("https://api.iq.inrix.com/v1/incidents", {
        params: {
          point: "37.770315|-122.446527",
          radius: 0.5, // in km
          incidenttype: "Construction"
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
          radius: 500, // in meters
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
          radius: 50, // in meters
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

  static async getTrafficFlow(lat, long) {
    try {
      const token = await tokenValidation.getToken();
      const response = await axios.get("https://api.iq.inrix.com/flow/v3", {
        params: {
          point: "37.754341|-122.482207",
          radius: 500,
          incidenttype: "Construction",
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

  static async pointInPoly(poly, pt) {
    const x = pt[0];
    const y = pt[1];

    const convertToPairs = (array) => {
      const pairs = [];
      for (let i = 0; i < array.length; i += 2) {
        const lat = parseFloat(array[i]);
        const lon = parseFloat(array[i + 1]);
        pairs.push([lat, lon]);
      }
      return pairs;
    };

    const polyBorder = await new Promise((resolve, reject) => {
      xml2j.parseString(poly.data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const posList =
            result.Inrix.Polygons[0].DriveTime[0].Polygon[0].exterior[0]
              .LinearRing[0].posList[0];
          const postList = posList.split(" ");
          resolve(convertToPairs(postList));
        }
      });
    });

    var inside = false;

    for (let i = 0, j = polyBorder.length - 1; i < polyBorder.length; j = i++) {
      const xi = polyBorder[i][0];
      const yi = polyBorder[i][1];
      const xj = polyBorder[j][0];
      const yj = polyBorder[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  static async getDriveTimePoly(lat, long) {
    try {
      const token = await tokenValidation.getToken();
      const driveTimePoly = await axios.get(
        "https://api.iq.inrix.com​/drivetimePolygons",
        {
          params: {
            center: "37.754341|-122.482207",
            rangeType: "D",
            duration: "30",
          },
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return this.pointInPoly(driveTimePoly, [lat, long]);
    } catch (error) {
      console.log(error.response);
      throw error;
    }
  }
}
