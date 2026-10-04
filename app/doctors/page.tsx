import type { Metadata } from "next";
import Image from "next/image";
import { CalendarCheck, CalendarDays, GraduationCap, Languages } from "lucide-react";
import { doctors, formatWorkDays, WEEKDAY_INITIALS } from "@/lib/data/doctors";
import { getTreatment } from "@/lib/data/treatments";
import { cn, unsplash } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Accent } from "@/components/ui/SectionHeading";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Our Dentists",
  description:
    "Meet the SmileCare team — MDS specialists in implantology, orthodontics and pediatric dentistry, dedicated to gentle, honest care.",
};

export default function DoctorsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Doctors"
        eyebrow="Our dentists"
        title={
          <>
            Specialist expertise, <Accent>a familiar face.</Accent>
          </>
        }
        description="Each member of our team is a postgraduate specialist in their field. You'll always know who is treating you — and why."
      >
        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 pr-7 shadow-soft ring-1 ring-navy-100">
          <span className="flex -space-x-3">
            {doctors.map((d) => (
              <span key={d.slug} className="relative size-12 overflow-hidden rounded-full ring-4 ring-white">
                <Image src={unsplash(d.image, 160)} alt="" fill sizes="48px" className="object-cover object-top" />
              </span>
            ))}
          </span>
          <span>
            <span className="block text-2xl font-semibold tracking-tight text-navy-900">32+ years</span>
            <span className="text-sm text-navy-500">of combined specialist experience</span>
          </span>
        </div>
      </PageHeader>

      <section className="pt-4 pb-20 sm:pb-28">
        <Container className="space-y-8 sm:space-y-10">
          {doctors.map((d, i) => (
            <Reveal key={d.slug}>
              <article
                id={d.slug}
                className="grid scroll-mt-28 overflow-hidden rounded-[2rem] bg-white ring-1 ring-navy-100 lg:grid-cols-12"
              >
                <div
                  className={cn(
                    "relative aspect-[4/4.2] sm:aspect-[16/11] lg:col-span-5 lg:aspect-auto lg:min-h-[34rem]",
                    i % 2 === 1 && "lg:order-2",
                  )}
                >
                  <Image
                    src={unsplash(d.image, 1100)}
                    alt={d.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover object-top"
                  />
                  <span className="absolute top-5 left-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-900 shadow-soft backdrop-blur">
                    {d.experience} experience
                  </span>
                  <div className="absolute inset-x-5 bottom-5 grid grid-cols-2 gap-2.5">
                    {d.stats.map((s) => (
                      <div key={s.label} className="rounded-2xl bg-white/90 px-4 py-3 shadow-soft backdrop-blur">
                        <p className="text-xl font-semibold tracking-tight text-navy-900">{s.value}</p>
                        <p className="text-xs text-navy-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col p-7 sm:p-10 lg:col-span-7 lg:p-12">
                  <p className="text-sm font-semibold text-brand-600">{d.role}</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{d.name}</h2>
                  <p className="mt-2 text-navy-400">{d.qualifications}</p>

                  <p className="mt-6 text-[1.02rem] leading-relaxed text-navy-600">{d.longBio}</p>

                  <blockquote className="mt-6 border-l-2 border-brand-300 pl-5 font-serif text-xl leading-snug text-navy-800 italic">
                    “{d.quote}”
                  </blockquote>

                  <div className="mt-7">
                    <p className="text-xs font-semibold tracking-wide text-navy-400 uppercase">Areas of expertise</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {d.expertise.map((e) => (
                        <li
                          key={e}
                          className="rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-100"
                        >
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <dl className="mt-8 grid gap-5 border-t border-navy-100 pt-7 sm:grid-cols-3">
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-navy-400 uppercase">
                        <GraduationCap className="size-4 text-brand-600" aria-hidden /> Education
                      </dt>
                      <dd className="mt-2 space-y-1 text-sm text-navy-700">
                        {d.education.map((e) => (
                          <span key={e} className="block">
                            {e}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-navy-400 uppercase">
                        <Languages className="size-4 text-brand-600" aria-hidden /> Languages
                      </dt>
                      <dd className="mt-2 text-sm text-navy-700">{d.languages.join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-navy-400 uppercase">
                        <CalendarDays className="size-4 text-brand-600" aria-hidden /> Available
                      </dt>
                      <dd className="mt-2">
                        <span className="text-sm text-navy-700">{formatWorkDays(d.workDays)}</span>
                        <span className="mt-2 flex gap-1" aria-hidden>
                          {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                            <span
                              key={day}
                              className={cn(
                                "grid size-5 place-items-center rounded-md text-[0.6rem] font-semibold",
                                d.workDays.includes(day) ? "bg-navy-900 text-white" : "bg-mist-100 text-navy-300",
                              )}
                            >
                              {WEEKDAY_INITIALS[day]}
                            </span>
                          ))}
                        </span>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-auto flex flex-col gap-3 pt-9 sm:flex-row sm:items-center">
                    <ButtonLink href={`/book?doctor=${d.slug}`} className="w-full sm:w-auto">
                      <CalendarCheck className="size-4" aria-hidden />
                      Book with {d.shortName}
                    </ButtonLink>
                    <p className="text-center text-sm text-navy-400 sm:text-left">
                      Treats:{" "}
                      {d.treatments
                        .slice(0, 3)
                        .map((slug) => getTreatment(slug)?.name)
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
          <p className="text-center text-xs text-navy-400">Doctor profiles shown are sample content.</p>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
