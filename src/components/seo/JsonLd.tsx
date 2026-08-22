// src/components/seo/JsonLd.tsx
// Renders a JSON-LD block as a plain <script> tag.
//
// A plain tag (not next/script) is deliberate: Google's crawler reads structured data
// out of the raw server HTML, and next/script can defer injection past that read.
// The id is derived from the payload so it stays identical between server and client
// render — a random id causes React hydration mismatches.

const serialize = (data: unknown) =>
  JSON.stringify(data)
    // Prevents a stray "</script>" inside CMS copy from breaking out of the tag.
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

export default function JsonLd({ data, id }: { data: unknown; id?: string }) {
  if (!data) return null;

  // Derive a stable id from the graph's own @id / @type when one isn't supplied.
  const payload = data as any;
  const derived =
    id ||
    payload?.["@graph"]?.[0]?.["@id"] ||
    payload?.["@id"] ||
    payload?.["@type"] ||
    "jsonld";

  return (
    <script
      type="application/ld+json"
      id={`schema-${String(derived).replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`}
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
