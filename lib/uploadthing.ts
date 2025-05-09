import { UploadRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({});
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<UploadRouter>();
