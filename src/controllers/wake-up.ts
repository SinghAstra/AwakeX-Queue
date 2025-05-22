import { Request, Response } from "express";
import { QUEUES } from "../lib/constants.js";
import { wakeUpQueue } from "../queues/index.js";

export const addJobToWakeUpQueue = async (req: Request, res: Response) => {
  try {
    const { apiURL } = req.body;

    console.log("apiURL is ", apiURL);

    // Add job to the wake up queue
    await wakeUpQueue.add(
      QUEUES.WAKE_UP,
      {
        apiURL,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    res
      .status(500)
      .json({ success: false, message: "Failed to queue wake up job" });
  }
};
