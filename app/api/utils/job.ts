import { Client } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN! });
export const QueueJob = async (url: string, body: any) => {
  try {
    return await client.publishJSON({
      url,
      body,
    });
  } catch (error: any) {
    throw error;
  }
};
