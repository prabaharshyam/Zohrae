import { createHash } from "node:crypto";

/**
 * Customer photo upload (photo magnets, Your Art Framed), stored in
 * Cloudinary. Without Cloudinary credentials it answers { error } and the site
 * falls back to collecting the photo on WhatsApp after the order.
 */
const MAX_BYTES = 15 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  // Not an error for the visitor: the photo is collected on WhatsApp instead.
  if (!cloud || !key || !secret) return Response.json({ error: "not-configured" });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "no-file" }, { status: 400 });
  if (!TYPES.has(file.type)) return Response.json({ error: "type" }, { status: 415 });
  if (file.size > MAX_BYTES) return Response.json({ error: "size" }, { status: 413 });

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "zohrae/customer-photos";
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
  const body = new FormData();
  body.set("file", file);
  body.set("api_key", key);
  body.set("timestamp", String(timestamp));
  body.set("folder", folder);
  body.set("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body });
  if (!res.ok) return Response.json({ error: "upload-failed" }, { status: 502 });
  const data = (await res.json()) as { secure_url: string };
  return Response.json({ url: data.secure_url });
}
