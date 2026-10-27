"use client";

import { useState } from "react";
import { fieldClass } from "@/components/public/ui";

export function MediaField({
  label,
  name,
  value,
  onChange,
  kind,
  help,
}: {
  label: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  kind: "image" | "video";
  help?: string;
}) {
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const limit = kind === "image" ? 8 * 1024 * 1024 : 80 * 1024 * 1024;

  async function upload(file: File) {
    setError("");
    if (file.size > limit) {
      setError(kind === "image" ? "Images must be 8 MB or smaller." : "Videos must be 80 MB or smaller.");
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) throw new Error(payload.error || "Upload failed.");
      onChange(payload.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold text-navy">{label}</span>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      {kind === "image" && value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-28 w-full rounded-xl object-cover" />
      ) : null}
      {kind === "video" && value && !/youtube|youtu\.be|vimeo|instagram\.com/i.test(value) ? (
        <video src={value} className="h-28 w-full rounded-xl bg-black" controls />
      ) : null}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={kind === "video" ? "YouTube, Vimeo, Instagram reel, or uploaded file" : "Image address"}
        className={fieldClass}
      />
      <label className="inline-flex w-fit cursor-pointer items-center rounded-xl bg-canvas px-3 py-2 text-sm font-semibold text-navy">
        {uploading ? "Uploading…" : kind === "image" ? "Upload image" : "Upload MP4 or WEBM"}
        <input
          type="file"
          accept={kind === "image" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/webm"}
          className="sr-only"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }}
        />
      </label>
      {help ? <p className="text-xs leading-5 text-muted">{help}</p> : null}
      {error ? <p className="text-xs font-medium text-red-700">{error}</p> : null}
    </div>
  );
}
