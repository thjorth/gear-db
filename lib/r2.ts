import { S3Client } from "@aws-sdk/client-s3";

const requiredEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

export const r2Config = {
  accountId: requiredEnv(process.env.R2_ACCOUNT_ID, "R2_ACCOUNT_ID"),
  accessKeyId: requiredEnv(process.env.R2_ACCESS_KEY_ID, "R2_ACCESS_KEY_ID"),
  secretAccessKey: requiredEnv(
    process.env.R2_SECRET_ACCESS_KEY,
    "R2_SECRET_ACCESS_KEY"
  ),
  bucket: requiredEnv(process.env.R2_BUCKET, "R2_BUCKET"),
};

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
});
