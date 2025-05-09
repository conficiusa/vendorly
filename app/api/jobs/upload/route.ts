import { Client } from "@upstash/qstash";
import { NextResponse } from "next/server";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const images = formData.getAll("images");
    const storeId = formData.get("storeId");

    if (!images.length || !storeId) {
      return NextResponse.json(
        { error: "Images and storeId are required" },
        { status: 400 }
      );
    }

    // Create a job for each image
    const jobs = await Promise.all(
      images.map(async (image) => {
        const result = await client.publishJSON({
          url: `${process.env.QSTASH_URL}/api/jobs/targets/store-images`,
          body: {
            storeId,
            image,
          },
          options: {
            retries: 3,
            delay: 0,
            headers: {
              "bypass-tunnel-reminder": "true",
            },
          },
        });
        return result.messageId;
      })
    );

    return NextResponse.json({
      message: "Images queued for processing",
      jobIds: jobs,
    });
  } catch (error) {
    console.error("Error creating upload jobs:", error);
    return NextResponse.json(
      { error: "Failed to create upload jobs" },
      { status: 500 }
    );
  }
}
