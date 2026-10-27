import type { getHomeData } from "@/lib/queries";
import { Calendar, Phone, Play } from "lucide-react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { WhatsAppIcon } from "@/components/logo";
import { Hero } from "@/components/public/hero";
import { GalleryBrowser, PlayOverlay } from "@/components/public/overlays";
import { btnOnDark, btnOutlineLight, btnPrimary, Container, MediaImage, Panel, SectionTitle } from "@/components/public/ui";
import { formatDate, videoPlatform, videoPoster, whatsappLink } from "@/lib/utils";

type HomeData = NonNullable<Awaited<ReturnType<typeof getHomeData>>>;

const pressStyle: Record<string, string> = {
  "The Times of India": "font-serif text-[13px] font-black uppercase tracking-tight text-[#1a1a1a]",
  NDTV: "text-lg font-black tracking-tight text-[#e31e24]",
  mint: "font-serif text-2xl italic lowercase text-[#0b8f4d]",
  "The Indian Express": "font-serif text-[13px] italic font-bold text-[#b42318]",
};

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
  const stories = data.stories.filter((item) => item.featured).slice(0, 3);
  const storyCards = stories.length ? stories : data.stories.slice(0, 3);
  const videos = data.videos.filter((item) => item.featured).slice(0, 3);
  const videoCards = videos.length ? videos : data.videos.slice(0, 3);
  const posts = data.posts.slice(0, 3);
  const chat = whatsappLink(settings.whatsapp, `Hello ${settings.doctorName}, I would like to enquire about a consultation.`);

  return (
    <Container className="space-y-5 py-5 sm:py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Physician",
            name: settings.doctorName,
            medicalSpecialty: "Neurosurgery",
            telephone: settings.phone,
            email: settings.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: settings.address,
              addressLocality: "Ahmedabad",
              addressRegion: "Gujarat",
              postalCode: "380006",
              addressCountry: "IN",
            },
            hasMap: settings.mapUrl || undefined,
            sameAs: [settings.instagramUrl].filter(Boolean),
          }),
        }}
      />
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)]">
        <div className="min-w-0 space-y-5">
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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
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
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_190px]">
              <div className="grid gap-5 sm:grid-cols-[190px_minmax(0,1fr)]">
                <MediaImage src={settings.aboutImage} alt={`${settings.doctorName}, ${settings.roleTitle}`} objectPosition="center 18%" className="aspect-[3/4] w-full rounded-[24px] sm:aspect-auto sm:h-full sm:min-h-80" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{settings.aboutEyebrow}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-navy">{settings.doctorName}</h2>
                  <p className="mt-1 text-sm text-muted">{settings.aboutDegrees}</p>
                  <p className="text-sm font-medium text-navy">{settings.roleTitle}</p>
                  <p className="mt-1 text-sm text-muted">NEUROKALP, Ellisbridge, Ahmedabad</p>
                  <p className="mt-3 text-sm leading-6 text-ink/80">{settings.aboutBio}</p>
                  <blockquote className="mt-4 font-serif text-lg italic leading-snug text-navy">“{settings.aboutQuote}”</blockquote>
                  <p className="font-serif text-sm italic text-muted">{settings.doctorName}</p>
                  <Link href="/about" className={`${btnPrimary} mt-4 h-auto whitespace-normal text-center leading-5`}>
                    Know more about {settings.doctorName} →
                  </Link>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                {aboutStats.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-navy">
                      <Icon name={item.icon} className="h-4 w-4" />
                    </span>
                    <span>
                      <dt className="text-sm font-semibold text-navy">{item.value || item.label}</dt>
                      {item.value ? <dd className="text-xs text-muted">{item.label}</dd> : null}
                    </span>
                  </div>
                ))}
              </dl>
            </div>
          </Panel>
        </div>

        <div className="min-w-0 space-y-5">
          <Panel>
            <SectionTitle eyebrow="Real people. Real journeys. Real hope." title="Patient Stories" href="/patient-stories" action="View all stories" />
            <div className="no-scrollbar flex w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible">
              {storyCards.map((story) => (
                <div key={story.id} className="w-[78%] max-w-[260px] shrink-0 snap-start sm:w-auto sm:max-w-none">
                <PlayOverlay title={story.name} src={story.videoUrl}>
                  <article>
                    <div className="relative">
                      <MediaImage src={story.image} alt={story.name} className="aspect-[4/5] w-full rounded-2xl" />
                      <PlayBadge />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-navy">{story.name}</p>
                    <p className="text-[11px] text-muted">{story.condition}</p>
                    <p className="mt-1 line-clamp-3 text-xs leading-5 text-ink/80">“{story.quote}”</p>
                  </article>
                </PlayOverlay>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Recognition for a greater purpose" title="Achievements" href="/achievements" action="View all" />
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
            <p className="mt-4 font-serif text-sm italic text-navy/80">“{settings.achievementQuote}”</p>
          </Panel>

          <div className="grid min-w-0 gap-5 lg:grid-cols-5">
            <Panel className="lg:col-span-3" >
              <div id="videos">
                <SectionTitle eyebrow="Inform. Educate. Empower." title="Talks and reels" href="/videos" action="View all" />
                <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-3 min-[520px]:gap-2">
                  {videoCards.map((video) => (
                    <PlayOverlay key={video.id} title={video.title} src={video.sourceUrl}>
                      <article>
                        <div className="relative">
                          <MediaImage src={video.thumbnail || videoPoster(video.sourceUrl)} alt="" className="aspect-[4/3] w-full rounded-xl" />
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-navy">{videoPlatform(video.sourceUrl)}</span>
                          <PlayBadge />
                          {video.duration ? <span className="absolute bottom-1.5 right-1.5 rounded bg-navy/80 px-1.5 py-0.5 text-[10px] text-white">{video.duration}</span> : null}
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-sm font-semibold leading-5 text-navy min-[520px]:text-[11px] min-[520px]:leading-4">{video.title}</p>
                      </article>
                    </PlayOverlay>
                  ))}
                </div>
              </div>
            </Panel>
            <Panel className="lg:col-span-2">
              <SectionTitle eyebrow="In the news. For a healthier tomorrow." title="Media & Press" href="/media" action="View all" />
              <div className="grid grid-cols-2 gap-3">
                {data.press.map((item) => {
                  const body = (
                    <span className={pressStyle[item.outlet] || "text-sm font-bold text-navy"}>{item.outlet}</span>
                  );
                  return item.url ? (
                    <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="grid min-h-16 place-items-center rounded-2xl bg-canvas px-3 text-center">
                      {body}
                    </a>
                  ) : (
                    <div key={item.id} className="grid min-h-16 place-items-center rounded-2xl bg-canvas px-3 text-center">
                      {body}
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          <div className="grid min-w-0 gap-5 lg:grid-cols-2">
            <Panel>
              <SectionTitle eyebrow="Moments that inspire" title="Gallery" href="/gallery" action="View all" />
              <GalleryBrowser
                items={data.gallery.map((item) => ({ id: item.id, title: item.title, caption: item.caption, image: item.image, category: item.category }))}
                limit={4}
              />
            </Panel>
            <Panel>
              <SectionTitle eyebrow="Knowledge for a healthier tomorrow" title="Blog & Health Insights" href="/blog" action="View all articles" />
              <div className="grid gap-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="grid grid-cols-[92px_minmax(0,1fr)] gap-3">
                    <MediaImage src={post.coverImage} alt="" className="h-[72px] w-full rounded-xl" />
                    <span>
                      <span className="line-clamp-2 text-sm font-semibold leading-5 text-navy">{post.title}</span>
                      <span className="mt-1 block text-[11px] text-muted">{formatDate(post.publishedOn)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </Panel>
          </div>

          <div className="grid min-w-0 gap-5 lg:grid-cols-2">
            <section className="min-w-0 rounded-[28px] bg-navy p-5 text-white">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">Instagram Updates</h2>
                  <p className="text-xs text-white/65">A glimpse into our journey</p>
                </div>
                <a href={settings.instagramUrl || `https://instagram.com/${settings.instagramHandle.replace("@", "")}`} className="shrink-0 text-xs font-semibold text-white/80">
                  {settings.instagramHandle}
                </a>
              </div>
              <div className="no-scrollbar flex min-w-0 gap-3 overflow-x-auto pb-1">
                {data.social.map((item) => {
                  const circle = (
                    <span className="block w-16 shrink-0 text-center">
                      <MediaImage src={item.image} alt={item.label} className="mx-auto h-14 w-14 rounded-full ring-2 ring-white/30" />
                      <span className="mt-1 block text-[10px] leading-3 text-white/80">{item.label}</span>
                    </span>
                  );
                  return item.url ? (
                    <a key={item.id} href={item.url} target="_blank" rel="noreferrer">{circle}</a>
                  ) : (
                    <span key={item.id}>{circle}</span>
                  );
                })}
              </div>
            </section>
            <section className="min-w-0 rounded-[28px] bg-navy p-5 text-white">
              <h2 className="text-lg font-semibold">Your Health Our Priority</h2>
              <div className="mt-4 grid gap-2">
                <Link href="/book" className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2.5 text-sm font-semibold">
                  <Calendar className="h-4 w-4" /> Book appointment
                </Link>
                <a href={chat} className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2.5 text-sm font-semibold">
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp enquiry
                </a>
                <a href={`tel:${settings.phone}`} className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2.5 text-sm font-semibold">
                  <Phone className="h-4 w-4" /> Call now · {settings.phoneDisplay}
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[28px] sm:min-h-[280px] sm:rounded-[32px]">
        <MediaImage fill src={settings.ctaImage} alt="" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/70 to-navy/45 sm:bg-gradient-to-r sm:from-navy/88 sm:via-navy/55 sm:to-navy/30" />
        <div className="relative grid items-center gap-8 px-5 py-8 sm:px-10 sm:py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
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
