import express from "express";
import tokenValidation from "../controller/tokenValidation.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Inrix API");
});

router.get("/getToken", (req, res) => {
  res.send(tokenValidation.getToken());
});

export default router;
