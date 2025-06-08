"use server";

import { QUEUE_URLS } from "@/app/api/utils/constants";
import { QueueJob } from "@/app/api/utils/job";
import { getRecombeeUser } from "../utils/recombee";

export const queueAddUser = async (userId: string) => {
  await getRecombeeUser(userId).catch(async (err) => {
    if (err.statusCode === 404) {
      console.log("User not found, adding user to Recombee");
      await QueueJob(QUEUE_URLS.RECOMBEE, {
        type: "addUser",
        userId,
      });
    }
  });
};
