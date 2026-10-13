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
        phone: "+919876543210",
        phoneDisplay: "+91 98765 43210",
        whatsapp: "919876543210",
        email: "appointments@kairavshah.example",
        address: "Neurosciences Clinic, India",
        heroEyebrow: "Expertise | Compassion | Better Lives",
        heroTitle: "Advanced Neurosurgery\nFor A Healthier Tomorrow",
        heroSubtitle: "Comprehensive care for brain, spine and nervous system disorders with global expertise and a human touch.",
        heroQuote: "Restoring Lives Through Science and Care.",
        heroQuoteAuthor: "Dr. Kairav Shah",
        aboutEyebrow: "About",
        aboutDegrees: "MBBS, MS (General Surgery), MCh (Neurosurgery)",
        aboutBio:
          "Dr. Kairav Shah is a neurosurgeon with over 20 years of experience in complex brain and spine surgery. He is committed to world-class care, combining advanced technology with a compassionate, patient-first approach.",
        aboutQuote: "Every patient has a story. My goal is to help them return to the life they love.",
        aboutImage: "/media/doctor.jpg",
        ctaTitle: "Take the First Step\nTowards a Better Tomorrow",
        ctaSubtitle: "Expert care. Personalised treatment. A healthier, brighter you.",
        ctaImage: "/media/mountain.jpg",
        achievementQuote: "Success is not a destination, but a continuous pursuit of better care.",
        instagramHandle: "@dr.kairavshah",
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

  await seedIfEmpty("slides", await prisma.heroSlide.count(), () =>
    prisma.heroSlide.createMany({
      data: [
        { image: "/media/hero.jpg", alt: "Surgeon in an operating theatre", sortOrder: 0 },
        { image: "/media/hospital.jpg", alt: "Hospital corridor", sortOrder: 1 },
      ],
    }),
  );

  await seedIfEmpty("stats", await prisma.stat.count(), () =>
    prisma.stat.createMany({
      data: [
        { group: "highlight", value: "20+", label: "Years of Experience", icon: "Clock", sortOrder: 0 },
        { group: "highlight", value: "5000+", label: "Successful Surgeries", icon: "BadgeCheck", sortOrder: 1 },
        { group: "highlight", value: "International", label: "Fellowships & Training", icon: "Globe", sortOrder: 2 },
        { group: "highlight", value: "Patient-Centric", label: "Compassionate Care", icon: "Heart", sortOrder: 3 },
        { group: "about", value: "20+", label: "Years of Experience", icon: "Clock", sortOrder: 0 },
        { group: "about", value: "5000+", label: "Successful Surgeries", icon: "Activity", sortOrder: 1 },
        { group: "about", value: "50+", label: "Awards & Recognitions", icon: "Award", sortOrder: 2 },
        { group: "about", value: "100+", label: "Research Publications", icon: "BookOpen", sortOrder: 3 },
        { group: "about", value: "International", label: "Fellowships", icon: "GraduationCap", sortOrder: 4 },
        { group: "about", value: "", label: "Patients from India & Abroad", icon: "Users", sortOrder: 5 },
        { group: "cta", value: "Expert Guidance", label: "A plan explained in plain language", icon: "Stethoscope", sortOrder: 0 },
        { group: "cta", value: "Trusted Care", label: "Time to ask every question", icon: "HandHeart", sortOrder: 1 },
        { group: "cta", value: "Better Outcomes", label: "Care aimed at getting life back", icon: "BadgeCheck", sortOrder: 2 },
      ],
    }),
  );

  await seedIfEmpty("conditions", await prisma.condition.count(), () =>
    prisma.condition.createMany({
      data: [
        { title: "Brain Tumors", slug: "brain-tumors", summary: "Diagnosis & Advanced Surgical Treatment", icon: "Brain", image: "/media/mri.jpg", sortOrder: 0, description: overview("A brain tumor"), symptoms, treatment },
        { title: "Spine Surgery", slug: "spine-surgery", summary: "Minimally Invasive & Complex Spine Care", icon: "Bone", image: "/media/blog-2.jpg", sortOrder: 1, description: overview("Spine surgery"), symptoms, treatment },
        { title: "Stroke", slug: "stroke", summary: "Emergency & Preventive Care", icon: "Activity", image: "/media/blog-3.jpg", sortOrder: 2, description: overview("Stroke care"), symptoms: `## Act quickly\n\n- Face drooping, arm weakness, or trouble speaking\n- A sudden severe headache or loss of balance\n- Call emergency services first. A clinic appointment is for follow-up, not for a stroke that is happening now.`, treatment },
        { title: "Neuro Trauma", slug: "neuro-trauma", summary: "Critical Care & Rehabilitation", icon: "ShieldPlus", image: "/media/hospital.jpg", sortOrder: 3, description: overview("Neurotrauma"), symptoms, treatment },
        { title: "Epilepsy", slug: "epilepsy", summary: "Surgical Evaluation & Management", icon: "Zap", image: "/media/video-1.jpg", sortOrder: 4, description: overview("Epilepsy"), symptoms, treatment },
        { title: "Pediatric Neurosurgery", slug: "pediatric-neurosurgery", summary: "Specialized Care for Children", icon: "Baby", image: "/media/patient-3.jpg", sortOrder: 5, description: overview("Pediatric neurosurgery"), symptoms, treatment },
        { title: "Movement Disorders", slug: "movement-disorders", summary: "Advanced Therapies for Better Mobility", icon: "PersonStanding", image: "/media/video-3.jpg", sortOrder: 6, description: overview("Movement disorders"), symptoms, treatment },
      ],
    }),
  );

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

  await seedIfEmpty("videos", await prisma.video.count(), () =>
    prisma.video.createMany({
      data: [
        { title: "Understanding Brain Tumors", slug: "understanding-brain-tumors", description: "A plain-language look at how tumors are found and discussed.", thumbnail: "/media/video-1.jpg", duration: "3:45", category: "Education", sortOrder: 0 },
        { title: "Minimally Invasive Spine Surgery", slug: "minimally-invasive-spine-surgery", description: "Spine · Early signs and when an opinion helps.", thumbnail: "/media/video-2.jpg", duration: "5:12", category: "Surgery", sortOrder: 1 },
        { title: "Life After Brain Surgery", slug: "life-after-brain-surgery", description: "What recovery can involve, in general terms.", thumbnail: "/media/video-3.jpg", duration: "4:20", category: "Recovery", sortOrder: 2 },
      ],
    }),
  );

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
          content: "## What the clinic collects\n\nAppointment and contact forms collect your name, phone number, email, the reason for the visit, and anything you choose to write. The clinic uses this to reply and to arrange care.\n\n## What this template does not do\n\nIt does not sell the form contents. It stores them in the clinic database. Staff who sign in to the admin panel can read them.\n\n## Before launch\n\nA lawyer should adapt this page to the clinic's real processors, retention period, and the rights patients have under Indian law.",
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
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
