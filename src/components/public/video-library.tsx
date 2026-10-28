"use client";

import { useState } from "react";
import { PlayOverlay } from "@/components/public/overlays";
import { MediaImage, VideoPoster } from "@/components/public/ui";
import { videoPlatform, videoPoster } from "@/lib/utils";

export type Talk = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  sourceUrl: string;
  duration: string;
  category: string;
};

const PLATFORMS = ["All", "YouTube", "Instagram"];

export function VideoLibrary({ talks }: { talks: Talk[] }) {
  const [platform, setPlatform] = useState("All");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(talks.map((talk) => talk.category)))];
  const visible = talks.filter((talk) => {
    const talkPlatform = videoPlatform(talk.sourceUrl);
    const platformOk = platform === "All" || talkPlatform === platform;
    const categoryOk = category === "All" || talk.category === category;
    return platformOk && categoryOk;
  });

  return (
    <>
      <div className="no-scrollbar mb-3 flex snap-x gap-2 overflow-x-auto pb-1">
        {PLATFORMS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPlatform(item)}
            className={`shrink-0 snap-start rounded-full px-3 py-2 text-xs font-semibold ${platform === item ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/10"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="no-scrollbar mb-4 flex snap-x gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`shrink-0 snap-start rounded-full px-3 py-2 text-xs font-semibold ${category === item ? "bg-cream text-navy ring-1 ring-navy/15" : "bg-white text-navy ring-1 ring-navy/10"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((talk) => {
          const poster = talk.thumbnail || videoPoster(talk.sourceUrl);
          const source = videoPlatform(talk.sourceUrl);
          return (
            <PlayOverlay key={talk.id} title={talk.title} src={talk.sourceUrl}>
              <article id={talk.slug} className="h-full rounded-[28px] bg-white p-3 ring-1 ring-navy/5">
                <div className="relative">
                  {poster ? (
                    <MediaImage src={poster} alt="" className={source === "Instagram" ? "aspect-[4/5] w-full rounded-2xl" : "aspect-video w-full rounded-2xl"} />
                  ) : (
                    <VideoPoster className={source === "Instagram" ? "aspect-[4/5] w-full rounded-2xl" : "aspect-video w-full rounded-2xl"} />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy">
                    {source}
                  </span>
                  <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-lg">
                    <span className="ml-0.5 inline-block border-y-[7px] border-l-[11px] border-y-transparent border-l-navy" />
                  </span>
                  {talk.duration ? <span className="absolute bottom-2 right-2 rounded bg-navy/80 px-2 py-0.5 text-xs text-white">{talk.duration}</span> : null}
                </div>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{talk.category}</p>
                <h2 className="mt-1 text-base font-semibold leading-6 text-navy">{talk.title}</h2>
                {talk.description ? <p className="mt-1 line-clamp-3 text-sm leading-6 text-muted">{talk.description}</p> : null}
              </article>
            </PlayOverlay>
          );
        })}
      </div>
      {visible.length === 0 ? <p className="text-sm text-muted">No talks in this category yet.</p> : null}
    </>
  );
}
