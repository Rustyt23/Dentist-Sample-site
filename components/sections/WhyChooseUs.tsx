import { Armchair, Cpu, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  { icon: Cpu, title: "Advanced Technology", text: "Digital scans and precise planning for care you can understand." },
  { icon: Armchair, title: "Gentle Patient Care", text: "Unhurried appointments and a reassuring approach, at your pace." },
  { icon: Wallet, title: "Transparent Pricing", text: "Clear options and a written estimate before treatment begins." },
];

export function WhyChooseUs() {
  return (
    <section id="why-us">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <SectionHeading align="left" size="quiet" className="lg:col-span-4" eyebrow="Why choose us" title={<>Thoughtful care, <Accent>at every step.</Accent></>} />
          <ul className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {reasons.map(({ icon: Icon, title, text }, i) => (
              <li key={title}>
                <Reveal delay={i * 70}>
                  <Icon className="size-6 text-brand-600" strokeWidth={1.5} aria-hidden />
                  <h3 className="mt-5 text-base font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">{text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
