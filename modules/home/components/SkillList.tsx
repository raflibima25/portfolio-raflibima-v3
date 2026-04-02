"use client";

import { useState } from "react";
import { BiCodeAlt as SkillsIcon } from "react-icons/bi";
import { useTranslations } from "next-intl";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import { STACKS, SkillCategory } from "@/common/constants/stacks";

const ALL_LABEL = "Semua";

type FilterTab = typeof ALL_LABEL | SkillCategory;

const CATEGORIES: FilterTab[] = [
  ALL_LABEL,
  "Utama",
  "Frontend",
  "Backend",
  "Mobile",
  "Database",
  "Tools",
];

const SkillList = () => {
  const t = useTranslations("HomePage");
  const [activeTab, setActiveTab] = useState<FilterTab>(ALL_LABEL);

  const allStacks = Object.entries(STACKS).filter(([, v]) => v.isActive);

  const filteredStacks =
    activeTab === ALL_LABEL
      ? allStacks
      : allStacks.filter(([, v]) => v.category === activeTab);

  const countFor = (tab: FilterTab) =>
    tab === ALL_LABEL
      ? allStacks.length
      : allStacks.filter(([, v]) => v.category === tab).length;

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={t("skills.title")} icon={<SkillsIcon />} />
        <SectionSubHeading>
          <p>{t("skills.sub_title")}</p>
        </SectionSubHeading>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((tab) => {
          const count = countFor(tab);
          if (count === 0) return null;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-yellow-400 bg-yellow-400 text-neutral-900"
                  : "border-neutral-300 bg-transparent text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-200"
              }`}
            >
              {t(`skills.tab_${tab}`)}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none ${
                  isActive
                    ? "bg-yellow-500/40 text-neutral-900"
                    : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skill Pills */}
      <div className="flex flex-wrap gap-2.5">
        {filteredStacks.map(([name, { icon, color }]) => (
          <div
            key={name}
            className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-3.5 py-1.5 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-200 dark:border-neutral-700/60 dark:bg-neutral-800/50 dark:hover:border-neutral-500 dark:hover:bg-neutral-700/50"
          >
            {/* Colored icon */}
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center ${color}`}
            >
              {icon}
            </span>
            <span className="whitespace-nowrap text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillList;
