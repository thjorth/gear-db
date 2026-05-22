"use client";

import { useEffect, useState } from "react";

type GearImageView = {
  id: string;
  thumbUrl: string;
  fullUrl: string;
};

type UploadUrlResponse = {
  uploadUrl: string;
  key: string;
};

type GearImageUploaderProps = {
  gearItemId: string;
};

const MAX_IMAGES = 8;

export default function GearImageUploader({ gearItemId }: GearImageUploaderProps) {
  const [images, setImages] = useState<GearImageView[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refreshImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/gear-images/list?gearItemId=${encodeURIComponent(gearItemId)}`
      );
      if (!response.ok) {
        const message = await response.json();
        throw new Error(message?.error ?? "Could not load images.");
      }
      const data = (await response.json()) as { images: GearImageView[] };
      setImages(data.images ?? []);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Could not load images.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshImages();
  }, [gearItemId]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError("You have reached the maximum of 8 images for this item.");
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      setError("Only 8 images can be uploaded per item. Extra files were skipped.");
    } else {
      setError(null);
    }

    setIsUploading(true);

    try {
      for (const file of selectedFiles) {
        const uploadUrlResponse = await fetch("/api/gear-images/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gearItemId,
            filename: file.name,
            contentType: file.type,
            size: file.size,
          }),
        });

        if (!uploadUrlResponse.ok) {
          const message = await uploadUrlResponse.json();
          throw new Error(message?.error ?? "Could not request upload URL.");
        }

        const { uploadUrl, key } =
          (await uploadUrlResponse.json()) as UploadUrlResponse;

        const uploadResult = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadResult.ok) {
          throw new Error("Upload failed. Please try again.");
        }

        const completeResponse = await fetch("/api/gear-images/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gearItemId, key }),
        });

        if (!completeResponse.ok) {
          const message = await completeResponse.json();
          throw new Error(message?.error ?? "Could not process the image.");
        }

        await refreshImages();
      }
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed.";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId);
    setError(null);
    try {
      const response = await fetch("/api/gear-images/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gearImageId: imageId }),
      });

      if (!response.ok) {
        const message = await response.json();
        throw new Error(message?.error ?? "Could not delete the image.");
      }

      await refreshImages();
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete the image.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const isAtLimit = images.length >= MAX_IMAGES;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <label className="label" htmlFor="gear-images">
        Gear images ({images.length}/{MAX_IMAGES})
      </label>
      <input
        id="gear-images"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="input"
        disabled={isUploading || isAtLimit}
        onChange={(event) => handleFiles(event.target.files)}
      />
      <p style={{ fontSize: 13, color: "#6b7280" }}>
        Uploads are processed into full and thumbnail sizes.
      </p>
      {isUploading ? <p>Uploading…</p> : null}
      {isLoading ? <p>Loading images…</p> : null}
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      {images.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 12,
          }}
        >
          {images.map((image) => (
            <div
              key={image.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 8,
                display: "grid",
                gap: 8,
              }}
            >
              <a href={image.fullUrl} target="_blank" rel="noreferrer">
                <img
                  src={image.thumbUrl}
                  alt="Gear thumbnail"
                  style={{ width: "100%", borderRadius: 6, display: "block" }}
                />
              </a>
              <button
                type="button"
                className="button"
                disabled={deletingId === image.id}
                onClick={() => handleDelete(image.id)}
              >
                {deletingId === image.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
