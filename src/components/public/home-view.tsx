import type { getHomeData } from "@/lib/queries";
import { Phone, Play } from "lucide-react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { WhatsAppIcon } from "@/components/logo";
import { BusinessCard } from "@/components/public/business-card";
import { Hero } from "@/components/public/hero";
import { GalleryBrowser, PlayOverlay } from "@/components/public/overlays";
import { btnOnDark, btnOutlineLight, btnPrimary, Container, MediaImage, Panel, SectionTitle, VideoPoster } from "@/components/public/ui";
import { describeHours, formatDate, videoPlatform, videoPoster, whatsappLink } from "@/lib/utils";

type HomeData = NonNullable<Awaited<ReturnType<typeof getHomeData>>>;

function PlayBadge() {
  return (
    <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-lg">
      <Play className="ml-0.5 h-4 w-4 fill-current" />
    </span>
  );
}

function TrophyArt() {
  return (
    <div className="relative hidden min-h-40 overflow-hidden rounded-3xl bg-gradient-to-b from-[#f8f1e4] to-[#e7d3ae] sm:block">
      <svg viewBox="0 0 80 120" className="mx-auto mt-4 h-36 w-24" aria-hidden>
        <path d="M22 16h36v20c0 14-7 24-18 27C29 60 22 50 22 36V16z" fill="#e0b33a" />
        <path d="M22 22H12c0 12 5 18 12 20M58 22h10c0 12-5 18-12 20" fill="none" stroke="#c8921a" strokeWidth="4" />
        <path d="M34 64h12v12H34zM26 78h28v8H26zM30 88h20v6H30z" fill="#c8921a" />
      </svg>
    </div>
  );
}

export function HomeView({ data }: { data: HomeData }) {
  const { settings } = data;
  const highlights = data.stats.filter((item) => item.group === "highlight");
  const aboutStats = data.stats.filter((item) => item.group === "about");
  const ctaStats = data.stats.filter((item) => item.group === "cta");
  const youtubeTalks = data.videos.filter((item) => videoPlatform(item.sourceUrl) === "YouTube");
  const instaReels = data.videos.filter((item) => videoPlatform(item.sourceUrl) === "Instagram");
  const mixedTalks = [...youtubeTalks.slice(0, 2), ...instaReels.slice(0, 2)];
  const videoCards = mixedTalks.length >= 2 ? mixedTalks : data.videos.slice(0, 4);
  const achievementPhotos = data.achievements.filter((item) => item.image).slice(0, 4);
  const posts = data.posts.slice(0, 3);
  const homeReels = instaReels.slice(0, 8);
  const hours = describeHours(settings);
  const chat = whatsappLink(settings.whatsapp, `Hello ${settings.doctorName}, I would like to inquire about a consultation.`);

  return (
    <Container className="space-y-4 py-4 sm:py-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Physician",
            name: settings.doctorName,
            medicalSpecialty: "Neurosurgery",
            telephone: settings.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: settings.address,
              addressLocality: "Ahmedabad",
              addressRegion: "Gujarat",
              postalCode: "380006",
              addressCountry: "IN",
            },
            hasMap: settings.mapUrl || undefined,
            sameAs: [settings.instagramUrl, settings.youtubeUrl, settings.mapUrl].filter(Boolean),
          }),
        }}
      />
      <div className="space-y-4">
          <div>
            <Hero
              slides={data.slides.map((slide) => ({ image: slide.image, alt: slide.alt, quote: slide.quote }))}
              eyebrow={settings.heroEyebrow}
              title={settings.heroTitle}
              subtitle={settings.heroSubtitle}
              quote={settings.heroQuote}
              author={settings.heroQuoteAuthor}
              phone={settings.phone}
              whatsapp={settings.whatsapp}
              portrait={settings.aboutImage}
              portraitAlt={`${settings.doctorName}, ${settings.roleTitle}`}
            />
            <div className="relative z-10 -mt-7 px-1 sm:-mt-8 sm:px-6">
              <div className="grid grid-cols-1 gap-3 rounded-[24px] bg-white px-4 py-4 shadow-[0_18px_40px_-28px_rgba(12,35,64,0.7)] ring-1 ring-navy/5 min-[480px]:grid-cols-2 sm:rounded-[28px] sm:px-6 lg:grid-cols-4">
                {highlights.map((item) => (
                  <div key={item.id} className="flex min-w-0 items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cream text-navy sm:h-12 sm:w-12">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-navy">{item.value || item.label}</span>
                      {item.value ? <span className="block text-xs leading-4 text-muted">{item.label}</span> : null}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Panel>
            <SectionTitle title="Conditions We Treat" href="/treatments" action="View all treatments" />
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
              {data.conditions.map((item) => (
                <Link key={item.id} href={`/treatments/${item.slug}`} className="flex items-start gap-3 rounded-2xl p-2 transition hover:bg-canvas">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cream text-navy">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-navy">{item.title}</span>
                    <span className="block text-xs leading-4 text-muted">{item.summary}</span>
                  </span>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="grid items-center gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
              <MediaImage src={settings.aboutImage} alt={`${settings.doctorName}, ${settings.roleTitle}`} objectPosition="center 18%" className="mx-auto aspect-[3/4] w-full max-w-[160px] rounded-[24px] lg:mx-0" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{settings.aboutEyebrow}</p>
                <h2 className="mt-1 text-2xl font-semibold text-navy">{settings.doctorName}</h2>
                <p className="mt-1 text-sm text-muted">{settings.aboutDegrees}</p>
                <p className="text-sm font-medium text-navy">{settings.roleTitle}</p>
                <p className="mt-2 text-sm leading-6 text-ink/80">{settings.aboutBio}</p>
                <blockquote className="mt-3 font-serif text-lg italic leading-snug text-navy">“{settings.aboutQuote}”</blockquote>
                <Link href="/about" className={`${btnPrimary} mt-3 h-auto whitespace-normal text-center leading-5`}>
                  Know more about {settings.doctorName} →
                </Link>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 sm:grid-cols-3 xl:grid-cols-5">
              {aboutStats.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-navy">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <dt className="text-sm font-semibold leading-4 text-navy">{item.value || item.label}</dt>
                    {item.value ? <dd className="text-xs leading-4 text-muted">{item.label}</dd> : null}
                  </span>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Recognition for a greater purpose" title="Achievements" href="/achievements" action="View all" />
            {achievementPhotos.length ? (
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {achievementPhotos.map((item) => (
                  <Link key={item.id} href="/achievements" className="block">
                    <MediaImage src={item.image} alt={item.title} className="aspect-[4/3] w-full rounded-2xl" />
                    <p className="mt-1.5 line-clamp-2 text-xs font-semibold leading-4 text-navy">{item.title}</p>
                    {item.subtitle ? <p className="line-clamp-2 text-[11px] leading-4 text-muted">{item.subtitle}</p> : null}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.achievements.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-navy">
                        <Icon name={item.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-navy">{item.value ? `${item.value} ${item.title}` : item.title}</span>
                        {item.subtitle ? <span className="block text-xs text-muted">{item.subtitle}</span> : null}
                      </span>
                    </div>
                  ))}
                </div>
                <TrophyArt />
              </div>
            )}
            <p className="mt-4 font-serif text-sm italic text-navy/80">“{settings.achievementQuote}”</p>
          </Panel>

          <Panel>
              <div id="videos">
                <SectionTitle eyebrow="YouTube and Instagram" title="Talks and reels" href="/videos" action="View all" />
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {videoCards.map((video) => {
                    const poster = video.thumbnail || videoPoster(video.sourceUrl);
                    return (
                    <PlayOverlay key={video.id} title={video.title} src={video.sourceUrl}>
                      <article>
                        <div className="relative">
                          {poster ? <MediaImage src={poster} alt="" className="aspect-[4/3] w-full rounded-xl" /> : <VideoPoster className="aspect-[4/3] w-full rounded-xl" />}
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-navy">{videoPlatform(video.sourceUrl)}</span>
                          <PlayBadge />
                          {video.duration ? <span className="absolute bottom-1.5 right-1.5 rounded bg-navy/80 px-1.5 py-0.5 text-[10px] text-white">{video.duration}</span> : null}
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-xs font-semibold leading-4 text-navy sm:text-sm sm:leading-5">{video.title}</p>
                      </article>
                    </PlayOverlay>
                    );
                  })}
                </div>
              </div>
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Moments that inspire" title="Gallery" href="/gallery" action="View all" />
            <GalleryBrowser
              items={data.gallery.map((item) => ({ id: item.id, title: item.title, caption: item.caption, image: item.image, category: item.category }))}
              limit={4}
              columns={4}
            />
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Knowledge for a healthier tomorrow" title="Blog & Health Insights" href="/blog" action="View all articles" />
            <div className="grid gap-3 md:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="min-w-0">
                  <MediaImage src={post.coverImage} alt="" className="aspect-[16/9] w-full rounded-xl" />
                  <span className="mt-2 line-clamp-2 block text-sm font-semibold leading-5 text-navy">{post.title}</span>
                  <span className="mt-1 block text-[11px] text-muted">{formatDate(post.publishedOn)}</span>
                </Link>
              ))}
            </div>
          </Panel>

          <section className="min-w-0 rounded-[28px] bg-navy p-4 text-white sm:p-5">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">Instagram Updates</h2>
                <p className="text-xs text-white/65">Latest reels from the clinic</p>
              </div>
              <a href={settings.instagramUrl || `https://instagram.com/${settings.instagramHandle.replace("@", "")}`} className="shrink-0 text-xs font-semibold text-white/80">
                {settings.instagramHandle}
              </a>
            </div>
            <div className="grid grid-cols-4 gap-2 lg:grid-cols-8">
              {homeReels.length
                ? homeReels.map((reel) => {
                    const poster = reel.thumbnail || videoPoster(reel.sourceUrl);
                    return (
                      <PlayOverlay key={reel.id} title={reel.title} src={reel.sourceUrl}>
                        <article>
                          <div className="relative">
                            {poster ? (
                              <MediaImage src={poster} alt="" className="aspect-[3/4] w-full rounded-xl" />
                            ) : (
                              <VideoPoster className="aspect-[3/4] w-full rounded-xl" />
                            )}
                            <span className="absolute left-1/2 top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-lg">
                              <Play className="ml-0.5 h-3 w-3 fill-current" />
                            </span>
                          </div>
                        </article>
                      </PlayOverlay>
                    );
                  })
                : data.social.map((item) => (
                    <span key={item.id} className="block text-center">
                      <MediaImage src={item.image} alt={item.label} className="mx-auto aspect-square w-full rounded-xl ring-2 ring-white/30" />
                    </span>
                  ))}
            </div>
          </section>

          <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="flex h-full flex-col gap-4 rounded-[28px] bg-white p-5 ring-1 ring-navy/5 sm:p-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Visit the clinic</p>
                <h2 className="mt-1 text-2xl font-semibold text-navy">NEUROKALP, Ellisbridge</h2>
                <p className="mt-2 text-sm leading-6 text-ink/80">{settings.address}</p>
                <p className="mt-2 text-sm text-navy">Consulting hours {hours.hours}. Lunch {hours.lunch}. Closed: {hours.closed}.</p>
              </div>
              <div className="flex flex-col gap-2 min-[420px]:flex-row">
                <a href={`tel:${settings.phone}`} className={`${btnPrimary} w-full min-[420px]:w-auto`}>
                  <Phone className="h-4 w-4" /> {settings.phoneDisplay}
                </a>
                <a href={chat} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white min-[420px]:w-auto">
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
                <Link href="/book" className="inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-navy ring-1 ring-navy/15 min-[420px]:w-auto">
                  Book
                </Link>
              </div>
              {settings.mapUrl ? (
                <iframe
                  title="NEUROKALP on Google Maps"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
                  className="min-h-52 w-full flex-1 rounded-2xl border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : null}
            </section>
            <BusinessCard
              details={{
                doctorName: settings.doctorName,
                roleTitle: settings.roleTitle,
                degrees: settings.aboutDegrees,
                tagline: settings.tagline,
                phone: settings.phone,
                whatsapp: settings.whatsapp,
                address: settings.address,
                mapUrl: settings.mapUrl,
                instagramUrl: settings.instagramUrl,
                youtubeUrl: settings.youtubeUrl,
                portrait: settings.aboutImage,
              }}
            />
          </div>
      </div>

      <section className="relative overflow-hidden rounded-[28px] sm:rounded-[32px]">
        <MediaImage fill src={settings.ctaImage} alt="" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/70 to-navy/45 sm:bg-gradient-to-r sm:from-navy/88 sm:via-navy/55 sm:to-navy/30" />
        <div className="relative grid items-center gap-5 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="text-white">
            <h2 className="max-w-xl whitespace-pre-line text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{settings.ctaTitle}</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/80">{settings.ctaSubtitle}</p>
            <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
              <Link href="/book" className={`${btnOnDark} w-full min-[420px]:w-auto`}>Book Appointment</Link>
              <Link href="/contact" className={`${btnOutlineLight} w-full min-[420px]:w-auto`}>Contact us →</Link>
            </div>
          </div>
          <div className="grid gap-3">
            {ctaStats.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-white">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{item.value || item.label}</span>
                  {item.value ? <span className="block text-xs text-white/70">{item.label}</span> : null}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
}
