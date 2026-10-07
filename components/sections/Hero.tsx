import Image from "next/image";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { clinic } from "@/lib/data/clinic";
import { unsplash } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Accent, Eyebrow } from "@/components/ui/SectionHeading";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-mist-100/70 via-mist-50/40 to-white">
      <div className="pointer-events-none absolute -top-32 right-[-10%] size-[36rem] rounded-full bg-brand-100/50 blur-3xl" aria-hidden />
      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-6">
          <div className="hero-enter animate-fade-up">
            <Eyebrow>SmileCare · Indiranagar</Eyebrow>
          </div>
          <h1
            className="hero-enter animate-fade-up mt-6 text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-6xl lg:text-[4.1rem] xl:text-[4.5rem]"
            style={{ animationDelay: "80ms" }}
          >
            Healthy smiles start with <Accent>care you can trust.</Accent>
          </h1>
          <p className="hero-enter animate-fade-up mt-6 max-w-md text-lg leading-relaxed text-navy-500" style={{ animationDelay: "160ms" }}>
            Gentle, modern dentistry for your whole family. Specialist care in a calm, welcoming space.
          </p>
          <div className="hero-enter animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "240ms" }}>
            <ButtonLink href="/book" size="lg">
              <CalendarCheck className="size-5" aria-hidden />
              Book Appointment
            </ButtonLink>
            <ButtonLink href={clinic.whatsappHref} external variant="secondary" size="lg">
              <MessageCircle className="size-5 text-brand-600" aria-hidden />
              WhatsApp
            </ButtonLink>
          </div>
        </div>
        <div className="hero-enter animate-fade-up relative lg:col-span-6" style={{ animationDelay: "200ms" }}>
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-soft lg:aspect-[4/4.2]">
            <Image
              src={unsplash("1777331903190-341a3dd0441b", 1600)}
              alt="SmileCare dentist chatting with a relaxed patient in a bright, modern treatment room"
              fill
              preload
              sizes="(min-width: 1280px) 576px, (min-width: 1024px) calc(50vw - 64px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
