import { Storage } from "@google-cloud/storage";
import { format } from "date-fns";

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || "{}"),
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET || "");

export const uploadToGCS = async (
  file: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  const datePrefix = format(new Date(), "yyyy/MM/dd");
  const destinationPath = `documents/${datePrefix}/${fileName}`;
  const blob = bucket.file(destinationPath);

  await blob.save(file, {
    metadata: {
      contentType: mimeType,
    },
  });

  await blob.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
};
