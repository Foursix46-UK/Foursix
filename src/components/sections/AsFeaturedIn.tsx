// "As featured in" strip on the homepage, built from the Press & Media CMS entries.
// One mark per outlet (its logo, or its name when no logo is uploaded), each linking
// to the original coverage, plus a link through to the full /press page.
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type FeaturedOutlet = {
  id: string;
  outlet: string;
  outletLogo: string;
  url: string;
};

type AsFeaturedInProps = {
  outlets: FeaturedOutlet[];
  data?: { featuredInLabel?: string; featuredInCtaText?: string };
};

export default function AsFeaturedIn({ outlets, data }: AsFeaturedInProps) {
  // No qualifying coverage yet: render nothing rather than an empty band.
  if (outlets.length === 0) return null;

  return (
    <section aria-labelledby="as-featured-in" className="bg-black border-y border-white/10 px-6 py-14 md:py-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        <h2
          id="as-featured-in"
          className="text-[10px] font-semibold uppercase tracking-[0.4em] text-primary text-center"
        >
          {data?.featuredInLabel || "As featured in"}
        </h2>

        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16">
          {outlets.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.outlet} (opens the original article)`}
                className="group flex h-12 items-center opacity-60 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100"
              >
                {item.outletLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.outletLogo}
                    alt={`${item.outlet} logo`}
                    loading="lazy"
                    className="max-h-10 w-auto max-w-[160px] object-contain grayscale brightness-200 transition duration-300 group-hover:grayscale-0 group-hover:brightness-100"
                  />
                ) : (
                  <span className="text-xl md:text-2xl font-semibold tracking-tight text-white whitespace-nowrap">
                    {item.outlet}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>

        <Link
          href="/press"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-primary"
        >
          {data?.featuredInCtaText || "View Press & Media"} <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
