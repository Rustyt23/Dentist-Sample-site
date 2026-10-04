"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, CalendarDays, Check, Clock3, MoveHorizontal } from "lucide-react";
import { treatmentCategories, treatments, type TreatmentCategory } from "@/lib/data/treatments";
import { doctors } from "@/lib/data/doctors";
import { cn, unsplash } from "@/lib/utils";
import { TreatmentIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { ExplainerTrigger, type ExplainerKind } from "@/components/explainers/TreatmentExplainer";

type Filter = "All" | TreatmentCategory;

const EXPLAINERS: Partial<Record<string, ExplainerKind>> = {
  "root-canal": "rootCanal",
  "dental-implants": "implant",
};

function DoctorsFor({ slug }: { slug: string }) {
  const team = doctors.filter((d) => d.treatments.includes(slug));
  if (team.length === 0) return null;
  return (
    <span className="flex items-center gap-2.5 text-sm text-navy-500">
      <span className="flex -space-x-2">
        {team.map((d) => (
          <span key={d.slug} className="relative size-8 overflow-hidden rounded-full bg-mist-100 ring-2 ring-white">
            <Image src={unsplash(d.image, 100)} alt="" fill sizes="32px" className="object-cover object-top" />
          </span>
        ))}
      </span>
      <span>
        Led by{" "}
        <span className="font-medium text-navy-700">
          {team.length > 2 ? "all our dentists" : team.map((d) => d.shortName).join(" & ")}
        </span>
      </span>
    </span>
  );
}

export function TreatmentsExplorer() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filter === "All" ? treatments : treatments.filter((t) => t.category === filter);
  const filters: Filter[] = ["All", ...treatmentCategories];

  return (
    <div>
      <div
        role="group"
        aria-label="Filter treatments by category"
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {filters.map((f) => {
          const count = f === "All" ? treatments.length : treatments.filter((t) => t.category === f).length;
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300",
                active
                  ? "bg-navy-900 text-white shadow-soft"
                  : "bg-white text-navy-600 ring-1 ring-navy-100 hover:text-navy-900 hover:ring-navy-200",
              )}
            >
              {f}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.7rem] leading-none",
                  active ? "bg-white/15 text-white" : "bg-mist-100 text-navy-500",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {visible.map((t) => (
          <article
            key={t.slug}
            id={t.slug}
            className="group flex scroll-mt-28 flex-col rounded-[1.75rem] bg-white p-7 ring-1 ring-navy-100 transition duration-300 hover:shadow-lift hover:ring-brand-200 sm:p-8"
          >
            <div className="flex items-start gap-5">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-brand-50 to-mist-100 text-brand-600 ring-1 ring-brand-100 transition-colors duration-300 group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white">
                <TreatmentIcon icon={t.icon} size={26} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold tracking-wide text-brand-600 uppercase">{t.category}</span>
                  <span className="rounded-full bg-mist-100 px-2 py-0.5 text-[0.7rem] font-semibold text-navy-600">
                    {t.tag}
                  </span>
                </span>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">{t.name}</h2>
              </div>
              <div className="hidden text-right sm:block">
                <span className="block text-xs text-navy-400">
                  {t.price.startsWith("₹") ? "Starting from" : "Pricing"}
                </span>
                <span className="block text-xl font-semibold tracking-tight text-navy-900">{t.price}</span>
              </div>
            </div>

            <p className="mt-6 text-[0.98rem] leading-relaxed text-navy-500">{t.description}</p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {t.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-navy-700">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-7">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl bg-mist-50 px-5 py-4 text-sm">
                <span className="flex items-center gap-2 text-navy-600">
                  <Clock3 className="size-4 text-brand-600" aria-hidden />
                  {t.duration}
                </span>
                <span className="flex items-center gap-2 text-navy-600">
                  <CalendarDays className="size-4 text-brand-600" aria-hidden />
                  {t.visits}
                </span>
                <span className="font-semibold text-navy-900 sm:hidden">
                  {t.price.startsWith("₹") ? `From ${t.price}` : t.price}
                </span>
                {t.priceNote ? <span className="text-navy-400 sm:ml-auto">{t.priceNote}</span> : null}
              </div>
              <div className="mt-5 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <ButtonLink href={`/book?treatment=${t.slug}`} size="sm" className="w-full sm:w-auto">
                    Book {t.name.toLowerCase().startsWith("dental") ? "a visit" : "this treatment"}
                    <ArrowRight className="size-4" aria-hidden />
                  </ButtonLink>
                  {EXPLAINERS[t.slug] ? (
                    <ExplainerTrigger kind={EXPLAINERS[t.slug]!} className="justify-center sm:justify-start" />
                  ) : null}
                  {t.slug === "braces-aligners" ? (
                    <a
                      href="#teeth-alignment"
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-sm font-semibold text-navy-900 ring-1 ring-navy-200 transition hover:ring-brand-300 sm:justify-start"
                    >
                      <span className="grid size-7 place-items-center rounded-full bg-brand-600 text-white">
                        <MoveHorizontal className="size-4" aria-hidden />
                      </span>
                      See how teeth move
                    </a>
                  ) : null}
                </span>
                <DoctorsFor slug={t.slug} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
