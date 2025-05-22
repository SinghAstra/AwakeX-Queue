import "dotenv/config";
import express, { Request, Response } from "express";
import { addJobToWakeUpQueue } from "./controllers/wake-up.js";

const app = express();
const PORT = 5000;

app.use(express.json());

app.post("/api/wake-up", addJobToWakeUpQueue);

app.get("/", (req: Request, res: Response) => {
  console.log("Request made to / endpoint");
  res.status(200).json({ message: "Service is up" });
});

app.listen(PORT, () => {
  console.log(`Service is listening on http://localhost:${PORT}`);
});
