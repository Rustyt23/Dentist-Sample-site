import Image from "next/image";
import { CalendarCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { clinic } from "@/lib/data/clinic";
import { unsplash } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, Eyebrow } from "@/components/ui/SectionHeading";

const perks = ["Same-week appointments", "Written estimates upfront", "No-cost EMI available"];

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-navy-900 via-navy-800 to-brand-800">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute -top-24 -left-24 size-96 rounded-full bg-brand-400/20 blur-3xl" />
              <div className="absolute right-[38%] -bottom-32 size-80 rounded-full border border-white/10" />
              <div className="absolute right-[34%] -bottom-48 size-[28rem] rounded-full border border-white/5" />
            </div>

            <div className="relative grid items-center lg:grid-cols-2">
              <div className="px-7 py-14 sm:px-12 sm:py-16 lg:py-20 lg:pr-4 lg:pl-16">
                <Eyebrow tone="light">Book your visit</Eyebrow>
                <h2 className="mt-5 text-3xl leading-[1.1] font-semibold tracking-tight text-white sm:text-5xl">
                  Ready for a healthier, <Accent tone="light">more confident</Accent> smile?
                </h2>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-navy-200">
                  Book a consultation in under a minute. We&apos;ll confirm your slot by call or WhatsApp and answer any
                  questions before you arrive.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/book" size="lg" variant="light">
                    <CalendarCheck className="size-5 text-brand-600" aria-hidden />
                    Book Appointment
                  </ButtonLink>
                  <ButtonLink href={clinic.whatsappHref} external size="lg" variant="outline-light">
                    <MessageCircle className="size-5" aria-hidden />
                    Chat on WhatsApp
                  </ButtonLink>
                </div>
                <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-200">
                  {perks.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-brand-300" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative hidden h-full min-h-[28rem] lg:block">
                <Image
                  src={unsplash("1617812191081-2a24e3f30e45", 1200)}
                  alt="Woman with a bright, confident smile"
                  fill
                  sizes="45vw"
                  className="object-cover [mask-image:linear-gradient(to_right,transparent,black_28%)]"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
