import { PRODUCTION_SITE_URL, canonicalUrl } from "@/lib/site-url";

const base = PRODUCTION_SITE_URL;
export const clinicId = `${base}/#medicalclinic`;
export const websiteId = `${base}/#website`;
export const physicianId = `${base}/#physician`;

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

type ClinicSettings = {
  doctorName: string;
  roleTitle: string;
  phone: string;
  aboutImage?: string | null;
  aboutDegrees?: string | null;
  mapUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  facebookUrl?: string | null;
  linkedinUrl?: string | null;
  dayStart: string;
  dayEnd: string;
  closedWeekdays: string;
};

const treatmentPageNames: Record<string, { name: string; condition: string }> = {
  migraine: { name: "Migraine Treatment | NEUROKALP", condition: "Migraine" },
  "neck-pain": { name: "Neck Pain Treatment | NEUROKALP", condition: "Neck Pain" },
  "back-pain": { name: "Back Pain Treatment | NEUROKALP", condition: "Back Pain" },
  sciatica: { name: "Sciatica Treatment | NEUROKALP", condition: "Sciatica" },
  "sleep-disorders": { name: "Sleep Disorders Treatment | NEUROKALP", condition: "Sleep Disorders" },
  "brain-infections": { name: "Brain Infections Treatment | NEUROKALP", condition: "Brain Infections" },
  "trigeminal-neuralgia": { name: "Trigeminal Neuralgia Treatment | NEUROKALP", condition: "Trigeminal Neuralgia" },
  hydrocephalus: { name: "Hydrocephalus Treatment | NEUROKALP", condition: "Hydrocephalus" },
  "spine-tumor": { name: "Spine Tumor Treatment | NEUROKALP", condition: "Spine Tumor" },
  "head-injuries": { name: "Head Injuries Treatment | NEUROKALP", condition: "Head Injuries" },
  "road-traffic-accidents": { name: "Road Traffic Accident Treatment | NEUROKALP", condition: "Road Traffic Accidents" },
  "dementia-memory-disturbance": {
    name: "Dementia and Memory Disturbance | NEUROKALP",
    condition: "Dementia and Memory Disturbance",
  },
};

function openDays(closedWeekdays: string) {
  const closed = new Set(
    closedWeekdays
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6),
  );
  return WEEKDAY_NAMES.filter((_, index) => !closed.has(index));
}

function sameAs(settings: ClinicSettings) {
  return [settings.instagramUrl, settings.youtubeUrl, settings.mapUrl, settings.facebookUrl, settings.linkedinUrl].filter(Boolean);
}

export function homepageSchema(settings: ClinicSettings) {
  const days = openDays(settings.closedWeekdays);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalClinic",
        "@id": clinicId,
        name: "NEUROKALP",
        alternateName: "NEUROKALP Brain and Spine Clinic",
        url: `${base}/`,
        image: `${base}/media/neurokalp-logo.png`,
        telephone: settings.phone,
        medicalSpecialty: ["https://schema.org/Neurologic", "https://schema.org/Surgical"],
        knowsAbout: ["Neurosurgery", "Brain surgery", "Spine surgery"],
        address: {
          "@type": "PostalAddress",
          streetAddress: "504-5, 5th floor, Mehta 531, near V.S. Hospital, Ellisbridge",
          addressLocality: "Ahmedabad",
          addressRegion: "Gujarat",
          postalCode: "380006",
          addressCountry: "IN",
        },
        hasMap: settings.mapUrl || undefined,
        openingHoursSpecification: days.length
          ? [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: days,
                opens: settings.dayStart,
                closes: settings.dayEnd,
              },
            ]
          : undefined,
        employee: {
          "@type": "Physician",
          "@id": physicianId,
          name: settings.doctorName,
          jobTitle: settings.roleTitle,
          url: `${base}/about`,
          image: settings.aboutImage ? `${base}${settings.aboutImage}` : undefined,
          medicalSpecialty: "https://schema.org/Neurologic",
          knowsAbout: ["Neurosurgery", "Brain surgery", "Spine surgery"],
          worksFor: { "@id": clinicId },
        },
        sameAs: sameAs(settings),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${base}/`,
        name: "NEUROKALP",
        description: "Brain and spine care with Dr. Kairav Shah at NEUROKALP, Ahmedabad.",
        inLanguage: "en",
        publisher: { "@id": clinicId },
      },
    ],
  };
}

export function aboutPersonSchema(settings: ClinicSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${base}/about#doctor`,
    name: settings.doctorName || "Dr. Kairav Shah",
    url: `${base}/about`,
    jobTitle: settings.roleTitle || "Consultant Neurosurgeon",
    description:
      "Dr. Kairav Shah is a Consultant Neurosurgeon at NEUROKALP, Ahmedabad. He holds qualifications in MBBS, MS General Surgery and MCh Neurosurgery.",
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", name: "MBBS" },
      { "@type": "EducationalOccupationalCredential", name: "MS General Surgery" },
      { "@type": "EducationalOccupationalCredential", name: "MCh Neurosurgery" },
    ],
    worksFor: { "@id": clinicId },
    knowsAbout: ["Neurosurgery", "Brain Surgery", "Spine Surgery"],
  };
}

export function treatmentsCollectionSchema(items: Array<{ title: string; slug: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${base}/treatments#webpage`,
    url: `${base}/treatments`,
    name: "Brain and Spine Treatments | NEUROKALP",
    description: "Explore brain, spine and neurological conditions treated at NEUROKALP, Ahmedabad.",
    isPartOf: { "@id": websiteId },
    about: { "@id": clinicId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: treatmentPageNames[item.slug]?.condition || item.title,
        url: `${base}/treatments/${item.slug}`,
      })),
    },
  };
}

export function treatmentMedicalWebPageSchema(input: { slug: string; title: string }) {
  const known = treatmentPageNames[input.slug];
  const path = `/treatments/${input.slug}`;
  const url = canonicalUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${url}#webpage`,
    url,
    name: known?.name || `${input.title} | NEUROKALP`,
    about: {
      "@type": "MedicalCondition",
      name: known?.condition || input.title,
    },
    isPartOf: { "@id": websiteId },
    publisher: { "@id": clinicId },
  };
}

export function collectionPageSchema(input: { path: string; name: string; idSuffix?: string }) {
  const url = canonicalUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#${input.idSuffix || "webpage"}`,
    url,
    name: input.name,
    isPartOf: { "@id": websiteId },
    about: { "@id": clinicId },
  };
}

export function blogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${base}/blog#blog`,
    url: `${base}/blog`,
    name: "NEUROKALP Blog",
    isPartOf: { "@id": websiteId },
    publisher: { "@id": clinicId },
  };
}

export function webPageSchema(input: { path: string; name: string; description?: string }) {
  const url = canonicalUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description || undefined,
    isPartOf: { "@id": websiteId },
    about: { "@id": clinicId },
  };
}

export function blogPostingSchema(input: {
  slug: string;
  title: string;
  excerpt?: string;
  publishedOn?: string | Date;
  coverImage?: string | null;
}) {
  const url = canonicalUrl(`/blog/${input.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    headline: input.title,
    description: input.excerpt || undefined,
    datePublished: input.publishedOn || undefined,
    image: input.coverImage ? `${base}${input.coverImage}` : undefined,
    isPartOf: { "@id": `${base}/blog#blog` },
    publisher: { "@id": clinicId },
    author: {
      "@type": "Person",
      "@id": `${base}/about#doctor`,
      name: "Dr. Kairav Shah",
    },
    mainEntityOfPage: url,
  };
}
