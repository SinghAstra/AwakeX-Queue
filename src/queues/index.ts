import { Queue } from "bullmq";
import { QUEUES } from "../lib/constants.js";
import redisClient from "../lib/redis.js";

export const wakeUpQueue = new Queue(QUEUES.WAKE_UP, {
  connection: redisClient,
});
