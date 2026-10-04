"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { transformations } from "@/lib/data/content";
import { getDoctor } from "@/lib/data/doctors";
import { cn, unsplash } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
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
      <div className="relative overflow-hidden rounded-[2.5rem] bg-navy-950 py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-40 -right-20 h-[30rem] w-[30rem] rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-[26rem] w-[26rem] rounded-full bg-mist-300/10 blur-3xl" />
        </div>

        <Container className="relative">
          <SectionHeading
            tone="light"
            eyebrow="Smile transformations"
            title={
              <>
                Real change you can <Accent tone="light">see.</Accent>
              </>
            }
            description="Slide to compare. Every plan begins with a digital preview, so you know what to expect before treatment starts."
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-8">
              <BeforeAfterSlider
                key={current.image}
                src={unsplash(current.image, 1600)}
                alt={current.alt}
                beforeFilter={current.beforeFilter}
                className="aspect-[4/3] w-full sm:aspect-[16/10]"
              />
              <div
                key={`meta-${active}`}
                className="animate-step-in mt-4 flex flex-col gap-4 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm text-navy-200">
                  <span className="font-semibold text-white">Concern: </span>
                  {current.concern}
                </p>
                {doctor ? (
                  <span className="flex shrink-0 items-center gap-2.5 text-sm text-navy-200">
                    <span className="relative size-8 overflow-hidden rounded-full ring-2 ring-white/20">
                      <Image
                        src={unsplash(doctor.image, 100)}
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover object-top"
                      />
                    </span>
                    Treated by <span className="font-semibold text-white">{doctor.name}</span>
                  </span>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={120} className="flex flex-col gap-3 lg:col-span-4">
              <div role="group" aria-label="Choose a smile transformation" className="flex flex-col gap-3">
                {transformations.map((t, i) => (
                  <button
                    key={t.title}
                    type="button"
                    aria-pressed={i === active}
                    onClick={() => setActive(i)}
                    className={cn(
                      "group rounded-2xl p-5 text-left ring-1 transition duration-300",
                      i === active
                        ? "bg-white text-navy-900 ring-white"
                        : "bg-white/[0.04] text-white ring-white/10 hover:bg-white/[0.08]",
                    )}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span
                        className={cn(
                          "text-xs font-semibold tracking-wide uppercase",
                          i === active ? "text-brand-600" : "text-brand-300",
                        )}
                      >
                        Case 0{i + 1}
                      </span>
                      <ArrowRight
                        className={cn(
                          "size-4 transition-transform",
                          i === active ? "translate-x-0 text-brand-600" : "-translate-x-1 text-white/40",
                        )}
                        aria-hidden
                      />
                    </span>
                    <span className="mt-2 block text-lg font-semibold tracking-tight">{t.title}</span>
                    <span className={cn("mt-1 block text-sm", i === active ? "text-navy-500" : "text-navy-300")}>
                      {t.treatment} · {t.duration}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-2 flex gap-2 text-xs leading-relaxed text-navy-300">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Illustrative simulations. Individual results vary and are discussed at your consultation.
              </p>

              <ButtonLink
                href="/book?treatment=smile-makeover"
                variant="light"
                className="mt-auto w-full sm:w-fit lg:w-full"
              >
                Plan my smile makeover
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
