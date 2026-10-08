import Link from "next/link";
import {
  CategoryType,
  StatusType,
  CATEGORY_STYLES,
  STATUS_STYLES,
} from "@/lib/card-styles";

export interface CardProps {
  category: CategoryType;
  status: StatusType;
  title: string;
  description: string;
  location: string;
  date: string;
  href?: string;
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

function formatCardDate(isoDateString: string): string {
  try {
    const parsedDate = new Date(isoDateString);
    if (isNaN(parsedDate.getTime())) {
      return isoDateString;
    }
    return dateFormatter.format(parsedDate);
  } catch {
    return isoDateString;
  }
}

export default function Card({
  category,
  status,
  title,
  description,
  location,
  date,
  href,
}: CardProps) {
  const categoryStyle = CATEGORY_STYLES[category];
  const IconComponent = categoryStyle.icon;

  const statusStyle = STATUS_STYLES[status];
  const StatusIcon = statusStyle.icon;

  const formattedDate = formatCardDate(date);

  const containerBaseClass =
    "flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 md:p-6 shadow-xs";
  const interactiveClass =
    "transition hover:shadow-md hover:border-baltic-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2";

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        {/* Wadah Kategori: Ikon 40px + Teks 16px */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${categoryStyle.circleBg} ${categoryStyle.iconColor}`}
            aria-hidden="true"
          >
            <IconComponent className="h-5 w-5" />
          </div>
          <span className={`text-base font-semibold ${categoryStyle.textColor}`}>
            {category}
          </span>
        </div>

        {/* Lencana status dengan ikon dan teks (WCAG SC 1.4.1) */}
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle.badgeBorder} ${statusStyle.badgeBg} ${statusStyle.badgeText}`}
        >
          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {status}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="line-clamp-2 text-lg font-semibold text-text-main break-words">
          {title}
        </h2>

        <p className="line-clamp-3 text-sm font-normal leading-relaxed text-text-muted">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <span className="text-xs font-semibold text-baltic-blue">{location}</span>

        <time
          dateTime={date}
          className="text-xs font-normal text-text-muted"
        >
          {formattedDate}
        </time>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${containerBaseClass} ${interactiveClass}`}>
        {content}
      </Link>
    );
  }

  return <article className={containerBaseClass}>{content}</article>;
}
