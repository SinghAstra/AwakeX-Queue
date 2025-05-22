import { Worker } from "bullmq";
import { CONCURRENT_WORKERS, QUEUES } from "../lib/constants.js";
import redisClient from "../lib/redis.js";

export const wakeUpWorker = new Worker(
  QUEUES.WAKE_UP,
  async (job) => {
    console.log("Starting wake up worker...");
    const { apiURL } = job.data;

    console.log("API URL in wakeUpWorker :", apiURL);

    const response = await fetch(apiURL);
    const data = await response.json();
    console.log("data in wakeUpWorker :", data);

    try {
      return { status: "SUCCESS", message: `Started : ${apiURL}` };
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
    }
  },
  {
    connection: redisClient,
    concurrency: CONCURRENT_WORKERS,
  }
);

wakeUpWorker.on("failed", (error) => {
  if (error instanceof Error) {
    console.log("error.stack is ", error.stack);
    console.log("error.message is ", error.message);
  }
  console.log("Error occurred in wakeUp worker");
});

wakeUpWorker.on("completed", () => {
  console.log("WakeUp worker completed");
});

const shutdown = async () => {
  console.log("Shutting down worker gracefully...");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
