"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { GALLERY_CATEGORIES } from "@/lib/admin/resources";
import { videoEmbed } from "@/lib/utils";
import { MediaImage } from "@/components/public/ui";

export function PlayOverlay({ title, src, children }: { title: string; src?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="block w-full cursor-pointer text-left"
        aria-label={`Play ${title}`}
      >
        {children}
      </div>
      {open ? <VideoDialog title={title} src={src || ""} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function VideoDialog({ title, src, onClose }: { title: string; src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const embed = videoEmbed(src);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/75 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-navy text-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <h3 className="truncate text-sm font-semibold">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close video" className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>
        {embed?.type === "iframe" ? (
          <iframe title={title} src={embed.src} className="aspect-video w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : embed?.type === "file" ? (
          <video src={embed.src} controls autoPlay className="aspect-video w-full bg-black" />
        ) : (
          <p className="px-6 py-16 text-center text-sm text-white/75">This film has not been added yet. Upload it from the admin panel.</p>
        )}
      </div>
    </div>
  );
}

type GalleryItem = { id: string; title: string; caption: string; image: string; category: string };

export function GalleryBrowser({ items, limit }: { items: GalleryItem[]; limit?: number }) {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const categories = ["All", ...GALLERY_CATEGORIES.filter((item) => items.some((photo) => photo.category === item))];
  const filtered = items.filter((item) => category === "All" || item.category === category);
  const visible = typeof limit === "number" ? filtered.slice(0, limit) : filtered;

  return (
    <>
      <div className="no-scrollbar mb-4 flex snap-x gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`shrink-0 snap-start rounded-full px-3 py-2 text-xs font-semibold ${category === item ? "bg-navy text-white" : "bg-canvas text-navy"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {visible.map((item) => (
          <div key={item.id} role="button" tabIndex={0} onClick={() => setActive(item)} onKeyDown={(event) => { if (event.key === "Enter") setActive(item); }} className="cursor-pointer text-left">
            <MediaImage src={item.image} alt={item.title} className="aspect-[4/3] w-full rounded-2xl" />
            <span className="mt-2 line-clamp-2 text-xs font-semibold text-navy">{item.title}</span>
          </div>
        ))}
      </div>
      {visible.length === 0 ? <p className="text-sm text-muted">No photographs in this category yet.</p> : null}
      {active ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/80 p-4" role="dialog" aria-modal="true" aria-label={active.title}>
          <button className="absolute inset-0" aria-label="Close photograph" onClick={() => setActive(null)} />
          <figure className="relative z-10 w-full max-w-3xl">
            <MediaImage src={active.image} alt={active.title} className="aspect-[16/10] w-full rounded-3xl" sizes="100vw" />
            <figcaption className="mt-3 text-sm text-white">
              <span className="font-semibold">{active.title}</span>
              {active.caption ? <span className="mt-1 block text-white/75">{active.caption}</span> : null}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
