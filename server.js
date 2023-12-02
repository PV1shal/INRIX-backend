import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/router.js";

const app = express();
app.use(cors());
dotenv.config();
const port = process.env.PORT || 5000;

app.use("/api", router);
app.use("*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
