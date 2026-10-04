import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { treatments, type Treatment } from "@/lib/data/treatments";
import { unsplash } from "@/lib/utils";
import { TreatmentIcon } from "@/components/icons";
import { ExplainerTrigger, type ExplainerKind } from "@/components/explainers/TreatmentExplainer";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

const EXPLAINERS: Partial<Record<string, ExplainerKind>> = {
  "root-canal": "rootCanal",
  "dental-implants": "implant",
};

function CompactCard({ t }: { t: Treatment }) {
  const explainer = EXPLAINERS[t.slug];
  return (
    <div className="group relative flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-navy-100 transition duration-300 focus-within:ring-brand-300 hover:-translate-y-1 hover:shadow-lift hover:ring-brand-200">
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
          <TreatmentIcon icon={t.icon} />
        </span>
        <span className="rounded-full bg-mist-100 px-2.5 py-1 text-[0.7rem] font-semibold text-navy-600 transition-colors group-hover:bg-brand-50 group-hover:text-brand-700">
          {t.tag}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">
        <Link
          href={`/treatments#${t.slug}`}
          className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none"
        >
          {t.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-[0.92rem] leading-relaxed text-navy-500">{t.summary}</p>
      {explainer ? <ExplainerTrigger kind={explainer} className="mt-4 self-start" /> : null}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-navy-100 pt-4 text-sm">
        <span className="whitespace-nowrap text-navy-500">
          {t.price.startsWith("₹") ? "From " : ""}
          <span className="font-semibold text-navy-900">{t.price}</span>
        </span>
        <span className="flex items-center gap-1 text-right text-navy-400">
          {t.duration}
          <ArrowUpRight
            className="size-4 shrink-0 text-navy-300 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600"
            aria-hidden
          />
        </span>
      </div>
    </div>
  );
}

function FeaturedCard({ t }: { t: Treatment }) {
  if (!t.featured) return null;
  const explainer = EXPLAINERS[t.slug];
  return (
    <div className="group relative flex min-h-[19rem] overflow-hidden rounded-3xl bg-navy-900 ring-1 ring-navy-100 sm:min-h-[21rem]">
      <Image
        src={unsplash(t.featured.image, 1400)}
        alt={t.featured.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover opacity-90 transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-navy-950/90 via-navy-950/40 to-navy-950/0" />
      {/* Whole-card link (the title link below is the accessible one) */}
      <Link href={`/treatments#${t.slug}`} aria-hidden tabIndex={-1} className="absolute inset-0" />
      <div className="pointer-events-none relative mt-auto flex w-full flex-col gap-3 p-7 sm:p-8">
        <span className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide text-white ring-1 ring-white/25 backdrop-blur">
            {t.category}
          </span>
          <span className="rounded-full bg-brand-500/90 px-3 py-1 text-xs font-semibold text-white">{t.tag}</span>
        </span>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-md">
            <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
              <Link href={`/treatments#${t.slug}`} className="pointer-events-auto">
                {t.name}
              </Link>
            </h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-white/80">{t.summary}</p>
            {explainer ? <ExplainerTrigger kind={explainer} tone="glass" className="pointer-events-auto mt-4" /> : null}
          </div>
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-900 transition group-hover:bg-brand-50">
            {t.price.startsWith("₹") ? `From ${t.price}` : t.price}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}

export function PopularTreatments() {
  const compact = treatments.filter((t) => !t.featured);
  const featured = treatments.filter((t) => t.featured);

  return (
    <section id="treatments" className="px-2 sm:px-4">
      <div className="rounded-[2.5rem] bg-mist-50 py-20 ring-1 ring-mist-100 sm:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              align="left"
              eyebrow="Popular treatments"
              title={
                <>
                  Complete care for every smile, <Accent>under one roof.</Accent>
                </>
              }
              description="Transparent starting prices on every treatment. Your exact estimate is shared in writing after your consultation — no surprises."
            />
            <Reveal className="shrink-0">
              <ButtonLink href="/treatments" variant="secondary">
                View all treatments
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {compact.map((t, i) => (
              <Reveal key={t.slug} delay={(i % 4) * 70}>
                <CompactCard t={t} />
              </Reveal>
            ))}
            {featured.map((t, i) => (
              <Reveal key={t.slug} delay={i * 90} className="sm:col-span-2">
                <FeaturedCard t={t} />
              </Reveal>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
