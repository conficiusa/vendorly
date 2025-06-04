"use server";
import { Client } from "@upstash/qstash";

if (!process.env.QSTASH_TOKEN) {
  throw new Error("QSTASH_TOKEN is not set");
}
const client = new Client({ token: process.env.QSTASH_TOKEN });
export const QueueJob = async (url: string, body: any) => {
  try {
    const result = await client.publishJSON({
      url,
      body,
      method:"POST",
    });
    return result;
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};
