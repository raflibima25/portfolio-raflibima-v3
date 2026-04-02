"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  BsListCheck as ResponsibilityIcon,
  BsBuildings as CompanyIcon,
} from "react-icons/bs";
import { HiChevronRight as ChevronIcon } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { differenceInMonths, differenceInYears, format } from "date-fns";

import SpotlightCard from "@/common/components/elements/SpotlightCard";
import { CareerProps, RoleProps } from "@/common/types/careers";

/* ------------------------------------------------------------------ */
/* Helper: format duration text                                        */
/* ------------------------------------------------------------------ */
function useDuration(start: string, end: string | null, locale: string) {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const years = differenceInYears(endDate, startDate);
  const months = differenceInMonths(endDate, startDate) % 12;
  const yearText = locale === "en" ? `yr${years > 1 ? "s" : ""}` : "thn";
  const monthText = locale === "en" ? `mo${months > 1 ? "s" : ""}` : "bln";

  let text = "";
  if (years > 0) text += `${years} ${yearText} `;
  if (months > 0 || years === 0) text += `${months} ${monthText}`;
  return { startDate, endDate, durationText: text.trim() };
}

/* ------------------------------------------------------------------ */
/* Single role row                                                     */
/* ------------------------------------------------------------------ */
const RoleRow = ({ role }: { role: RoleProps }) => {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const { startDate, endDate, durationText } = useDuration(
    role.start_date,
    role.end_date,
    locale,
  );

  const hideText = locale === "en" ? "Hide details" : "Sembunyikan detail";
  const showText = locale === "en" ? "Show details" : "Tampilkan detail";
  const responsibilityLabel =
    locale === "en" ? "Responsibilities" : "Tanggung Jawab";
  const techStackLabel = locale === "en" ? "Tech Stack" : "Teknologi";
  const projectLabel = locale === "en" ? "Projects" : "Proyek";

  return (
    <div className="relative pl-6">
      {/* timeline dot */}
      <span className="absolute left-0 top-[6px] h-3 w-3 rounded-full border-2 border-yellow-400 bg-yellow-400/20" />

      <div className="space-y-1">
        {/* position title */}
        <h6 className="font-semibold leading-tight text-neutral-800 dark:text-neutral-100">
          {role.position}
        </h6>

        {/* meta row: type · location_type */}
        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          {role.type} · {role.location_type}
        </p>

        {/* date range · duration */}
        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          {format(startDate, "MMM yyyy")} –{" "}
          {role.end_date ? format(endDate, "MMM yyyy") : "Present"}
          <span className="ml-2 text-neutral-400 dark:text-neutral-600">
            · {durationText}
          </span>
        </p>

        {/* projects chips */}
        {role.projects && role.projects.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {role.projects.map((p) => (
              <span
                key={p}
                className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-[11px] font-medium text-yellow-600 dark:text-yellow-400"
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {/* tech stack chips */}
        {role.tech_stack && role.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {role.tech_stack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-neutral-300 px-2 py-0.5 text-[10px] text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* toggle responsibilities */}
        {role.responsibilities && role.responsibilities.length > 0 && (
          <div className="pt-1">
            <button
              onClick={() => setOpen(!open)}
              className="-ml-1 flex items-center gap-x-1 text-xs text-neutral-500 transition duration-200 hover:text-neutral-800 dark:hover:text-neutral-300"
            >
              <motion.span
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ duration: 0.25 }}
                className="inline-block"
              >
                <ChevronIcon size={14} />
              </motion.span>
              {open ? hideText : showText}
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-1.5 border-l-2 border-neutral-200 pl-3 dark:border-neutral-700">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-yellow-500">
                      <ResponsibilityIcon size={13} />
                      {responsibilityLabel}
                    </div>
                    <ul className="space-y-1">
                      {role.responsibilities!.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"
                        >
                          <span className="mt-0.5 shrink-0 font-bold text-yellow-500">
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Company card                                                        */
/* ------------------------------------------------------------------ */
const CareerCard = ({ company, logo, location, link, roles }: CareerProps) => {
  // Overall company duration = earliest start → latest end
  const sortedRoles = [...roles].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
  );
  const earliestStart = sortedRoles[0].start_date;
  const latestEnd = sortedRoles[sortedRoles.length - 1].end_date;

  const locale = useLocale();
  const { startDate, endDate, durationText } = useDuration(
    earliestStart,
    latestEnd,
    locale,
  );

  return (
    <div className="rounded-2xl border-[1.5px] border-neutral-300 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
      {/* top header: logo + company info */}
      <div className="flex items-start gap-4">
        {logo ? (
          <Image
            width={48}
            height={48}
            src={logo}
            alt={company}
            className="mt-0.5 shrink-0 rounded-xl border-[1.5px] border-neutral-300 bg-neutral-100 object-contain dark:border-neutral-700 dark:bg-neutral-800 sm:h-14 sm:w-14"
          />
        ) : (
          <CompanyIcon size={48} className="mt-0.5 shrink-0 text-neutral-500 sm:hidden" />
        )}

        <div className="min-w-0 flex-1">
          <Link href={link || "#"} target="_blank">
            <h5 className="font-bold leading-tight hover:underline">
              {company}
            </h5>
          </Link>
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            {location}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            {format(startDate, "MMM yyyy")} –{" "}
            {latestEnd ? format(endDate, "MMM yyyy") : "Present"} · {durationText}
          </p>
        </div>
      </div>

      {/* vertical timeline of roles */}
      <div className="relative mt-3 space-y-5">
        {/* vertical line connecting dots */}
        {roles.length > 1 && (
          <span
            className="absolute left-[5px] top-3 h-[calc(100%-24px)] w-px bg-neutral-200 dark:bg-neutral-700"
            aria-hidden
          />
        )}
        {/* render most-recent role first */}
        {[...roles]
          .sort(
            (a, b) =>
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime(),
          )
          .map((role, i) => (
            <RoleRow key={i} role={role} />
          ))}
      </div>
    </div>
  );
};

export default CareerCard;
