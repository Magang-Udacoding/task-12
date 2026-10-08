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
  const formattedDate = formatCardDate(date);

  const containerBaseClass =
    "flex flex-col gap-4 rounded-xl border-0 bg-white p-6 shadow-md";
  const interactiveClass =
    "transition-shadow duration-150 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2";

  const content = (
    <>
      <div className="flex items-start justify-between">
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

        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.badgeBg} ${statusStyle.badgeText}`}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="line-clamp-2 text-lg font-semibold text-gray-900 break-words">
          {title}
        </h2>

        <p className="line-clamp-3 text-sm font-normal leading-relaxed text-gray-600">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-normal text-indigo-700">{location}</span>

        <time
          dateTime={date}
          className="text-xs font-normal text-gray-500"
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
