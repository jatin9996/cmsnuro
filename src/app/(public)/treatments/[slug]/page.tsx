import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@/components/public/rich-text";
import { Container, MediaImage, MedicalNote, PageHero, btnOnDark } from "@/components/public/ui";
import { getCondition } from "@/lib/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const condition = await getCondition(slug);
  return { title: condition?.title ?? "Treatment", description: condition?.summary };
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const condition = await getCondition(slug);
  if (!condition) notFound();

  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <PageHero eyebrow="Treatment" title={condition.title} description={condition.summary} crumbs={[{ href: "/", label: "Home" }, { href: "/treatments", label: "Treatments" }, { href: `/treatments/${condition.slug}`, label: condition.title }]} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="space-y-6 rounded-3xl bg-white p-4 ring-1 ring-navy/5 sm:rounded-[28px] sm:p-8">
          {condition.image ? <MediaImage src={condition.image} alt="" className="h-64 w-full rounded-3xl" /> : null}
          <RichText text={condition.description} />
          {condition.symptoms ? (
            <section>
              <h2 className="text-xl font-semibold text-navy">When people seek care</h2>
              <div className="mt-3"><RichText text={condition.symptoms} /></div>
            </section>
          ) : null}
          {condition.treatment ? (
            <section>
              <h2 className="text-xl font-semibold text-navy">How a plan is made</h2>
              <div className="mt-3"><RichText text={condition.treatment} /></div>
            </section>
          ) : null}
          <MedicalNote />
        </article>
        <aside className="h-fit rounded-[28px] bg-navy p-6 text-white">
          <h2 className="text-xl font-semibold">Talk to the clinic</h2>
          <p className="mt-2 text-sm leading-6 text-white/75">A consultation is the right place to interpret scans and decide whether surgery, medicine, or observation fits.</p>
          <Link href={`/book?concern=${encodeURIComponent(condition.title)}`} className={`${btnOnDark} mt-5 h-auto w-full whitespace-normal text-center leading-5`}>
            Book for {condition.title}
          </Link>
        </aside>
      </div>
    </Container>
  );
}
