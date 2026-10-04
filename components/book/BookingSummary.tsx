import Image from "next/image";
import { CalendarDays, Clock3, Stethoscope, UserRound, Wallet } from "lucide-react";
import { formatDate, formatMinutes, fromDateKey } from "@/lib/booking";
import { getDoctor } from "@/lib/data/doctors";
import { formatPrice, getTreatment, visitLength } from "@/lib/data/treatments";
import { cn, unsplash } from "@/lib/utils";
import { TreatmentIcon } from "@/components/icons";

type BookingSummaryProps = {
  treatment: string | null;
  doctor: string;
  date: string | null;
  time: number | null;
  onEdit?: (step: number) => void;
  className?: string;
  title?: string;
};

function Row({
  icon,
  label,
  value,
  muted,
  onEdit,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  muted?: boolean;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center gap-3.5 py-3.5">
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-mist-100 text-brand-600">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-navy-400">{label}</p>
        <p className={cn("truncate text-[0.95rem] font-semibold", muted ? "text-navy-300" : "text-navy-900")}>
          {value}
        </p>
      </div>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
        >
          Change
        </button>
      ) : null}
    </div>
  );
}

export function BookingSummary({ treatment, doctor, date, time, onEdit, className, title }: BookingSummaryProps) {
  const t = getTreatment(treatment);
  const d = getDoctor(doctor);

  return (
    <div className={cn("rounded-[1.75rem] bg-white p-6 shadow-soft ring-1 ring-navy-100", className)}>
      <p className="text-sm font-semibold tracking-wide text-navy-900">{title ?? "Your appointment"}</p>
      <div className="mt-2 divide-y divide-navy-100">
        <Row
          icon={t ? <TreatmentIcon icon={t.icon} size={18} /> : <Stethoscope className="size-[18px]" aria-hidden />}
          label="Treatment"
          value={t?.name ?? "Not selected yet"}
          muted={!t}
          onEdit={t && onEdit ? () => onEdit(0) : undefined}
        />
        <Row
          icon={
            d ? (
              <span className="relative size-10">
                <Image src={unsplash(d.image, 120)} alt="" fill sizes="40px" className="object-cover object-top" />
              </span>
            ) : (
              <UserRound className="size-[18px]" aria-hidden />
            )
          }
          label="Dentist"
          value={d?.name ?? "Any available dentist"}
          onEdit={onEdit ? () => onEdit(1) : undefined}
        />
        <Row
          icon={<CalendarDays className="size-[18px]" aria-hidden />}
          label="Date"
          value={date ? formatDate(fromDateKey(date), "long") : "Not selected yet"}
          muted={!date}
          onEdit={date && onEdit ? () => onEdit(2) : undefined}
        />
        <Row
          icon={<Clock3 className="size-[18px]" aria-hidden />}
          label="Time"
          value={time !== null ? `${formatMinutes(time)}${t ? ` · ${visitLength(t)}` : ""}` : "Not selected yet"}
          muted={time === null}
          onEdit={time !== null && onEdit ? () => onEdit(2) : undefined}
        />
        {t ? (
          <Row
            icon={<Wallet className="size-[18px]" aria-hidden />}
            label="Estimated cost"
            value={formatPrice(t.price)}
          />
        ) : null}
      </div>
      {t?.priceNote ? (
        <p className="mt-1 text-xs text-navy-400">{t.priceNote}. Final estimate shared after consultation.</p>
      ) : null}
    </div>
  );
}
