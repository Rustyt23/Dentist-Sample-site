import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "./Container";
import { Eyebrow } from "./SectionHeading";

type PageHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  breadcrumb: string;
  children?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, breadcrumb, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-mist-100/80 via-mist-50/50 to-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 right-[-8%] h-[30rem] w-[30rem] rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(10_31_60/0.07)_1px,transparent_0)] [mask-image:linear-gradient(to_bottom,black,transparent_80%)] bg-[size:28px_28px]" />
      </div>
      <Container className="relative pt-10 pb-14 sm:pt-14 sm:pb-20">
        <nav aria-label="Breadcrumb" className="animate-fade-up">
          <ol className="flex items-center gap-1.5 text-sm text-navy-400">
            <li>
              <Link href="/" className="transition-colors hover:text-navy-900">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-navy-700">
              {breadcrumb}
            </li>
          </ol>
        </nav>
        <div className="mt-8 grid items-end gap-10 lg:grid-cols-12">
          <div className="animate-fade-up lg:col-span-7" style={{ animationDelay: "80ms" }}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-5 text-4xl leading-[1.06] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-500">{description}</p>
          </div>
          {children ? (
            <div className="animate-fade-up lg:col-span-5 lg:justify-self-end" style={{ animationDelay: "160ms" }}>
              {children}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
