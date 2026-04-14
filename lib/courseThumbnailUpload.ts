import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const BUCKET = "course-thumbnails";

/**
 * Upload a cover image to Supabase Storage (public bucket, path scoped to user id).
 * Returns the public URL to store on the course row.
 */
export async function uploadCourseThumbnail(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Please use a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    throw new Error("You need to be signed in to upload images.");
  }

  const extFromName = file.name.split(".").pop()?.toLowerCase() ?? "";
  const ext =
    extFromName === "jpg" || extFromName === "jpeg"
      ? "jpg"
      : extFromName === "png"
        ? "png"
        : extFromName === "webp"
          ? "webp"
          : extFromName === "gif"
            ? "gif"
            : file.type === "image/jpeg"
              ? "jpg"
              : file.type === "image/png"
                ? "png"
                : file.type === "image/webp"
                  ? "webp"
                  : "gif";

  const path = `${user.id}/${Date.now()}-${crypto.randomUUID().slice(0, 10)}.${ext}`;

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (upErr) {
    throw new Error(upErr.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
