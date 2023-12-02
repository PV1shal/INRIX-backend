import express from "express";
import tokenValidation from "../controller/tokenValidation.js";
import FindListings from "../controller/findListings.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Inrix API");
});

router.route("/getListings").get(FindListings.getListings);

router.get("/getToken", (req, res) => {
  res.send(tokenValidation.getToken());
});

export default router;
