import { randomUUID } from "crypto";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
export const MAX_GEAR_IMAGES = 8;
export const FULL_IMAGE_MAX_SIZE = 1600;
export const THUMB_IMAGE_MAX_SIZE = 400;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export const gearImageKeyPrefix = (ownerId: string, gearItemId: string) =>
  `users/${ownerId}/gear/${gearItemId}`;

export const buildOriginalImageKey = (
  ownerId: string,
  gearItemId: string,
  filename: string
) => {
  const prefix = gearImageKeyPrefix(ownerId, gearItemId);
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${prefix}/${randomUUID()}-${safeName}`;
};
