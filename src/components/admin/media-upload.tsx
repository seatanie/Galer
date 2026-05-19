"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BUCKET, buildStoragePath, getPublicMediaUrl } from "@/lib/supabase/storage";

interface MediaUploadProps {
  folder: string;
  onUploaded: (publicUrl: string) => void;
  accept?: string;
  label?: string;
}

export function MediaUpload({
  folder,
  onUploaded,
  accept = "image/*,video/*",
  label = "Subir archivo",
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const supabase = createClient();
    const path = buildStoragePath(folder, file.name);

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    onUploaded(getPublicMediaUrl(path));
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300 hover:bg-violet-500/20">
        <input type="file" accept={accept} className="hidden" onChange={handleFile} disabled={uploading} />
        {uploading ? "Subiendo…" : label}
      </label>
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
