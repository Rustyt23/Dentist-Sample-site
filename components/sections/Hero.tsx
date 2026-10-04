import Image from "next/image";
import { CalendarCheck, CheckCircle2, Phone, ShieldCheck, Star } from "lucide-react";
import { clinic } from "@/lib/data/clinic";
import { doctors } from "@/lib/data/doctors";
import { unsplash } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Accent } from "@/components/ui/SectionHeading";

const assurances = ["Sterilised, single-use kits", "Written estimates upfront", "Open 6 days a week"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-mist-100/70 via-mist-50/40 to-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-mist-200/70 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(10_31_60/0.07)_1px,transparent_0)] [mask-image:linear-gradient(to_bottom,black,transparent_70%)] bg-[size:28px_28px]" />
      </div>

      <Container className="relative grid items-center gap-14 pt-8 pb-16 sm:pt-12 lg:grid-cols-12 lg:gap-10 lg:pt-16 lg:pb-24">
        <div className="lg:col-span-6">
          <div className="animate-fade-up inline-flex items-center gap-3 rounded-full bg-white/80 py-1.5 pr-4 pl-1.5 shadow-soft ring-1 ring-navy-100 backdrop-blur">
            <span className="flex -space-x-2">
              {doctors.map((d) => (
                <span key={d.slug} className="relative size-7 overflow-hidden rounded-full ring-2 ring-white">
                  <Image src={unsplash(d.image, 120)} alt="" fill sizes="28px" className="object-cover object-top" />
                </span>
              ))}
            </span>
            <span className="flex items-center gap-1.5 text-[0.8rem] font-medium text-navy-700">
              <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
              <strong className="font-semibold text-navy-900">4.9</strong> from 2,400+ patients
            </span>
          </div>

          <h1
            className="animate-fade-up mt-7 text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.03em] text-navy-900 sm:text-6xl lg:text-[4.1rem] xl:text-[4.5rem]"
            style={{ animationDelay: "80ms" }}
          >
            Healthy smiles start with <Accent>care you can trust.</Accent>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-navy-500"
            style={{ animationDelay: "160ms" }}
          >
            From routine check-ups to implants and clear aligners, our specialist dentists pair modern technology with a
            calm, pain-aware approach — so every visit feels easy.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "240ms" }}
          >
            <ButtonLink href="/book" size="lg">
              <CalendarCheck className="size-5" aria-hidden />
              Book Appointment
            </ButtonLink>
            <ButtonLink href={clinic.phoneHref} variant="secondary" size="lg">
              <Phone className="size-5 text-brand-600" aria-hidden />
              Call Now
            </ButtonLink>
          </div>

          <ul
            className="animate-fade-up mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-600"
            style={{ animationDelay: "320ms" }}
          >
            {assurances.map((a) => (
              <li key={a} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-500" aria-hidden />
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-up relative lg:col-span-6" style={{ animationDelay: "200ms" }}>
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-[2.5rem] bg-linear-to-br from-brand-200/70 via-white to-mist-200/80 sm:-inset-4"
              aria-hidden
            />
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2rem] shadow-lift sm:aspect-[5/4]">
              <Image
                src={unsplash("1777331903190-341a3dd0441b", 1600)}
                alt="SmileCare dentist chatting with a relaxed patient in a bright, modern treatment room"
                fill
                preload
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy-950/25 via-transparent to-transparent" />
            </div>

            {/* Floating trust cards */}
            <div className="animate-float absolute top-5 -right-1 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-4 shadow-lift ring-1 ring-navy-100 backdrop-blur sm:top-8 sm:-right-6">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <ShieldCheck className="size-5" aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold text-navy-900">Hospital-grade hygiene</span>
                <span className="text-xs text-navy-500">Class B autoclave sterilisation</span>
              </span>
            </div>

            <div className="animate-float-delayed absolute -bottom-6 left-3 rounded-2xl bg-white/95 p-4 shadow-lift ring-1 ring-navy-100 backdrop-blur sm:-bottom-8 sm:-left-8 sm:p-5">
              <p className="text-xs font-medium tracking-wide text-navy-500 uppercase">Next available</p>
              <p className="mt-1 flex items-center gap-2 text-base font-semibold text-navy-900">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-brand-500" />
                </span>
                Tomorrow · 10:30 AM
              </p>
              <p className="mt-1 text-xs text-navy-500">Same-week appointments available</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
