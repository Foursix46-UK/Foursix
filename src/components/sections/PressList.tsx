// Press coverage list for /press. Server component on purpose — no "use client" —
// so each headline, outlet and link is in the page HTML rather than added by
// JavaScript after load. Layout follows the 46dc.com press cards.
import { ArrowUpRight, Download } from "lucide-react";

export type PressMention = {
  id: string;
  title: string;
  outlet: string;
  mediaType: string;
  dateMs: number;
  url: string;
  description: string;
  pullQuote: string;
  thumbnail: string;
  thumbnailAlt: string;
  outletLogo: string;
  downloadableAsset: string;
  featured: boolean;
  sortOrder: number;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

export default function PressList({ mentions }: { mentions: PressMention[] }) {
  if (mentions.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 py-24 text-center">
        <p className="text-white/40 text-lg font-light">No press coverage has been published yet.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-6">
      {mentions.map((item) => (
        <li key={item.id}>
          <article className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-primary/40 hover:bg-white/[0.05]">
            {/* Media — thumbnail, then outlet logo, then the outlet name */}
            <div className="relative w-full md:w-[300px] lg:w-[340px] shrink-0 aspect-[16/10] md:aspect-auto md:min-h-[220px] bg-white/[0.04]">
              {item.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail}
                  alt={item.thumbnailAlt || item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : item.outletLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.outletLogo}
                  alt={item.outlet ? `${item.outlet} logo` : ""}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain p-12 opacity-60"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent">
                  <span className="text-2xl font-semibold text-white/25 text-center leading-tight">{item.outlet}</span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between p-7 md:p-9">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  {(item.featured || item.mediaType) && (
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                      {item.featured ? "Featured" : item.mediaType}
                    </span>
                  )}
                  {item.outlet && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">{item.outlet}</span>
                  )}
                  {item.dateMs > 0 && (
                    <time
                      dateTime={new Date(item.dateMs).toISOString().slice(0, 10)}
                      className="text-[10px] font-mono uppercase tracking-widest text-white/30"
                    >
                      {dateFormat.format(new Date(item.dateMs))}
                    </time>
                  )}
                </div>

                <h2 className="mb-4 text-xl md:text-2xl lg:text-3xl font-medium leading-snug text-white transition-colors duration-300 group-hover:text-primary">
                  {/* The stretched link makes the whole card clickable without nesting the
                      download link inside another anchor, which is invalid HTML. */}
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
                    {item.title}
                  </a>
                </h2>

                {item.description && (
                  <p className="text-sm leading-relaxed text-white/60 line-clamp-3">{item.description}</p>
                )}

                {item.pullQuote && (
                  <blockquote className="mt-4 border-l-2 border-primary/40 pl-4 text-sm italic text-white/70 line-clamp-2">
                    {item.pullQuote}
                  </blockquote>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                {item.downloadableAsset && (
                  <a
                    href={item.downloadableAsset}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/50 transition-colors hover:text-primary"
                  >
                    <Download size={12} aria-hidden="true" />
                    Download asset
                  </a>
                )}
                <span aria-hidden="true" className="ml-auto flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Read article
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 transition-colors duration-300 group-hover:bg-primary">
                    <ArrowUpRight size={14} className="text-primary transition-colors duration-300 group-hover:text-white" />
                  </span>
                </span>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
