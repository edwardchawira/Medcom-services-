import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const BUCKET = "course-media";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

export type CourseMediaKind = "image" | "video";

export async function uploadCourseMedia(file: File, kind: CourseMediaKind): Promise<string> {
  const isImage = kind === "image";
  const allowed = isImage ? IMAGE_TYPES : VIDEO_TYPES;
  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;

  if (!allowed.has(file.type)) {
    throw new Error(isImage ? "Please upload a JPEG/PNG/WebP/GIF image." : "Please upload an MP4/WebM video.");
  }
  if (file.size > maxBytes) {
    throw new Error(isImage ? "Image must be 5 MB or smaller." : "Video must be 50 MB or smaller.");
  }

  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("You need to be signed in to upload media.");

  const extFromName = file.name.split(".").pop()?.toLowerCase() ?? "";
  const fallbackExt = isImage ? "png" : "mp4";
  const ext = extFromName || fallbackExt;

  const path = `${user.id}/${kind}/${Date.now()}-${crypto.randomUUID().slice(0, 10)}.${ext}`;

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (upErr) throw new Error(upErr.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

