import { Phone, Siren } from "lucide-react";
import { clinic } from "@/lib/data/clinic";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const symptoms = ["Severe toothache", "Swelling", "Broken or knocked-out tooth", "Bleeding gums"];

/** Full-width emergency banner for page sections. */
export function EmergencyBanner({ className, compact = false }: { className?: string; compact?: boolean }) {
  if (compact) {
    return (
      <div className={className}>
        <Container>
          <Reveal className="flex flex-col gap-4 rounded-2xl bg-brand-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-lg font-semibold tracking-tight text-navy-900">Dental Emergency?</p>
            <a href={clinic.emergencyPhoneHref} className="inline-flex items-center gap-2 py-1 text-sm font-semibold text-brand-700 transition-colors hover:text-navy-900">
              <Phone className="size-4" aria-hidden />
              Call Now <span className="font-normal">· {clinic.emergencyPhone}</span>
            </a>
          </Reveal>
        </Container>
      </div>
    );
  }
  return (
    <section aria-label="Dental emergencies" className={cn("py-6", className)}>
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-red-100 sm:p-8">
            <div
              className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full bg-red-100/60 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-5">
                <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
                  <span
                    className="absolute inset-0 animate-ping rounded-2xl bg-red-200/40 [animation-duration:2.4s]"
                    aria-hidden
                  />
                  <Siren className="relative size-6" aria-hidden />
                </span>
                <div>
                  <p className="text-xl font-semibold tracking-tight text-navy-900 sm:text-2xl">
                    Dental emergency? <span className="text-red-600">We&apos;ll see you today.</span>
                  </p>
                  <p className="mt-1.5 text-[0.95rem] text-navy-500">
                    Same-day emergency slots, 7 days a week — including Sundays.
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {symptoms.map((s) => (
                      <li
                        key={s}
                        className="rounded-full bg-mist-50 px-3 py-1 text-xs font-medium text-navy-600 ring-1 ring-navy-100"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <a
                href={clinic.emergencyPhoneHref}
                className="inline-flex h-14 shrink-0 items-center justify-center gap-2.5 rounded-full bg-red-600 px-7 font-semibold text-white shadow-[0_12px_28px_-10px_rgb(220_38_38/0.55)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-700"
              >
                <Phone className="size-5" aria-hidden />
                Call Now · {clinic.emergencyPhone}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/** Compact, inline emergency link for hero areas, menus and sidebars. */
export function EmergencyLink({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <a
      href={clinic.emergencyPhoneHref}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-sm font-medium transition",
        tone === "dark"
          ? "bg-red-50 text-navy-700 ring-1 ring-red-100 hover:bg-red-100/70"
          : "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15",
        className,
      )}
    >
      <span className="relative grid size-7 place-items-center rounded-full bg-red-600 text-white">
        <span
          className="absolute inset-0 animate-ping rounded-full bg-red-500/50 [animation-duration:2.4s]"
          aria-hidden
        />
        <Phone className="relative size-3.5" aria-hidden />
      </span>
      Dental emergency?
      <span className={cn("font-semibold", tone === "dark" ? "text-red-600" : "text-red-200")}>Call Now</span>
    </a>
  );
}
