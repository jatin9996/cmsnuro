import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedIfEmpty(label: string, count: number, run: () => Promise<unknown>) {
  if (count > 0) {
    console.log(`kept ${label}`);
    return;
  }
  await run();
  console.log(`seeded ${label}`);
}

const overview = (topic: string) =>
  `${topic} covers a wide range of problems, from those that are watched over time to those that need an operation. The right choice depends on the scans, the examination, and what matters to the patient.\n\nThis page is general information. It does not say what any one person should do.`;

const symptoms = `## Reasons people ask for a review\n\n- A new or worsening symptom that is hard to explain\n- A scan that mentions the brain, spine, or nerves\n- A previous operation and a question about recovery\n\nMany of these symptoms have more than one cause. They need a doctor to interpret them.`;

const treatment = `## What a consultation usually covers\n\n- The history and a focused examination\n- The scans already done, and whether more are useful\n- The choices: observation, medicine, or an operation, with the risks of each\n\nAn operation is one option among others. It is recommended only when the expected benefit is clear.`;

const migrainePage = {
  title: "Migraine",
  slug: "migraine",
  summary: "Headache assessment and care",
  icon: "Activity",
  sortOrder: 0,
  seoTitle: "Migraine",
  seoDescription: "How migraine is recognised, when a headache needs urgent care, and what a consultation covers.",
  description:
    "Migraine is a recurring headache. An attack is often a one-sided, throbbing pain, with nausea, and light or sound can feel too strong. Some people notice a warning first, such as flashing lights, a change in vision, or tingling.\n\nA consultation is used to understand that pattern and to separate migraine from other causes of headache that need a different plan. Medicine and day-to-day changes are the usual care. An operation is not the standard treatment for migraine.\n\nThis page is general information. It does not say what any one person should do.",
  symptoms: `## Reasons people ask about migraine\n\n- Repeated headaches, often on one side of the head\n- Nausea, or sensitivity to light, sound, or smell with the pain\n- A warning of visual change, tingling, or trouble finding words before the pain\n- A headache that is new, suddenly the worst ever, or comes with weakness, confusion, a seizure, fever, or a stiff neck — these need urgent medical care`,
  treatment: `## What a consultation usually covers\n\n- The story of the attacks, and a focused examination\n- Whether a scan is useful, and what it can and cannot show\n- Ways to reduce how often attacks come, and how to treat one when it starts\n- When another cause of headache needs to be looked at first\n\nSeek emergency care for a sudden worst-ever headache, new weakness, trouble speaking, a seizure, or a headache after a head injury.`,
};

const facialPainPage = {
  title: "Trigeminal Neuralgia & Facial Pain",
  slug: "trigeminal-neuralgia",
  summary: "Facial pain evaluation and care",
  icon: "Zap",
  sortOrder: 6,
  seoTitle: "Trigeminal Neuralgia & Facial Pain",
  seoDescription: "Sharp one-sided facial pain, how it is told apart from other face pain, and how a care plan is made.",
  description:
    "Trigeminal neuralgia affects the nerve that supplies feeling to the face. It usually causes brief, very sharp pain on one side, often set off by light touch, washing, chewing, talking, or a breeze. Other kinds of facial pain feel different and have different causes, so the first task is to name the pain correctly.\n\nThis page is general information. It does not say what any one person should do.",
  symptoms: `## Reasons people ask about facial pain\n\n- Sudden, electric, or stabbing pain on one side of the face\n- Pain set off by touch, washing, talking, or eating\n- Pain that is constant, aching, or on both sides — this may be a different problem\n- New facial weakness, a rash, tooth pain, or pain after an injury`,
  treatment: `## What a consultation usually covers\n\n- A careful history, because the story of the pain is the most useful clue\n- An examination, and a scan when it will change the decision\n- Medicine is usually tried first\n- If medicine does not control the pain, or the side effects are hard to live with, a procedure may be discussed. The choice depends on the scans, age, and what the person hopes to get back\n\nAn operation is one option among others. It is recommended only when the expected benefit is clear.`,
};

async function main() {
  const adminCount = await prisma.admin.count();
  await seedIfEmpty("admin", adminCount, () =>
    prisma.admin.create({
      data: {
        name: "Clinic admin",
        email: "admin@kairavshah.local",
        passwordHash: bcrypt.hashSync("Admin@12345", 12),
      },
    }),
  );

  const settingsCount = await prisma.siteSetting.count();
  await seedIfEmpty("settings", settingsCount, () =>
    prisma.siteSetting.create({
      data: {
        doctorName: "Dr. Kairav Shah",
        roleTitle: "Consultant Neurosurgeon",
        tagline: "Brain. Spine. Better Tomorrows.",
        phone: "+919099110022",
        phoneDisplay: "+91 90991 10022",
        whatsapp: "+91 90991 10022",
        email: "kairav3285@gmail.com",
        address: "NEUROKALP, 504-5, 5th floor, Mehta 531, near V.S. Hospital, Ellisbridge, Ahmedabad, Gujarat 380006",
        mapUrl: "https://share.google/bPjyfXDk5ssH3NUBl",
        heroEyebrow: "Expertise | Compassion | Better Lives",
        heroTitle: "Advanced Neurosurgery\nFor A Healthier Tomorrow",
        heroSubtitle: "Comprehensive care for brain, spine and nervous system disorders with global expertise and a human touch.",
        heroQuote: "Restoring Lives Through Science and Care.",
        heroQuoteAuthor: "Dr. Kairav Shah",
        aboutEyebrow: "About",
        aboutDegrees: "MBBS, MS (General Surgery), MCh (Neurosurgery)",
        aboutBio:
          "Dr. Kairav Shah is a neurosurgeon with over 15 years of experience in complex brain and spine surgery. He is committed to world-class care, combining advanced technology with a compassionate, patient-first approach.",
        aboutQuote: "Every patient has a story. My goal is to help them return to the life they love.",
        aboutImage: "/media/portraits/desk.jpg",
        ctaTitle: "Take the First Step\nTowards a Better Tomorrow",
        ctaSubtitle: "Expert care. Personalised treatment. A healthier, brighter you.",
        ctaImage: "/media/portraits/mountain.png",
        achievementQuote: "Success is not a destination, but a continuous pursuit of better care.",
        instagramHandle: "@dr.kairav",
        instagramUrl: "https://www.instagram.com/dr.kairav/",
        youtubeUrl: "https://www.youtube.com/@kairav1",
        dayStart: "10:00",
        dayEnd: "17:00",
        lunchStart: "13:00",
        lunchEnd: "14:00",
        slotMinutes: 30,
        closedWeekdays: "0",
        bookingNote: "Sunday is closed. A request is confirmed only after the clinic calls or writes back.",
      },
    }),
  );

  const clinic = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (clinic) {
    const fullAddress = "NEUROKALP, 504-5, 5th floor, Mehta 531, near V.S. Hospital, Ellisbridge, Ahmedabad, Gujarat 380006";
    const data: {
      phone?: string;
      phoneDisplay?: string;
      whatsapp?: string;
      email?: string;
      address?: string;
      aboutBio?: string;
      mapUrl?: string;
      aboutImage?: string;
      ctaImage?: string;
      instagramHandle?: string;
      instagramUrl?: string;
      youtubeUrl?: string;
    } = {};
    const previousClinicNumber = clinic.phone === "+919049695194" || clinic.phone === "+919876543210" || clinic.phoneDisplay.includes("90496");
    if (previousClinicNumber) {
      data.phone = "+919099110022";
      data.phoneDisplay = "+91 90991 10022";
    }
    if (!clinic.whatsapp || clinic.whatsapp === "919876543210" || clinic.whatsapp === "919049695194" || clinic.whatsapp === "+91 90496 95194" || clinic.whatsapp === "+919049695194") {
      data.whatsapp = "+91 90991 10022";
    }
    if (!clinic.email || clinic.email.endsWith("@kairavshah.example") || clinic.email.endsWith("@example.com")) {
      data.email = "kairav3285@gmail.com";
    }
    if (clinic.address === "Neurosciences Clinic, India" || clinic.address === "NEUROKALP, Near V.S Hospital, Ellisbridge, Ahmedabad") {
      data.address = fullAddress;
    }
    if (!clinic.mapUrl || clinic.mapUrl === "https://maps.google.com/?cid=11458330563077161080") {
      data.mapUrl = "https://share.google/bPjyfXDk5ssH3NUBl";
    }
    if (!clinic.aboutImage || clinic.aboutImage === "/media/doctor.jpg" || clinic.aboutImage === "/media/doctor-kairav.jpg") data.aboutImage = "/media/portraits/desk.jpg";
    if (!clinic.ctaImage || clinic.ctaImage === "/media/mountain.jpg") data.ctaImage = "/media/portraits/mountain.png";
    if (!clinic.instagramUrl || clinic.instagramHandle === "@dr.kairavshah") {
      data.instagramHandle = "@dr.kairav";
      data.instagramUrl = "https://www.instagram.com/dr.kairav/";
    }
    if (!clinic.youtubeUrl) data.youtubeUrl = "https://www.youtube.com/@kairav1";
    if (clinic.aboutBio.includes("over 20 years")) {
      data.aboutBio = clinic.aboutBio.replace("over 20 years", "over 15 years");
    }
    if (Object.keys(data).length) await prisma.siteSetting.update({ where: { id: 1 }, data });
  }

  const portraitSlides = [
    { image: "/media/portraits/theatre-loupes.jpg", alt: "Dr. Kairav Shah during surgery", sortOrder: 0 },
    { image: "/media/portraits/theatre-lights.jpg", alt: "Dr. Kairav Shah in the operating theatre", sortOrder: 1 },
    { image: "/media/portraits/scrubs.png", alt: "Dr. Kairav Shah, neurosurgeon", sortOrder: 2 },
  ];
  await seedIfEmpty("slides", await prisma.heroSlide.count(), () => prisma.heroSlide.createMany({ data: portraitSlides }));
  const currentSlides = await prisma.heroSlide.findMany();
  const stockSlide = new Set(["/media/hero.jpg", "/media/hospital.jpg"]);
  if (currentSlides.length > 0 && currentSlides.every((slide) => stockSlide.has(slide.image))) {
    await prisma.heroSlide.deleteMany();
    await prisma.heroSlide.createMany({ data: portraitSlides });
    console.log("replaced hero slides");
  }

  await seedIfEmpty("stats", await prisma.stat.count(), () =>
    prisma.stat.createMany({
      data: [
        { group: "highlight", value: "15+", label: "Years of Experience", icon: "Clock", sortOrder: 0 },
        { group: "highlight", value: "4000+", label: "Successful Surgeries", icon: "BadgeCheck", sortOrder: 1 },
        { group: "highlight", value: "International", label: "Fellowships & Training", icon: "Globe", sortOrder: 2 },
        { group: "highlight", value: "Patient-Centric", label: "Compassionate Care", icon: "Heart", sortOrder: 3 },
        { group: "about", value: "15+", label: "Years of Experience", icon: "Clock", sortOrder: 0 },
        { group: "about", value: "4000+", label: "Successful Surgeries", icon: "Activity", sortOrder: 1 },
        { group: "about", value: "", label: "Multiple Awards & Recognitions", icon: "Award", sortOrder: 2 },
        { group: "about", value: "International", label: "Fellowships", icon: "GraduationCap", sortOrder: 4 },
        { group: "about", value: "", label: "Patients from India & Abroad", icon: "Users", sortOrder: 5 },
        { group: "cta", value: "Expert Guidance", label: "A plan explained in plain language", icon: "Stethoscope", sortOrder: 0 },
        { group: "cta", value: "Trusted Care", label: "Time to ask every question", icon: "HandHeart", sortOrder: 1 },
        { group: "cta", value: "Better Outcomes", label: "Care aimed at getting life back", icon: "BadgeCheck", sortOrder: 2 },
      ],
    }),
  );

  await prisma.stat.updateMany({
    where: { value: "20+", label: "Years of Experience" },
    data: { value: "15+" },
  });
  await prisma.stat.updateMany({
    where: { value: "5000+", label: "Successful Surgeries" },
    data: { value: "4000+" },
  });
  await prisma.stat.updateMany({
    where: { value: "50+", label: "Awards & Recognitions" },
    data: { value: "", label: "Multiple Awards & Recognitions" },
  });
  await prisma.stat.updateMany({
    where: { label: "Research Publications" },
    data: { published: false },
  });

  await seedIfEmpty("conditions", await prisma.condition.count(), () =>
    prisma.condition.createMany({
      data: [
        migrainePage,
        { title: "Neck pain", slug: "neck-pain", summary: "Diagnosis and spine care", icon: "Bone", sortOrder: 1, description: overview("Neck pain"), symptoms, treatment },
        { title: "Back pain", slug: "back-pain", summary: "Diagnosis and spine care", icon: "Bone", sortOrder: 2, description: overview("Back pain"), symptoms, treatment },
        { title: "Sciatica", slug: "sciatica", summary: "Nerve pain and spine care", icon: "Zap", sortOrder: 3, description: overview("Sciatica"), symptoms, treatment },
        { title: "Sleep Disorders", slug: "sleep-disorders", summary: "Evaluation and management", icon: "Clock", sortOrder: 4, description: overview("Sleep disorders"), symptoms, treatment },
        { title: "Brain Infections", slug: "brain-infections", summary: "Diagnosis and treatment", icon: "ShieldPlus", sortOrder: 5, description: overview("Brain infections"), symptoms, treatment },
        facialPainPage,
        { title: "Hydrocephalus", slug: "hydrocephalus", summary: "Diagnosis and surgical care", icon: "Brain", sortOrder: 8, description: overview("Hydrocephalus"), symptoms, treatment },
        { title: "Spine Tumours", slug: "spine-tumours", summary: "Diagnosis and surgical treatment", icon: "Bone", sortOrder: 9, description: overview("Spine tumours"), symptoms, treatment },
        { title: "Head Injuries", slug: "head-injuries", summary: "Trauma care and follow-up", icon: "ShieldPlus", sortOrder: 10, description: overview("Head injuries"), symptoms, treatment },
        { title: "Cases of Road Traffic Accidents", slug: "road-traffic-accidents", summary: "Trauma care and follow-up", icon: "Activity", sortOrder: 11, description: overview("Road traffic injuries"), symptoms, treatment },
        { title: "Dementia memory disturbance", slug: "dementia-memory-disturbance", summary: "Evaluation of memory change", icon: "Brain", sortOrder: 12, description: overview("Dementia and memory disturbance"), symptoms, treatment },
      ],
    }),
  );

  const previousConditions = await prisma.condition.findMany({ select: { title: true } });
  if (previousConditions.some((item) => item.title === "Brain Tumors") && !previousConditions.some((item) => item.title === "Neck pain")) {
    await prisma.condition.deleteMany();
    await prisma.condition.createMany({
      data: [
        migrainePage,
        { title: "Neck pain", slug: "neck-pain", summary: "Diagnosis and spine care", icon: "Bone", sortOrder: 1, description: overview("Neck pain"), symptoms, treatment },
        { title: "Back pain", slug: "back-pain", summary: "Diagnosis and spine care", icon: "Bone", sortOrder: 2, description: overview("Back pain"), symptoms, treatment },
        { title: "Sciatica", slug: "sciatica", summary: "Nerve pain and spine care", icon: "Zap", sortOrder: 3, description: overview("Sciatica"), symptoms, treatment },
        { title: "Sleep Disorders", slug: "sleep-disorders", summary: "Evaluation and management", icon: "Clock", sortOrder: 4, description: overview("Sleep disorders"), symptoms, treatment },
        { title: "Brain Infections", slug: "brain-infections", summary: "Diagnosis and treatment", icon: "ShieldPlus", sortOrder: 5, description: overview("Brain infections"), symptoms, treatment },
        facialPainPage,
        { title: "Hydrocephalus", slug: "hydrocephalus", summary: "Diagnosis and surgical care", icon: "Brain", sortOrder: 8, description: overview("Hydrocephalus"), symptoms, treatment },
        { title: "Spine Tumours", slug: "spine-tumours", summary: "Diagnosis and surgical treatment", icon: "Bone", sortOrder: 9, description: overview("Spine tumours"), symptoms, treatment },
        { title: "Head Injuries", slug: "head-injuries", summary: "Trauma care and follow-up", icon: "ShieldPlus", sortOrder: 10, description: overview("Head injuries"), symptoms, treatment },
        { title: "Cases of Road Traffic Accidents", slug: "road-traffic-accidents", summary: "Trauma care and follow-up", icon: "Activity", sortOrder: 11, description: overview("Road traffic injuries"), symptoms, treatment },
        { title: "Dementia memory disturbance", slug: "dementia-memory-disturbance", summary: "Evaluation of memory change", icon: "Brain", sortOrder: 12, description: overview("Dementia and memory disturbance"), symptoms, treatment },
      ],
    });
    console.log("replaced conditions");
  }

  const migrationRow = await prisma.condition.findFirst({
    where: { OR: [{ slug: "migration" }, { title: "Migration" }] },
  });
  if (migrationRow) {
    await prisma.condition.update({ where: { id: migrationRow.id }, data: migrainePage });
    console.log("renamed migraine");
  }

  const trigeminalRow = await prisma.condition.findFirst({ where: { slug: "trigeminal" } });
  const facialRow = await prisma.condition.findFirst({ where: { slug: "trigeminal-neuralgia" } });
  if (trigeminalRow && facialRow) {
    await prisma.condition.delete({ where: { id: trigeminalRow.id } });
  } else if (trigeminalRow) {
    await prisma.condition.update({ where: { id: trigeminalRow.id }, data: facialPainPage });
    console.log("merged trigeminal neuralgia");
  }
  const removedNeuralgia = await prisma.condition.deleteMany({
    where: { OR: [{ slug: "neuralgia" }, { title: "Neuralgia" }] },
  });
  if (removedNeuralgia.count) console.log("removed separate neuralgia");

  await seedIfEmpty("stories", await prisma.patientStory.count(), () =>
    prisma.patientStory.createMany({
      data: [
        { name: "Rajesh P.", condition: "Spine Surgery", quote: "I can walk pain-free again. Thank you, Dr. Kairav Shah.", story: "Sample story for the design. Replace it with a consented account before publishing.", image: "/media/patient-1.jpg", sortOrder: 0, featured: true },
        { name: "Neha S.", condition: "Brain Tumor Surgery", quote: "He gave me a new lease of life.", story: "Sample story for the design. Replace it with a consented account before publishing.", image: "/media/patient-2.jpg", sortOrder: 1, featured: true },
        { name: "Aarav M.", condition: "Pediatric Neurosurgery", quote: "My child is back to school and living his dreams.", story: "Sample story for the design. Replace it with a consented account, and use a photograph the family has approved.", image: "/media/patient-3.jpg", sortOrder: 2, featured: true },
      ],
    }),
  );

  await seedIfEmpty("achievements", await prisma.achievement.count(), () =>
    prisma.achievement.createMany({
      data: [
        { value: "50+", title: "Awards & Honours", subtitle: "Recognition from clinical and academic bodies", description: "Replace this figure with awards that can be listed by name.", icon: "Award", sortOrder: 0 },
        { value: "100+", title: "Research Publications", subtitle: "Peer-reviewed work on brain and spine care", description: "Replace this figure with a current publication count.", icon: "BookOpen", sortOrder: 1 },
        { value: "", title: "International Speaker", subtitle: "Invited talks and teaching courses", description: "Add the meetings and years once the programme is confirmed.", icon: "Mic", sortOrder: 2 },
        { value: "", title: "Fellowships & Certifications", subtitle: "Advanced training beyond the core degree", description: "List each fellowship, hospital, and year in this description.", icon: "BadgeCheck", sortOrder: 3 },
      ],
    }),
  );

  const stockHonours = await prisma.achievement.findMany({
    where: {
      title: { in: ["Awards & Honours", "Research Publications", "International Speaker", "Fellowships & Certifications"] },
    },
  });
  for (const item of stockHonours) {
    if (/Replace this|Add the meetings|List each fellowship/.test(item.description)) {
      await prisma.achievement.update({ where: { id: item.id }, data: { published: false } });
    }
  }

  const honours = [
    {
      value: "",
      title: "With the Hon. Prime Minister",
      subtitle: "Shri Narendra Modi",
      description:
        "Dr. Kairav Shah with Shri Narendra Modi. The photograph is from a meeting during his years of work as a neurosurgeon, and the clinic keeps it among the public moments of that work.",
      icon: "Users",
      image: "/media/gallery/with-prime-minister.jpg",
      sortOrder: 0,
    },
    {
      value: "",
      title: "Honoured by the Hon. Chief Minister",
      subtitle: "Shri Bhupendrabhai Patel, Taj Skyline",
      description:
        "Shri Bhupendrabhai Patel, Hon. Chief Minister of Gujarat, was chief guest at Taj Skyline when he presented this honour to Dr. Kairav Shah. The plaque is inscribed Bharat.",
      icon: "Award",
      image: "/media/gallery/chief-minister-honour.jpg",
      sortOrder: 1,
    },
    {
      value: "",
      title: "The Bharat plaque",
      subtitle: "Presented by the Hon. Chief Minister",
      description:
        "A closer view of the Bharat plaque Shri Bhupendrabhai Patel, Hon. Chief Minister of Gujarat, presented to Dr. Kairav Shah at Taj Skyline.",
      icon: "Award",
      image: "/media/gallery/chief-minister-close.jpg",
      sortOrder: 2,
    },
    {
      value: "3",
      title: "Gold medals, Gujarat University",
      subtitle: "First rank, M.S. General Surgery",
      description:
        "Three gold medals for first rank in the Gujarat University M.S. General Surgery examination, and a gold medal from the B.J. Medical College Alumni for the best outgoing student.",
      icon: "Award",
      image: "/media/gallery/gujarat-university-medal.jpg",
      sortOrder: 3,
    },
    {
      value: "",
      title: "Gujarat University convocation",
      subtitle: "First rank, M.S. General Surgery",
      description:
        "Dr. Kairav Shah at the Gujarat University convocation with the gold medals for first rank in the M.S. General Surgery examination.",
      icon: "GraduationCap",
      image: "/media/gallery/gujarat-university-convocation.jpg",
      sortOrder: 4,
    },
    {
      value: "",
      title: "Community honour",
      subtitle: "Citation for service",
      description: "Garlanded at a community programme and presented with a citation for his work.",
      icon: "Heart",
      image: "/media/gallery/community-honour.jpg",
      sortOrder: 5,
    },
    {
      value: "",
      title: "Barrow Neurological Institute",
      subtitle: "Microneurosurgery with Dr. Michael Lawton",
      description: "Training in microneurosurgery at Barrow Neurological Institute, with Dr. Michael Lawton.",
      icon: "GraduationCap",
      image: "/media/gallery/barrow-colleague.jpg",
      sortOrder: 6,
    },
    {
      value: "",
      title: "A family's letter of thanks",
      subtitle: "Kept at the clinic",
      description: "A framed letter of appreciation from a family, presented to Dr. Kairav Shah at the clinic.",
      icon: "Heart",
      image: "/media/gallery/clinic-appreciation.jpg",
      sortOrder: 7,
    },
    {
      value: "",
      title: "Fellowship in microneurosurgery",
      subtitle: "University Hospital, Helsinki, 2019",
      description: "A fellowship in microneurosurgery at University Hospital, Helsinki, in 2019.",
      icon: "GraduationCap",
      image: "",
      sortOrder: 8,
    },
    {
      value: "",
      title: "Torrent Young Scholar Award",
      subtitle: "Neurosurgery, 2014",
      description: "Best orator, and second runner-up, at the national Torrent Young Scholar Award for Neurosurgery in 2014.",
      icon: "Mic",
      image: "",
      sortOrder: 9,
    },
    {
      value: "",
      title: "Bharat Medical Excellence Award",
      subtitle: "Neurosurgery",
      description: "The Bharat Medical Excellence Award in neurosurgery, for his work over the past decade.",
      icon: "Award",
      image: "",
      sortOrder: 10,
    },
    {
      value: "",
      title: "Manav Kalyan Mandal",
      subtitle: "Rajkot, 2018 and 2019",
      description: "Honoured by Manav Kalyan Mandal, Rajkot, in 2018 and 2019 for service.",
      icon: "Heart",
      image: "",
      sortOrder: 11,
    },
    {
      value: "",
      title: "Dhirubhai Ambani Foundation scholarship",
      subtitle: "First rank, Kheda district",
      description: "A scholarship from the Shri Dhirubhai Ambani Foundation for first rank in Kheda district in the higher secondary examination.",
      icon: "BadgeCheck",
      image: "",
      sortOrder: 12,
    },
    {
      value: "30+",
      title: "Public speaking awards",
      subtitle: "District, state, and national",
      description: "More than 30 awards in public speaking and elocution, at district, state, and national level.",
      icon: "Mic",
      image: "",
      sortOrder: 13,
    },
    {
      value: "",
      title: "Research papers",
      subtitle: "Indian Journal of Neurosurgery and Asian Journal of Neurosurgery",
      description:
        "Published work includes a comparison of phenytoin and levetiracetam for seizure prevention after traumatic brain injury, in the Indian Journal of Neurosurgery, and a paper on repeat CT scans in mild and moderate traumatic brain injury, in the Asian Journal of Neurosurgery. The seizure study was also presented at NSICON 2014.",
      icon: "BookOpen",
      image: "",
      sortOrder: 14,
    },
  ];

  for (const honour of honours) {
    const existing = await prisma.achievement.findFirst({ where: { title: honour.title } });
    if (existing) {
      await prisma.achievement.update({ where: { id: existing.id }, data: { ...honour, published: true } });
    } else {
      await prisma.achievement.create({ data: { ...honour, published: true } });
    }
  }

  await seedIfEmpty("videos", await prisma.video.count(), () =>
    prisma.video.createMany({
      data: [
        { title: "Understanding Brain Tumors", slug: "understanding-brain-tumors", description: "A plain-language look at how tumors are found and discussed.", thumbnail: "/media/video-1.jpg", duration: "3:45", category: "Education", sortOrder: 0 },
        { title: "Minimally Invasive Spine Surgery", slug: "minimally-invasive-spine-surgery", description: "Spine · Early signs and when an opinion helps.", thumbnail: "/media/video-2.jpg", duration: "5:12", category: "Surgery", sortOrder: 1 },
        { title: "Life After Brain Surgery", slug: "life-after-brain-surgery", description: "What recovery can involve, in general terms.", thumbnail: "/media/video-3.jpg", duration: "4:20", category: "Recovery", sortOrder: 2 },
      ],
    }),
  );

  const talks = [
    { title: "The Jay Thadeshwar Show", slug: "jay-thadeshwar-show", description: "Dr. Kairav Shah on brain tumours, paralysis, and stroke, in conversation on The Jay Thadeshwar Show.", sourceUrl: "https://youtu.be/WnaTpgwMrnI", thumbnail: "https://i.ytimg.com/vi/WnaTpgwMrnI/hqdefault.jpg", category: "Podcast", sortOrder: 0, featured: true },
    { title: "Can I marry if I have epilepsy?", slug: "live-beyond-epilepsy", description: "Dr. Kairav Shah on marriage, children, and life with epilepsy, for The Indian Express Live Beyond Epilepsy series.", sourceUrl: "https://www.youtube.com/watch?v=Lf1bckBxxTk", thumbnail: "https://i.ytimg.com/vi/Lf1bckBxxTk/hqdefault.jpg", category: "Epilepsy", sortOrder: 1, featured: true },
    { title: "Myths about brain tumors", slug: "myths-about-brain-tumors-youtube", description: "A YouTube talk from Dr. Kairav Shah on common myths about brain tumors.", sourceUrl: "https://www.youtube.com/watch?v=Il9MIHaHdBw", thumbnail: "https://i.ytimg.com/vi/Il9MIHaHdBw/hqdefault.jpg", category: "Brain health", sortOrder: 2, featured: true },
    { title: "Rajsik food and a restless mind", slug: "rajsik-food-and-a-restless-mind", description: "How very spicy, oily, and stimulating food can add to stress, poor sleep, and irritability, and why balance matters.", sourceUrl: "https://www.instagram.com/reel/DVBRt11ggG4/", category: "Food and lifestyle", sortOrder: 1, featured: true },
    { title: "When to check an elder's brain health", slug: "when-to-check-an-elders-brain-health", description: "Early neurological warning signs in parents and older relatives, and why they deserve the same attention as the heart and blood pressure.", sourceUrl: "https://www.instagram.com/reel/DVOTspNgsNU/", category: "Brain health", sortOrder: 2, featured: true },
    { title: "Tamsik food and mental fog", slug: "tamsik-food-and-mental-fog", description: "How stale, heavily processed, and oversized meals can dull energy, sleep, and mental clarity.", sourceUrl: "https://www.instagram.com/reel/DVJE_mZgjFE/", category: "Food and lifestyle", sortOrder: 3, featured: false },
    { title: "Warning signs in older age", slug: "warning-signs-in-older-age", description: "Memory loss, personality change, confusion, speech difficulty, tremors, and sudden one-sided weakness should not be ignored.", sourceUrl: "https://www.instagram.com/reel/DVV_d_OAZzW/", category: "Brain health", sortOrder: 4, featured: false },
    { title: "Myths about sciatica", slug: "myths-about-sciatica", description: "Pain from the lower back into the leg is not always solved by bed rest, and it does not always need an operation.", sourceUrl: "https://www.instagram.com/reel/DXecJPCApF4/", category: "Spine", sortOrder: 5, featured: false },
    { title: "Myths about spine surgery", slug: "myths-about-spine-surgery", description: "Most people with back or leg pain do not need spine surgery. When an operation is right, a smaller approach can mean a shorter stay.", sourceUrl: "https://www.instagram.com/reel/DYIxEIuiyIZ/", category: "Spine", sortOrder: 6, featured: false },
    { title: "Painkillers are not a diagnosis", slug: "painkillers-are-not-a-diagnosis", description: "A tablet can quiet pain for a few hours. Pain that keeps returning needs a cause, not only another dose.", sourceUrl: "https://www.instagram.com/reel/DXzJMNgibsa/", category: "Myths", sortOrder: 7, featured: false },
    { title: "Myths about headache", slug: "myths-about-headache", description: "A short reel on common beliefs about headache, from Neurokalp in Ahmedabad.", sourceUrl: "https://www.instagram.com/reel/DYhs2eZCzLx/", category: "Myths", sortOrder: 8, featured: false },
    { title: "When a headache needs attention", slug: "when-a-headache-needs-attention", description: "Not every headache is stress, and a painkiller is not always the whole answer. Frequent or severe headaches deserve a proper look.", sourceUrl: "https://www.instagram.com/reel/DYpTS1eCD8G/", category: "Brain health", sortOrder: 9, featured: false },
    { title: "Why hands shake", slug: "why-hands-shake", description: "Tremors can come from stress, medicines, caffeine, poor sleep, essential tremor, or Parkinson's disease. The cause is worth finding early.", sourceUrl: "https://www.instagram.com/reel/DZkimRJC_4L/", category: "Brain health", sortOrder: 10, featured: false },
    { title: "Myths about brain tumours", slug: "myths-about-brain-tumours", description: "A headache is not a brain tumour by default, and not every tumour is cancer. Timely diagnosis matters more than fear.", sourceUrl: "https://www.instagram.com/reel/DaAteRcB7iK/", category: "Brain health", sortOrder: 11, featured: false },
    { title: "Stress and the brain", slug: "stress-and-the-brain", description: "A Gujarati talk on how long-running stress can affect blood pressure, sleep, mood, and memory, and what helps.", sourceUrl: "https://www.instagram.com/reel/Db0SOS8u3kC/", category: "Brain health", sortOrder: 12, featured: false },
    { title: "Sant sanyog", slug: "sant-sanyog", description: "A reflection on the company we keep, and on living with less stress.", sourceUrl: "https://www.instagram.com/reel/DXKJG-DAkrz/", category: "Community", sortOrder: 13, featured: false },
    { title: "Sant sanyog, continued", slug: "sant-sanyog-continued", description: "A second reflection on faith, company, and a calmer life.", sourceUrl: "https://www.instagram.com/reel/DXKHtjBgYKQ/", category: "Community", sortOrder: 14, featured: false },
    { title: "A problem and its answer", slug: "a-problem-and-its-answer", description: "Problems are part of life. A calmer mind is often what finds the way through.", sourceUrl: "https://www.instagram.com/reel/Db0uQnNi3Rz/", category: "Community", sortOrder: 15, featured: false },
    { title: "Life, like a box of chocolates", slug: "life-like-a-box-of-chocolates", description: "We do not choose every day we are given. We can choose how we meet it.", sourceUrl: "https://www.instagram.com/reel/DcEDH5iCkCX/", category: "Community", sortOrder: 16, featured: false },
    { title: "Knowledge, skill, and judgement", slug: "knowledge-skill-and-judgement", description: "Knowing what to say, how to say it, and when to stay quiet. A note on communication.", sourceUrl: "https://www.instagram.com/reel/Dd3vpksuoG2/", category: "Community", sortOrder: 17, featured: false },
    { title: "Where happiness lives", slug: "where-happiness-lives", description: "You cannot add days to your life, but you can add life to your days. A note on stress and small joys.", sourceUrl: "https://www.instagram.com/reel/DbqiMsNCwPQ/", category: "Community", sortOrder: 18, featured: false },
    { title: "Clinic reel", slug: "from-the-clinic", description: "A short film from the clinic.", sourceUrl: "https://www.instagram.com/reel/DUQndgYgSwL/", category: "Community", sortOrder: 19, featured: false },
    { title: "Clinic reel, two", slug: "from-the-clinic-second-reel", description: "A short film from the clinic.", sourceUrl: "https://www.instagram.com/reel/DUXYl1niJXQ/", category: "Community", sortOrder: 20, featured: false },
    { title: "Clinic reel, three", slug: "from-the-clinic-third-reel", description: "A short film from the clinic.", sourceUrl: "https://www.instagram.com/reel/DUc1zqmjYbw/", category: "Community", sortOrder: 21, featured: false },
  ];

  await prisma.video.updateMany({ where: { sourceUrl: "" }, data: { published: false, featured: false } });
  for (const talk of talks) {
    const localReel = talk.sourceUrl.includes("instagram.com") ? `/media/reels/${talk.slug}.jpg` : "";
    const thumbnail = talk.thumbnail || localReel;
    const sortOrder = /youtu\.be|youtube\.com/i.test(talk.sourceUrl) ? talk.sortOrder : talk.sortOrder + 2;
    const data = { ...talk, thumbnail, sortOrder, published: true };
    const existing = await prisma.video.findFirst({ where: { OR: [{ sourceUrl: talk.sourceUrl }, { slug: talk.slug }] } });
    if (!existing) {
      await prisma.video.create({ data });
      continue;
    }
    const placeholder = existing.description.includes("Edit this title in Admin");
    await prisma.video.update({
      where: { id: existing.id },
      data: placeholder ? data : { published: true, sourceUrl: talk.sourceUrl, thumbnail, sortOrder, featured: talk.featured },
    });
  }

  await seedIfEmpty("press", await prisma.pressItem.count(), () =>
    prisma.pressItem.createMany({
      data: [
        { outlet: "The Times of India", title: "A conversation on safer brain surgery", excerpt: "Sample mention. Add the real article link.", dateLabel: "2026", sortOrder: 0 },
        { outlet: "NDTV", title: "When a spine opinion should not wait", excerpt: "Sample mention. Add the real article link.", dateLabel: "2026", sortOrder: 1 },
        { outlet: "mint", title: "Notes on recovery after neurosurgery", excerpt: "Sample mention. Add the real article link.", dateLabel: "2025", sortOrder: 2 },
        { outlet: "The Indian Express", title: "Teaching the next generation of surgeons", excerpt: "Sample mention. Add the real article link.", dateLabel: "2025", sortOrder: 3 },
      ],
    }),
  );

  await seedIfEmpty("gallery", await prisma.galleryItem.count(), () =>
    prisma.galleryItem.createMany({
      data: [
        { title: "In the Operation Theatre", caption: "Sample photograph. Replace with the clinic's own image.", image: "/media/gallery-ot.jpg", category: "Operation Theatre", sortOrder: 0 },
        { title: "At International Conference", caption: "Sample photograph from a medical meeting.", image: "/media/gallery-conf.jpg", category: "Conferences", sortOrder: 1 },
        { title: "With Medical Team", caption: "Sample team photograph.", image: "/media/gallery-team.jpg", category: "Hospital", sortOrder: 2 },
        { title: "Community Outreach", caption: "Sample community photograph.", image: "/media/gallery-community.jpg", category: "Community Events", sortOrder: 3 },
        { title: "Hospital corridor", caption: "Where families wait and recover.", image: "/media/hospital.jpg", category: "Hospital", sortOrder: 4 },
        { title: "Imaging review", caption: "Scans discussed before a decision.", image: "/media/mri.jpg", category: "Media Coverage", sortOrder: 5 },
      ],
    }),
  );

  await seedIfEmpty("posts", await prisma.post.count(), () =>
    prisma.post.createMany({
      data: [
        {
          title: "Understanding Brain Tumor Symptoms",
          slug: "understanding-brain-tumor-symptoms",
          excerpt: "Headache has many causes. These are the changes that deserve a medical review.",
          coverImage: "/media/blog-1.jpg",
          category: "Brain",
          author: "Dr. Kairav Shah",
          publishedOn: "2026-10-01",
          sortOrder: 0,
          content: "## What people notice\n\nA brain tumor is not the usual reason for a headache. A review is more important when headache is new, worse in the morning, or joined by vomiting, a seizure, weakness, or a change in speech or vision.\n\n## What happens next\n\nA doctor examines you and looks at a scan if one is needed. The scan does not, by itself, decide on an operation.\n\n**Bring previous reports** to the consultation so the discussion starts from what is already known.",
        },
        {
          title: "When is Spine Surgery Needed?",
          slug: "when-is-spine-surgery-needed",
          excerpt: "Most back pain improves without an operation. These are situations where a surgeon's opinion helps.",
          coverImage: "/media/blog-2.jpg",
          category: "Spine",
          author: "Dr. Kairav Shah",
          publishedOn: "2026-09-24",
          sortOrder: 1,
          content: "## Pain alone is not a reason to operate\n\nMany people with back or neck pain improve with time, movement, and the right non-surgical care.\n\n## Ask for a review sooner when\n\n- Weakness, numbness, or trouble walking is new\n- Bladder or bowel control changes\n- Pain follows a fall, cancer, fever, or unexplained weight loss\n\nSurgery is considered when a nerve or the spinal cord is under pressure and the expected benefit is greater than the risk.",
        },
        {
          title: "Strokes: Early Signs You Shouldn't Ignore",
          slug: "stroke-early-signs",
          excerpt: "Face, arm, and speech changes need emergency care. This note is about recognising them.",
          coverImage: "/media/blog-3.jpg",
          category: "Stroke",
          author: "Dr. Kairav Shah",
          publishedOn: "2026-09-15",
          sortOrder: 2,
          content: "## Use emergency services\n\nIf the face droops, an arm is weak, or speech is slurred, call the emergency number. Do not wait for a clinic appointment.\n\n## After the emergency\n\nFollow-up looks at recovery, medicines, and how to lower the chance of another stroke. That plan is individual.",
        },
      ],
    }),
  );

  await seedIfEmpty("social", await prisma.socialUpdate.count(), () =>
    prisma.socialUpdate.createMany({
      data: [
        { label: "At Work", image: "/media/gallery-ot.jpg", sortOrder: 0 },
        { label: "Patient Stories", image: "/media/patient-2.jpg", sortOrder: 1 },
        { label: "Conferences", image: "/media/gallery-conf.jpg", sortOrder: 2 },
        { label: "Awareness", image: "/media/blog-1.jpg", sortOrder: 3 },
        { label: "Team", image: "/media/gallery-team.jpg", sortOrder: 4 },
        { label: "Life at Hospital", image: "/media/hospital.jpg", sortOrder: 5 },
        { label: "Tips", image: "/media/video-3.jpg", sortOrder: 6 },
      ],
    }),
  );

  await seedIfEmpty("pages", await prisma.page.count(), () =>
    prisma.page.createMany({
      data: [
        {
          slug: "about",
          title: "About the practice",
          excerpt: "How a consultation is organised.",
          sortOrder: 0,
          content: "## How a visit works\n\n- Share reports ahead of time when you can.\n- The visit covers symptoms, the examination, and the scans already done.\n- If an operation is one of the choices, you will hear the benefits, the risks, and the alternatives.\n\n## Before this site is published\n\nReplace the biography, photograph, phone number, address, and statistics with verified details. Add the doctor's medical registration number where patients expect to see it.",
        },
        {
          slug: "privacy",
          title: "Privacy policy",
          excerpt: "A starting point. Have it reviewed before launch.",
          sortOrder: 1,
          content: "## What the clinic collects\n\nAppointment requests collect your name, phone number, email, the reason for the visit, and anything you choose to write. Contact messages collect your name, phone number, and what you write. The clinic uses this to reply and to arrange care.\n\n## What this template does not do\n\nIt does not sell the form contents. It stores them in the clinic database. Staff who sign in to the admin panel can read them.\n\n## Before launch\n\nA lawyer should adapt this page to the clinic's real processors, retention period, and the rights patients have under Indian law.",
        },
        {
          slug: "terms",
          title: "Terms and conditions",
          excerpt: "A starting point. Have it reviewed before launch.",
          sortOrder: 2,
          content: "## Using this website\n\nThe articles, videos, and condition pages are general information. They are not a diagnosis, a second opinion, or an emergency service.\n\n## Appointments\n\nSending the booking form requests a time. The appointment is confirmed only when the clinic contacts you. Please call emergency services for sudden weakness, trouble speaking, a seizure, or a serious injury.\n\n## Before launch\n\nReplace this page with terms written for the clinic.",
        },
      ],
    }),
  );

  const clinicPhotos = [
    {
      title: "With the Hon. Chief Minister",
      caption: "Receiving an honour from Shree Bhupendrabhai Patel at Taj Skyline.",
      image: "/media/gallery/chief-minister-honour.jpg",
      category: "Media Coverage",
      sortOrder: 0,
    },
    {
      title: "Speaking at a meeting",
      caption: "Addressing a medical meeting.",
      image: "/media/gallery/conference-speaking.jpg",
      category: "Conferences",
      sortOrder: 1,
    },
    {
      title: "With the operating team",
      caption: "Alongside colleagues in the operating theatre.",
      image: "/media/gallery/surgical-team.jpg",
      category: "Operation Theatre",
      sortOrder: 2,
    },
    {
      title: "Community honour",
      caption: "Garlanded at a community programme.",
      image: "/media/gallery/community-honour.jpg",
      category: "Community Events",
      sortOrder: 3,
    },
    {
      title: "After a teaching session",
      caption: "With a colleague following a clinical presentation.",
      image: "/media/gallery/clinical-exchange.jpg",
      category: "Conferences",
      sortOrder: 4,
    },
    {
      title: "Community gathering",
      caption: "With community leaders at a public programme.",
      image: "/media/gallery/community-gathering.jpg",
      category: "Community Events",
      sortOrder: 5,
    },
    {
      title: "Community visit",
      caption: "A visit with the sisters at a community home.",
      image: "/media/gallery/community-visit.jpg",
      category: "Community Events",
      sortOrder: 6,
    },
    {
      title: "On the ward",
      caption: "With the care team during a ward round.",
      image: "/media/gallery/hospital-ward.jpg",
      category: "Hospital",
      sortOrder: 7,
    },
    {
      title: "Citation at the community programme",
      caption: "The citation presented during the same community honour.",
      image: "/media/gallery/community-honour-citation.jpg",
      category: "Community Events",
      sortOrder: 8,
    },
    {
      title: "With the Hon. Prime Minister",
      caption: "With Shri Narendra Modi.",
      image: "/media/gallery/with-prime-minister.jpg",
      category: "Media Coverage",
      sortOrder: 9,
    },
    {
      title: "At Barrow Neurological Institute",
      caption: "With a colleague at Barrow Neurological Institute.",
      image: "/media/gallery/barrow-colleague.jpg",
      category: "Hospital",
      sortOrder: 10,
    },
    {
      title: "At Barrow, a wider view",
      caption: "With a colleague at Barrow Neurological Institute.",
      image: "/media/gallery/barrow-colleague-wide.jpg",
      category: "Hospital",
      sortOrder: 11,
    },
    {
      title: "In the hospital corridor",
      caption: "With a colleague between cases.",
      image: "/media/gallery/hospital-corridor.jpg",
      category: "Hospital",
      sortOrder: 12,
    },
    {
      title: "The Chief Minister's honour",
      caption: "A closer view of the honour from Shree Bhupendrabhai Patel.",
      image: "/media/gallery/chief-minister-close.jpg",
      category: "Media Coverage",
      sortOrder: 13,
    },
    {
      title: "Gujarat University convocation",
      caption: "At the Gujarat University convocation.",
      image: "/media/gallery/gujarat-university-convocation.jpg",
      category: "Conferences",
      sortOrder: 14,
    },
    {
      title: "Gujarat University medal",
      caption: "Receiving a medal at the Gujarat University convocation.",
      image: "/media/gallery/gujarat-university-medal.jpg",
      category: "Conferences",
      sortOrder: 15,
    },
    {
      title: "After the presentation",
      caption: "With a colleague following a teaching session.",
      image: "/media/gallery/teaching-handshake.jpg",
      category: "Conferences",
      sortOrder: 16,
    },
    {
      title: "Evagrace programme",
      caption: "On stage at an Evagrace programme.",
      image: "/media/gallery/evagrace-honour.jpg",
      category: "Community Events",
      sortOrder: 17,
    },
    {
      title: "Evagrace programme, on stage",
      caption: "Presenting an honour at the Evagrace programme.",
      image: "/media/gallery/evagrace-honour-stage.jpg",
      category: "Community Events",
      sortOrder: 18,
    },
    {
      title: "Visit with the sisters",
      caption: "At a community home.",
      image: "/media/gallery/community-visit-home.jpg",
      category: "Community Events",
      sortOrder: 19,
    },
    {
      title: "A conversation at the community home",
      caption: "Speaking with the sisters during a visit.",
      image: "/media/gallery/community-conversation.jpg",
      category: "Community Events",
      sortOrder: 20,
    },
    {
      title: "Community assembly",
      caption: "At a community gathering.",
      image: "/media/gallery/community-assembly.jpg",
      category: "Community Events",
      sortOrder: 21,
    },
    {
      title: "A blessing",
      caption: "During a visit with the monks.",
      image: "/media/gallery/blessing.jpg",
      category: "Community Events",
      sortOrder: 22,
    },
    {
      title: "Before travel",
      caption: "A meeting at the airport.",
      image: "/media/gallery/airport-meeting.jpg",
      category: "Community Events",
      sortOrder: 23,
    },
    {
      title: "A letter of appreciation",
      caption: "With a letter of thanks at the clinic.",
      image: "/media/gallery/clinic-appreciation.jpg",
      category: "Hospital",
      sortOrder: 24,
    },
    {
      title: "Appreciation at the clinic",
      caption: "Another view of the letter of thanks.",
      image: "/media/gallery/clinic-appreciation-second.jpg",
      category: "Hospital",
      sortOrder: 25,
    },
    {
      title: "With a patient and family",
      caption: "At the clinic.",
      image: "/media/gallery/clinic-family.jpg",
      category: "Hospital",
      sortOrder: 26,
    },
    {
      title: "Ward round",
      caption: "With the care team on the ward.",
      image: "/media/gallery/ward-round-child.jpg",
      category: "Hospital",
      sortOrder: 27,
    },
    {
      title: "A ward visit",
      caption: "With the care team and a patient.",
      image: "/media/gallery/ward-visit.jpg",
      category: "Hospital",
      sortOrder: 28,
    },
    {
      title: "A ward visit, another view",
      caption: "With the care team and a patient.",
      image: "/media/gallery/ward-visit-second.jpg",
      category: "Hospital",
      sortOrder: 29,
    },
    {
      title: "A letter from the family",
      caption: "With a family in the clinic.",
      image: "/media/gallery/clinic-letter.jpg",
      category: "Hospital",
      sortOrder: 30,
    },
    {
      title: "The family's letter",
      caption: "Another view of the clinic visit.",
      image: "/media/gallery/clinic-letter-group.jpg",
      category: "Hospital",
      sortOrder: 31,
    },
    {
      title: "A family visit",
      caption: "With a family at the clinic.",
      image: "/media/gallery/clinic-family-visit.jpg",
      category: "Hospital",
      sortOrder: 32,
    },
    {
      title: "In the clinic office",
      caption: "With visitors at the clinic.",
      image: "/media/gallery/clinic-office-visit.jpg",
      category: "Hospital",
      sortOrder: 33,
    },
    { title: "At the desk", caption: "Dr. Kairav Shah in the consultation room.", image: "/media/portraits/desk.jpg", category: "Hospital", sortOrder: 40 },
    { title: "At NEUROKALP Clinic", caption: "At the clinic in Ahmedabad.", image: "/media/portraits/clinic-wall.png", category: "Hospital", sortOrder: 41 },
    { title: "Ready for surgery", caption: "Before an operation.", image: "/media/portraits/scrubs.png", category: "Operation Theatre", sortOrder: 42 },
    { title: "During surgery", caption: "At the operating microscope.", image: "/media/portraits/theatre-loupes.jpg", category: "Operation Theatre", sortOrder: 43 },
    { title: "In the operating theatre", caption: "Under the theatre lights.", image: "/media/portraits/theatre-lights.jpg", category: "Operation Theatre", sortOrder: 44 },
    { title: "A formal portrait", caption: "Dr. Kairav Shah.", image: "/media/portraits/blazer.png", category: "Hospital", sortOrder: 45 },
    { title: "At the clinic", caption: "A quiet moment between consultations.", image: "/media/portraits/polo.png", category: "Hospital", sortOrder: 46 },
    { title: "A greeting", caption: "Dr. Kairav Shah.", image: "/media/portraits/namaste.jpg", category: "Community Events", sortOrder: 47 },
    { title: "In the mountains", caption: "Away from the operating theatre.", image: "/media/portraits/mountain.png", category: "Community Events", sortOrder: 48 },
  ];

  await prisma.galleryItem.updateMany({
    where: { image: { not: { startsWith: "/media/gallery/" } } },
    data: { published: false },
  });

  for (const photo of clinicPhotos) {
    const existing = await prisma.galleryItem.findFirst({ where: { image: photo.image } });
    if (existing) {
      await prisma.galleryItem.update({ where: { id: existing.id }, data: { ...photo, published: true } });
    } else {
      await prisma.galleryItem.create({ data: { ...photo, published: true } });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
