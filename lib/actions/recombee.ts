"use server";

import { QUEUE_URLS } from "@/app/api/utils/constants";
import { QueueJob } from "@/app/api/utils/job";
import { getRecombeeUser } from "../utils/recombee";

export const queueAddUser = async (userId: string) => {
  const user = await getRecombeeUser(userId);
  console.log("user", user);
    if (user) return;
    
  await QueueJob(QUEUE_URLS.RECOMBEE, {
    type: "addUser",
    userId,
  });
};
