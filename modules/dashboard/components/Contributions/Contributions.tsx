"use client";

import Link from "next/link";
import useSWR from "swr";
import { BsGithub as GithubIcon } from "react-icons/bs";
import { SiGitlab as GitlabIcon } from "react-icons/si";
import { useTranslations } from "next-intl";

import Overview from "./Overview";
import Calendar from "./Calendar";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import ContributionsSkeleton from "./ContributionsSkeleton";
import EmptyState from "@/common/components/elements/EmptyState";
import { GITHUB_ACCOUNTS } from "@/common/constants/github";
import { GITLAB_ACCOUNTS } from "@/common/constants/gitlab";
import { fetcher } from "@/services/fetcher";

interface ContributionsProps {
  endpoint: string;
  type?: "github" | "gitlab";
}

const Contributions = ({ endpoint, type = "github" }: ContributionsProps) => {
  const { data, isLoading, error } = useSWR(endpoint, fetcher);
  
  const contributionCalendar = type === "github"
    ? data?.contributionsCollection?.contributionCalendar
    : data;

  const t = useTranslations("DashboardPage");

  const accountInfo = type === "github"
    ? {
        is_active: GITHUB_ACCOUNTS.is_active,
        title: t("github.title"),
        subtitle: t("github.sub_title"),
        url: GITHUB_ACCOUNTS.github_url,
        username: GITHUB_ACCOUNTS.username,
        icon: <GithubIcon />,
        theme: "yellow" as const
      }
    : {
        is_active: GITLAB_ACCOUNTS.is_active,
        title: t("gitlab.title"),
        subtitle: t("gitlab.sub_title"),
        url: GITLAB_ACCOUNTS.gitlab_url,
        username: GITLAB_ACCOUNTS.usernames.join(", "),
        icon: <GitlabIcon />,
        theme: "orange" as const
      };

  if (!accountInfo.is_active) return null;

  return (
    <section className="space-y-2">
      <SectionHeading title={accountInfo.title} icon={accountInfo.icon} />
      <SectionSubHeading>
        <p>{accountInfo.subtitle}</p>
        <Link
          href={accountInfo.url}
          target="_blank"
          className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-400"
        >
          @{accountInfo.username}
        </Link>
      </SectionSubHeading>

      {error ? (
        <EmptyState message={t("error")} />
      ) : isLoading ? (
        <ContributionsSkeleton />
      ) : (
        <div className="space-y-3">
          <Overview data={contributionCalendar} />
          <Calendar data={contributionCalendar} theme={accountInfo.theme} />
        </div>
      )}
    </section>
  );
};

export default Contributions;
