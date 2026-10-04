import Image from "next/image";
import { Armchair, Cpu, ShieldPlus, Stethoscope, Wallet } from "lucide-react";
import { clinic } from "@/lib/data/clinic";
import { unsplash } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  {
    icon: Cpu,
    title: "Modern technology",
    text: "3D intraoral scans, low-radiation digital X-rays and CBCT-guided implant planning — so you can see exactly what we see.",
  },
  {
    icon: Stethoscope,
    title: "Experienced doctors",
    text: "Every treatment is led by an MDS specialist in that field, not handed off to a generalist.",
  },
  {
    icon: Armchair,
    title: "Comfortable treatment",
    text: "Gentle numbing, noise-cancelling headphones and calm, unhurried appointments designed for nervous patients.",
  },
  {
    icon: Wallet,
    title: "Transparent pricing",
    text: "Clear starting prices, written estimates before treatment and no-cost EMI options on larger plans.",
  },
  {
    icon: ShieldPlus,
    title: "Hygiene standards",
    text: "Four-step sterilisation protocol with Class B autoclaves, sealed pouches and single-use disposables.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative mr-8 aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift sm:mr-16">
              <Image
                src={unsplash("1606811841689-23dfddce3e95", 1200)}
                alt="Dentist explaining a digital scan on screen to a patient"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 bottom-10 w-[46%] overflow-hidden rounded-3xl border-[6px] border-white shadow-lift">
              <div className="relative aspect-square">
                <Image
                  src={unsplash("1631051103633-24959376b92d", 700)}
                  alt="Smiling patient relaxing in a dental chair"
                  fill
                  sizes="(min-width: 1024px) 20vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute top-8 -left-2 rounded-2xl bg-navy-900 px-5 py-4 text-white shadow-lift sm:-left-6">
              <p className="text-3xl font-semibold tracking-tight">98%</p>
              <p className="mt-1 max-w-[9rem] text-xs leading-snug text-navy-200">
                of patients would recommend us to family
              </p>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="Why choose us"
              title={
                <>
                  Dentistry that feels <Accent>different</Accent> — in all the right ways.
                </>
              }
              description="We built SmileCare around the things patients told us mattered most: honesty, comfort and genuinely excellent clinical work."
            />
            <ul className="mt-10 space-y-2">
              {reasons.map(({ icon: Icon, title, text }, i) => (
                <li key={title}>
                  <Reveal
                    delay={i * 70}
                    className="group flex gap-5 rounded-2xl p-4 transition-colors duration-300 hover:bg-mist-50 sm:-mx-4"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft ring-1 ring-navy-100 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[1.05rem] font-semibold tracking-tight text-navy-900">{title}</span>
                      <span className="mt-1 block text-[0.95rem] leading-relaxed text-navy-500">{text}</span>
                    </span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Reveal className="mt-20">
          <dl className="grid grid-cols-2 gap-y-10 rounded-[2rem] bg-linear-to-br from-navy-900 to-navy-800 px-6 py-10 text-center sm:px-10 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
            {clinic.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-2">
                <dt className="text-sm text-navy-300">{s.label}</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
