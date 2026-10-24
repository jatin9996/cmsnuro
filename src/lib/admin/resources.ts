import { ICON_OPTIONS } from "@/components/icon";
import type { ContentModel } from "@/lib/delegate";

export type FieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "image" | "video" | "date";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  rows?: number;
  placeholder?: string;
  help?: string;
  max?: number;
};

export type Column = {
  key: string;
  label: string;
  kind?: "text" | "image" | "bool";
};

export type ResourceConfig = {
  slug: string;
  model: ContentModel;
  title: string;
  description: string;
  icon: string;
  fields: Field[];
  columns: Column[];
  hasSlug?: boolean;
  defaults?: Record<string, string | number | boolean>;
};

const published: Field = { name: "published", label: "Published", type: "checkbox" };
const sortOrder: Field = {
  name: "sortOrder",
  label: "Sort order",
  type: "number",
  help: "Lower numbers appear first. You can also use the arrows in the list.",
};
const iconField: Field = { name: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, required: true };

const proseHelp = "Separate paragraphs with a blank line. Use ## for a heading and - for a bullet. Wrap **bold** words in double asterisks.";
const seoFields: Field[] = [
  { name: "seoTitle", label: "Search title", type: "text", max: 160, help: "Shown in Google. Leave blank to use the page title." },
  { name: "seoDescription", label: "Search description", type: "textarea", rows: 3, max: 320, help: "Leave blank to use the summary or excerpt." },
];

export const GALLERY_CATEGORIES = [
  "Hospital",
  "Operation Theatre",
  "Conferences",
  "Community Events",
  "Media Coverage",
];

export const resources: ResourceConfig[] = [
  {
    slug: "seo",
    model: "seoTag",
    title: "SEO tags",
    description: "Extra meta tags for Google, Facebook, and other services. Title, description, keywords, the share image, and Google verification live in Site settings.",
    icon: "Search",
    defaults: { attribute: "name" },
    columns: [
      { key: "key", label: "Tag" },
      { key: "attribute", label: "Type" },
      { key: "content", label: "Content" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      {
        name: "attribute",
        label: "Tag type",
        type: "select",
        required: true,
        options: [
          { value: "name", label: "Name — meta name" },
          { value: "property", label: "Property — meta property" },
        ],
        help: "Use Name for tags such as author. Use Property for Open Graph tags such as og:locale.",
      },
      {
        name: "key",
        label: "Tag name",
        type: "text",
        required: true,
        max: 80,
        placeholder: "og:locale",
        help: "Letters, numbers, colon, underscore, dot, or hyphen. Example: author or og:locale.",
      },
      { name: "content", label: "Content", type: "textarea", required: true, rows: 3, max: 500 },
      sortOrder,
      published,
    ],
  },
  {
    slug: "hero",
    model: "heroSlide",
    title: "Hero slides",
    description: "Background photographs for the homepage banner. The headline and quote live in Site settings.",
    icon: "Image",
    columns: [
      { key: "image", label: "Image", kind: "image" },
      { key: "alt", label: "Description" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      { name: "image", label: "Photograph", type: "image", required: true },
      { name: "alt", label: "Image description", type: "text", required: true, max: 160 },
      { name: "quote", label: "Optional quote override", type: "textarea", rows: 3, max: 240 },
      sortOrder,
      published,
    ],
  },
  {
    slug: "stats",
    model: "stat",
    title: "Statistics",
    description: "Numbers under the hero, beside the about section, and on the closing banner.",
    icon: "ChartColumn",
    defaults: { group: "highlight", icon: "Award" },
    columns: [
      { key: "value", label: "Value" },
      { key: "label", label: "Label" },
      { key: "group", label: "Placement" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      {
        name: "group",
        label: "Placement",
        type: "select",
        required: true,
        options: [
          { value: "highlight", label: "Under the hero" },
          { value: "about", label: "About the doctor" },
          { value: "cta", label: "Closing banner" },
        ],
      },
      { name: "value", label: "Value", type: "text", placeholder: "20+", max: 40 },
      { name: "label", label: "Label", type: "text", required: true, max: 80 },
      iconField,
      sortOrder,
      published,
    ],
  },
  {
    slug: "conditions",
    model: "condition",
    title: "Conditions",
    description: "Treatments shown on the homepage and on their own pages.",
    icon: "Brain",
    hasSlug: true,
    defaults: { icon: "Brain" },
    columns: [
      { key: "title", label: "Condition" },
      { key: "summary", label: "Summary" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 80 },
      { name: "slug", label: "Page address", type: "text", placeholder: "brain-tumors", help: "Leave blank to create it from the title.", max: 80 },
      { name: "summary", label: "Short summary", type: "text", required: true, max: 140 },
      ...seoFields,
      { name: "description", label: "Overview", type: "textarea", rows: 8, max: 8000, help: proseHelp },
      { name: "symptoms", label: "When to seek care", type: "textarea", rows: 6, max: 4000, help: proseHelp },
      { name: "treatment", label: "How care is planned", type: "textarea", rows: 6, max: 4000, help: proseHelp },
      iconField,
      { name: "image", label: "Image", type: "image" },
      sortOrder,
      published,
    ],
  },
  {
    slug: "stories",
    model: "patientStory",
    title: "Patient stories",
    description: "Use only stories and photographs you have consent to publish.",
    icon: "Users",
    defaults: { featured: true },
    columns: [
      { key: "image", label: "Photo", kind: "image" },
      { key: "name", label: "Name" },
      { key: "condition", label: "Condition" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 80 },
      { name: "condition", label: "Condition", type: "text", required: true, max: 80 },
      { name: "quote", label: "Short quote", type: "textarea", required: true, rows: 3, max: 400 },
      { name: "story", label: "Full story", type: "textarea", rows: 8, max: 5000, help: proseHelp },
      { name: "image", label: "Photograph", type: "image", required: true },
      { name: "videoUrl", label: "Video link or file", type: "video", help: "Paste a YouTube or Vimeo link, or upload an MP4." },
      { name: "featured", label: "Show on the homepage", type: "checkbox" },
      sortOrder,
      published,
    ],
  },
  {
    slug: "achievements",
    model: "achievement",
    title: "Achievements",
    description: "Awards, publications, fellowships, and speaking invitations.",
    icon: "Trophy",
    defaults: { icon: "Award" },
    columns: [
      { key: "value", label: "Value" },
      { key: "title", label: "Title" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      { name: "value", label: "Figure", type: "text", placeholder: "50+", max: 40 },
      { name: "title", label: "Title", type: "text", required: true, max: 120 },
      { name: "subtitle", label: "Subtitle", type: "text", max: 160 },
      { name: "description", label: "Details", type: "textarea", rows: 5, max: 2000 },
      iconField,
      sortOrder,
      published,
    ],
  },
  {
    slug: "videos",
    model: "video",
    title: "Videos",
    description: "Upload an MP4 or paste a YouTube or Vimeo link.",
    icon: "Clapperboard",
    hasSlug: true,
    defaults: { category: "Education", featured: true },
    columns: [
      { key: "thumbnail", label: "Thumbnail", kind: "image" },
      { key: "title", label: "Title" },
      { key: "duration", label: "Length" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 140 },
      { name: "slug", label: "Page address", type: "text", max: 80, help: "Leave blank to create it from the title." },
      { name: "description", label: "Description", type: "textarea", rows: 4, max: 2000 },
      { name: "thumbnail", label: "Thumbnail", type: "image", required: true },
      { name: "sourceUrl", label: "Video", type: "video", help: "MP4 uploads play on the site. A YouTube or Vimeo link is easier for long films." },
      { name: "duration", label: "Duration", type: "text", placeholder: "3:45", max: 20 },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["Education", "Surgery", "Recovery", "Awareness"].map((value) => ({ value, label: value })),
      },
      { name: "featured", label: "Show on the homepage", type: "checkbox" },
      sortOrder,
      published,
    ],
  },
  {
    slug: "press",
    model: "pressItem",
    title: "Media and press",
    description: "News mentions. Logos are drawn from the outlet name, so use the publication's real name.",
    icon: "Newspaper",
    columns: [
      { key: "outlet", label: "Outlet" },
      { key: "title", label: "Headline" },
      { key: "dateLabel", label: "Date" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      { name: "outlet", label: "Publication", type: "text", required: true, max: 80 },
      { name: "title", label: "Headline", type: "text", required: true, max: 180 },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3, max: 400 },
      { name: "url", label: "Article link", type: "text", max: 400 },
      { name: "dateLabel", label: "Date label", type: "text", placeholder: "Oct 2026", max: 40 },
      sortOrder,
      published,
    ],
  },
  {
    slug: "gallery",
    model: "galleryItem",
    title: "Gallery",
    description: "Hospital, theatre, conference, community, and media photographs.",
    icon: "Images",
    defaults: { category: "Hospital" },
    columns: [
      { key: "image", label: "Photo", kind: "image" },
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 120 },
      { name: "caption", label: "Caption", type: "textarea", rows: 3, max: 400 },
      { name: "image", label: "Photograph", type: "image", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: GALLERY_CATEGORIES.map((value) => ({ value, label: value })),
      },
      sortOrder,
      published,
    ],
  },
  {
    slug: "blog",
    model: "post",
    title: "Blog",
    description: "Health articles. Keep them educational, and do not promise an outcome.",
    icon: "FileText",
    hasSlug: true,
    defaults: { category: "Brain", author: "Dr. Kairav Shah" },
    columns: [
      { key: "coverImage", label: "Cover", kind: "image" },
      { key: "title", label: "Title" },
      { key: "publishedOn", label: "Date" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 160 },
      { name: "slug", label: "Page address", type: "text", max: 80, help: "Leave blank to create it from the title." },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 3, max: 300 },
      ...seoFields,
      { name: "content", label: "Article", type: "textarea", required: true, rows: 14, max: 20000, help: proseHelp },
      { name: "coverImage", label: "Cover image", type: "image", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["Brain", "Spine", "Stroke", "Recovery", "Prevention"].map((value) => ({ value, label: value })),
      },
      { name: "author", label: "Author", type: "text", max: 80 },
      { name: "publishedOn", label: "Publish date", type: "date", required: true },
      sortOrder,
      published,
    ],
  },
  {
    slug: "social",
    model: "socialUpdate",
    title: "Social updates",
    description: "Round photographs in the Instagram strip. Link each one to the real post when you have it.",
    icon: "Camera",
    columns: [
      { key: "image", label: "Photo", kind: "image" },
      { key: "label", label: "Label" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      { name: "label", label: "Label", type: "text", required: true, max: 40 },
      { name: "image", label: "Photograph", type: "image", required: true },
      { name: "url", label: "Post link", type: "text", max: 400 },
      sortOrder,
      published,
    ],
  },
  {
    slug: "pages",
    model: "page",
    title: "Pages",
    description: "About, privacy, and terms use the slugs about, privacy, and terms. Other pages are published at /p/your-slug.",
    icon: "ScrollText",
    hasSlug: true,
    columns: [
      { key: "title", label: "Title" },
      { key: "slug", label: "Address" },
      { key: "published", label: "Live", kind: "bool" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 140 },
      {
        name: "slug",
        label: "Page address",
        type: "text",
        required: true,
        max: 80,
        help: "Reserved addresses: about, privacy, terms. Have a lawyer review privacy and terms before launch.",
      },
      { name: "excerpt", label: "Intro", type: "textarea", rows: 3, max: 300 },
      ...seoFields,
      { name: "content", label: "Content", type: "textarea", required: true, rows: 14, max: 20000, help: proseHelp },
      sortOrder,
      published,
    ],
  },
];

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}
