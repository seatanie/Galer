const BUCKET = "galer-media";

export function getPublicMediaUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return path;
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

export function buildStoragePath(folder: string, fileName: string) {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${folder}/${Date.now()}-${safe}`;
}

export { BUCKET };
