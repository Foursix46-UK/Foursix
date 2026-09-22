// Serves Firebase Storage files from foursix46.com/media/<path>.
//
// Images used to load from firebasestorage.googleapis.com/v0/b/…/o/…?alt=media. That
// works in a browser, but for search it is a poor address: Google Images credits the
// image to googleapis.com rather than this site, the URL reads as an API call, and
// Storage sends `cache-control: private, max-age=0`, so nothing in front of it can
// cache it. Proxying through this route puts every image on our own domain with a
// public cache header, so Firebase Hosting's CDN keeps a copy after the first hit.
//
// It exposes nothing new: the upstream request carries no credentials, so it can
// only fetch files the Storage rules already make public.

const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

// Uploads get a random prefix (e.g. "y40v6_photo.jpg"), so a path's content never
// changes in practice. Browsers keep it a week; the CDN a month.
const CACHE_OK = "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400";
const CACHE_MISS = "public, max-age=60, s-maxage=300";

// Admins can upload SVG, and an SVG opened directly on this origin could run script
// with access to the admin's session. `sandbox` gives the response an opaque origin
// so it can never act as this site; plain <img> use is unaffected.
const SAFE_HEADERS = {
  "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;

  // Segments arrive decoded ("reg trademark logo 2.png"). Reject anything that isn't
  // a plain object name before building the upstream URL.
  if (!BUCKET || !path?.length || path.some((segment) => !segment || segment === "." || segment === "..")) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": CACHE_MISS } });
  }

  const objectName = path.join("/");
  const upstreamUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(objectName)}?alt=media`;

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, { cache: "no-store" });
  } catch {
    return new Response("Upstream unavailable", { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  if (!upstream.ok || !upstream.body) {
    // 403 from Storage means "not publicly readable" — to a visitor that's a 404.
    const status = upstream.status === 403 || upstream.status === 404 ? 404 : 502;
    return new Response("Not found", { status, headers: { "Cache-Control": status === 404 ? CACHE_MISS : "no-store" } });
  }

  const headers = new Headers({
    ...SAFE_HEADERS,
    "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
    "Cache-Control": CACHE_OK,
  });
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);
  const etag = upstream.headers.get("etag");
  if (etag) headers.set("ETag", etag);

  return new Response(upstream.body, { status: 200, headers });
}
