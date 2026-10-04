"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { transformations } from "@/lib/data/content";
import { getDoctor } from "@/lib/data/doctors";
import { cn, unsplash } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

export function SmileTransformations() {
  const [active, setActive] = useState(0);
  const current = transformations[active];
  const doctor = getDoctor(current.doctor);

  return (
    <section id="results" className="px-2 sm:px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-navy-950 py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -top-40 -right-20 size-[30rem] rounded-full bg-brand-500/15 blur-3xl" aria-hidden />
        <Container className="relative max-w-6xl">
          <SectionHeading tone="light" eyebrow="Smile transformations" title={<>Real change you can <Accent tone="light">see.</Accent></>} description="One smile at a time. Slide to explore the difference." />
          <Reveal className="mt-10">
            <div role="group" aria-label="Choose a smile transformation" className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2 sm:gap-x-10">
              {transformations.map((transformation, i) => (
                <button key={transformation.title} type="button" aria-pressed={i === active} onClick={() => setActive(i)} className={cn("border-b py-3 text-sm font-medium transition-colors", i === active ? "border-brand-300 text-brand-300" : "border-transparent text-navy-300 hover:text-white")}>
                  {transformation.title}
                </button>
              ))}
            </div>
            <BeforeAfterSlider key={current.image} src={unsplash(current.image, 1600)} alt={current.alt} beforeFilter={current.beforeFilter} className="aspect-[4/3] w-full sm:aspect-[16/9]" />
            <div key={`meta-${active}`} className="animate-step-in mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-white">{current.title}</h3>
                <p className="mt-1 text-sm text-navy-200">{current.treatment} · {current.duration}</p>
                <p className="mt-2 text-sm text-navy-300">{current.concern}</p>
              </div>
              <div className="sm:text-right">
                {doctor ? <p className="text-sm text-navy-200">Treated by <span className="font-semibold text-white">{doctor.name}</span></p> : null}
                <Link href="/book?treatment=smile-makeover" className="mt-3 inline-flex items-center gap-2 py-1 text-sm font-semibold text-brand-300 transition-colors hover:text-white">
                  Book Appointment <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
            <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-navy-300">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              Illustrative simulations. Individual results vary and are discussed at your consultation.
            </p>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
