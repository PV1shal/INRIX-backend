import express from "express";
import tokenValidation from "../controller/tokenValidation.js";
import FindListings from "../controller/findListings.js";
import { searchProperties, nearbySchools } from "../controller/zillowController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Inrix API");
});

router.route("/getListings").post(FindListings.getListings);

router.post("/searchProperties", searchProperties);
router.get('/nearbySchools', nearbySchools);

router.get("/getToken", (req, res) => {
  res.send(tokenValidation.getToken());
});

export default router;
