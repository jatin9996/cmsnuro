import type { ReactNode } from "react";
import { MediaImage } from "@/components/public/ui";

const posts = [
  {
    title: "Comparative study between phenytoin and levetiracetam in post-traumatic brain injury seizures prophylaxis",
    detail: "Indian Journal of Neurosurgery. ISSN 2277-954X.",
    href: "http://dx.doi.org/10.1055/s-0035-1558965",
  },
  {
    title: "Role of repeat CT scan in mild and moderate traumatic injury",
    detail: "Asian Journal of Neurosurgery.",
  },
  {
    title: "Comparative study between phenytoin and levetiracetam in post-traumatic brain injury seizures prophylaxis",
    detail: "Presented at NSICON 2014, Neurological Society of India.",
  },
];

const qualifications = [
  ["M.Ch, Neurosurgery", "Government Medical College and Hospital, Goa University", "Dr. Ponraj K.S. and Dr. V.N. Jindal", "69%. University first. Gold medallist."],
  ["M.S. General Surgery, 2008–2011", "B.J. Medical College, Ahmedabad, Gujarat University", "Dr. R.R. Patel and Dr. Hitendra Desai", "70%. University first. Gold medallist."],
  ["M.B.B.S., 2002–2007", "B.J. Medical College, Ahmedabad, Gujarat University", "", "72%."],
  ["H.S.C., 2002", "Gujarat Secondary and Higher Secondary Education Board", "", "89%. First in Kheda district."],
  ["S.S.C., 2000", "Gujarat Secondary Education Board", "", "91%."],
];

const photos = [
  { src: "/media/cv/with-prime-minister.jpg", alt: "Dr. Kairav Shah with the Hon. Prime Minister Shri Narendra Modi" },
  { src: "/media/cv/chief-minister-award.jpg", alt: "Receiving an award from the Hon. Chief Minister of Gujarat" },
  { src: "/media/cv/medical-excellence-award.jpg", alt: "Bharat Medical Excellence Award" },
  { src: "/media/cv/blessing.jpg", alt: "Dr. Kairav Shah receiving a blessing" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="border-b border-line pb-2 text-lg font-semibold text-navy">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function DoctorCv() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Resume</p>
        <h2 className="mt-1 text-2xl font-semibold text-navy">Dr. Kairav Shah</h2>
        <p className="mt-1 text-sm text-ink/80">M.S., M.Ch (Neurosurgery). Gold medallist.</p>
        <p className="mt-3 text-sm leading-6 text-ink/80">
          Director, NEUROKALP (Brain and Spine Clinic), 504-5, 5th floor, Mehta 531, Ellisbridge, Ahmedabad, Gujarat.
        </p>
        <p className="mt-1 text-sm text-ink/80">
          Mobile: <a className="font-semibold text-navy" href="tel:+919099110022">+91 90991 10022</a>
        </p>
      </header>

      <Section title="Career objective">
        <p className="text-sm leading-7 text-ink/85">
          To serve humanity by acquiring expertise in neurosurgery, with a special interest in neuro-oncology and spine surgery.
        </p>
      </Section>

      <Section title="Work experience">
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-ink/85">
          <li>Honorary consultant neurosurgeon at V.S. Hospital, Ahmedabad.</li>
          <li>Heading the Department of Neurosurgery at GRMI (Rajasthan Hospital), Ahmedabad, since April 2017, with around 4,000 neurosurgical operations.</li>
          <li>Consultant neurosurgeon at Rajasthan Hospital, Ahmedabad, since 2015.</li>
          <li>Visiting faculty at Roshanlal Jain Hospital, Pali, and Sun City Hospital, Jodhpur.</li>
          <li>Visiting neurosurgeon at Nanavati Hospital, Bhuj; Dr. S.R. Shah Hospital, Nadiad; Siddhivinayak Hospital, Bhilwara; S.G.V.P. Hospital, Ahmedabad; and Sterling Hospital, Ahmedabad.</li>
          <li>Senior resident, Department of Neurosurgery, Goa Medical College, 18 July 2012 to 17 July 2015.</li>
          <li>Full-time resident, postgraduate medical studies and research, B.J. Medical College, Gujarat, 1 May 2008 to 11 October 2011.</li>
          <li>Research fellow in neuro-oncology surgery, Gujarat Cancer Research Institute, Ahmedabad, September 2011 to June 2012.</li>
          <li>Fellowship in microneurosurgery, University Hospital, Helsinki, Finland, 2019.</li>
        </ul>
      </Section>

      <Section title="Experience in neurosurgery">
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-ink/85">
          <li>
            More than 4,000 neurosurgical operations, including gliomas, convexity meningiomas, cerebral metastasis, cervical and lumbar degenerative disease, compressive myelopathy, spontaneous intracerebral hemorrhage, hydrocephalus, pediatric neural tube defects, Chiari malformation, traumatic brain injuries and stereotactic biopsies, aneurysmal rupture, posterior fossa and cerebellopontine-angle tumours, sellar and suprasellar tumours, neuroendoscopy, vascular malformations, trigeminal neuralgia, spinal tumours, complex meningiomas, pediatric brain tumours, and spine instrumentation.
          </li>
          <li>Work with CUSA, neuronavigation, C-arm, the neuroendoscope, a stereotactic biopsy frame, pneumatic drills, and aneurysm clips and applicators.</li>
        </ul>
      </Section>

      <Section title="Education">
        <div className="space-y-3">
          {qualifications.map(([qualification, institution, guide, result]) => (
            <article key={qualification} className="rounded-2xl bg-canvas px-4 py-3">
              <h3 className="text-sm font-semibold text-navy">{qualification}</h3>
              <p className="mt-1 text-sm leading-6 text-ink/80">{institution}</p>
              {guide ? <p className="text-sm leading-6 text-ink/70">Guide: {guide}</p> : null}
              <p className="text-sm leading-6 text-ink/80">{result}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Papers">
        <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-ink/85">
          {posts.map((paper) => (
            <li key={paper.detail + paper.title}>
              {paper.title}. {paper.detail}{" "}
              {paper.href ? (
                <a className="font-semibold text-navy underline" href={paper.href} target="_blank" rel="noreferrer">
                  Read the paper
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Awards and achievements">
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-ink/85">
          <li>DNS TALKS Bharat Medical Excellence Award for advanced neurosurgery, 3 January 2025, presented by the Hon. Chief Minister of Gujarat, Shri Bhupendrabhai Patel.</li>
          <li>Best orator, and second runner-up, Torrent Young Scholar Award for Neurosurgery, 2014, national level.</li>
          <li>Three gold medals for first rank in the Gujarat University M.S. General Surgery examination.</li>
          <li>Gold medal from the B.J. Medical College alumni for best outgoing student in M.S. General Surgery.</li>
          <li>Scholarship from the Shri Dhirubhai Ambani Foundation for first rank in Kheda district in the H.S.C. examination.</li>
          <li>More than 30 district, state, and national awards in public speaking and elocution.</li>
          <li>Awarded by Manav Kalyan Mandal, Rajkot, in 2018 and 2019, for serving humanity.</li>
          <li>Felicitated by the Hon. Prime Minister, Shri Narendra Modi, for gold medals in M.S. General Surgery, 2011.</li>
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <MediaImage key={photo.src} src={photo.src} alt={photo.alt} className="aspect-[5/3] w-full rounded-2xl" />
          ))}
        </div>
      </Section>

      <Section title="Personal profile">
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          {[
            ["Date of birth", "3 February 1985"],
            ["Gender", "Male"],
            ["Blood group", "O positive"],
            ["Marital status", "Married"],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-3 rounded-2xl bg-canvas px-4 py-3">
              <dt className="w-28 shrink-0 text-muted">{label}</dt>
              <dd className="font-medium text-navy">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <p className="text-sm leading-7 text-ink/85">
        Dr. Kairav Shah speaks through podcasts and public programmes about brain and spine health.{" "}
        <a className="font-semibold text-navy underline" href="https://youtu.be/WnaTpgwMrnI" target="_blank" rel="noreferrer">
          Watch a talk on YouTube
        </a>
        .
      </p>
    </div>
  );
}
