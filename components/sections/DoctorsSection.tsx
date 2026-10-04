import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { doctors, type Doctor } from "@/lib/data/doctors";
import { unsplash } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist-100">
        <Image src={unsplash(doctor.image, 900)} alt={doctor.imageAlt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover object-top transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="pt-5">
        <h3 className="text-lg font-semibold tracking-tight">{doctor.name}</h3>
        <p className="mt-1 text-sm font-medium text-brand-600">{doctor.role}</p>
        <p className="mt-2 text-sm text-navy-500">{doctor.experience} experience</p>
        <Link href={`/doctors#${doctor.slug}`} className="mt-4 inline-flex items-center gap-2 py-1 text-sm font-semibold text-navy-700 transition-colors hover:text-brand-600">
          View Profile <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export function DoctorsSection() {
  return (
    <section id="doctors">
      <Container>
        <SectionHeading align="left" size="quiet" eyebrow="Meet our dentists" title={<>Specialist care. <Accent>Familiar faces.</Accent></>} />
        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {doctors.map((doctor, i) => (
            <Reveal key={doctor.slug} delay={i * 80} scale className={i === 2 ? "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:w-full" : undefined}>
              <DoctorCard doctor={doctor} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
