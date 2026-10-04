import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, GraduationCap } from "lucide-react";
import { doctors, type Doctor } from "@/lib/data/doctors";
import { unsplash } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-mist-100">
        <Image
          src={unsplash(doctor.image, 900)}
          alt={doctor.imageAlt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover object-top transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/60 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-900 shadow-soft backdrop-blur">
          {doctor.experience} experience
        </span>
        <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-1.5">
          {doctor.expertise.slice(0, 2).map((e) => (
            <span
              key={e}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/30 backdrop-blur-md"
            >
              {e}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col px-1 pt-6">
        <p className="text-sm font-semibold text-brand-600">{doctor.role}</p>
        <h3 className="mt-1.5 text-xl font-semibold tracking-tight">{doctor.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-400">
          <GraduationCap className="size-4" aria-hidden />
          {doctor.qualifications}
        </p>
        <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-navy-500">{doctor.bio}</p>
        <div className="mt-5 flex items-center gap-5">
          <Link
            href={`/book?doctor=${doctor.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <CalendarCheck className="size-4" aria-hidden />
            Book with {doctor.shortName}
          </Link>
          <Link
            href={`/doctors#${doctor.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy-700 transition-colors hover:text-brand-600"
          >
            Profile
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function DoctorsSection() {
  return (
    <section id="doctors" className="pb-20 sm:pb-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="Meet our dentists"
            title={
              <>
                Specialists who treat you like <Accent>family.</Accent>
              </>
            }
            description="A small, close-knit team of MDS specialists — so you see the same familiar faces every visit."
          />
          <Reveal className="shrink-0">
            <ButtonLink href="/doctors" variant="secondary">
              Meet the full team
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {doctors.map((d, i) => (
            <Reveal
              key={d.slug}
              delay={i * 100}
              className={i === 2 ? "sm:col-span-2 sm:mx-auto sm:max-w-[50%] lg:col-span-1 lg:max-w-none" : undefined}
            >
              <DoctorCard doctor={d} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
