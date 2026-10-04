import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gallery } from "@/lib/data/content";
import { cn, unsplash } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

// Hand-picked mix: lounge, treatment suite, equipment, waiting area, interiors
const picks = [0, 1, 2, 3, 10];

const layout = [
  "col-span-2 aspect-[4/3] sm:row-span-2 sm:aspect-auto",
  "aspect-[4/5] sm:aspect-auto",
  "aspect-[4/5] sm:aspect-auto",
  "aspect-[4/5] sm:aspect-auto",
  "aspect-[4/5] sm:aspect-auto",
];

export function GalleryPreview() {
  const items = picks.map((i) => gallery[i]);

  return (
    <section id="gallery" className="px-2 sm:px-4">
      <div className="rounded-[2.5rem] bg-mist-50 py-20 ring-1 ring-mist-100 sm:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              align="left"
              eyebrow="Inside SmileCare"
              title={
                <>
                  A calm space designed for <Accent>your comfort.</Accent>
                </>
              }
              description="Natural light, soft materials and spotless treatment suites — a clinic that feels nothing like a hospital."
            />
            <Reveal className="shrink-0">
              <ButtonLink href="/gallery" variant="secondary">
                Explore the gallery
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <div className="grid grid-cols-2 gap-3 sm:h-[34rem] sm:grid-cols-4 sm:grid-rows-2 sm:gap-4">
              {items.map((img, i) => (
                <Link
                  key={img.id}
                  href="/gallery"
                  className={cn("group relative overflow-hidden rounded-3xl bg-mist-200", layout[i])}
                >
                  <Image
                    src={unsplash(img.id, i === 0 ? 1400 : 800)}
                    alt={img.alt}
                    fill
                    sizes={i === 0 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 50vw"}
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-navy-950/55 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-900 backdrop-blur sm:bottom-4 sm:left-4">
                    {img.caption}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
