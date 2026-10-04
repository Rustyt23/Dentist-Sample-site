import { Award, HeartHandshake, Microscope, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  {
    icon: Award,
    title: "Experienced Dentists",
    text: "MDS specialists averaging 10+ years in implants, orthodontics and family care.",
    metric: "10+ yrs average experience",
  },
  {
    icon: Microscope,
    title: "Modern Equipment",
    text: "Digital X-rays, 3D intraoral scanning and rotary endodontics for precise care.",
    metric: "Up to 90% less X-ray radiation",
  },
  {
    icon: ShieldCheck,
    title: "Hygiene & Sterilization",
    text: "Class B autoclaves, sealed instrument pouches and single-use disposables.",
    metric: "100% sealed, sterile instruments",
  },
  {
    icon: HeartHandshake,
    title: "Patient-Focused Care",
    text: "Unhurried consultations, clear options and treatment at a pace you're comfortable with.",
    metric: "4.9★ average patient rating",
  },
];

export function TrustSection() {
  return (
    <section aria-label="Why patients trust SmileCare" className="relative pt-6 pb-16 sm:pb-20">
      <Container>
        <div className="grid gap-px overflow-hidden rounded-[2rem] bg-navy-100 shadow-soft ring-1 ring-navy-100 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, text, metric }, i) => (
            <div key={title} className="group bg-white p-7 sm:p-8">
              <Reveal delay={i * 90}>
                <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-brand-50 to-mist-100 text-brand-600 ring-1 ring-brand-100 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-4deg]">
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-navy-500">{text}</p>
                <p className="mt-4 flex items-start gap-2 text-sm font-semibold text-brand-700">
                  <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                  {metric}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
