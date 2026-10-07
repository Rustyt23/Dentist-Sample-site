import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gallery } from "@/lib/data/content";
import { unsplash } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { ImplantTeaser } from "./ImplantTeaser";

const picks = [0, 1, 2];

export function GalleryPreview() {
  return (
    <section id="gallery">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading align="left" size="quiet" eyebrow="Inside SmileCare" title={<>A little space to <Accent>feel at ease.</Accent></>} />
          <Link href="/gallery" className="inline-flex shrink-0 items-center gap-2 py-2 text-sm font-semibold text-brand-700 transition-colors hover:text-navy-900">
            Explore Gallery <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {picks.map((index, i) => {
            const image = gallery[index];
            return (
              <Reveal key={image.id} delay={i * 80} scale>
                <Link href="/gallery" className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-mist-100">
                    <Image
                      src={unsplash(image.id, 1000)}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1280px) 392px, (min-width: 1024px) calc(33.333vw - 34.667px), (min-width: 640px) calc(33.333vw - 29.333px), calc(100vw - 32px)"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-sm text-navy-500">{image.caption}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-10">
          <ImplantTeaser />
        </div>
      </Container>
    </section>
  );
}
