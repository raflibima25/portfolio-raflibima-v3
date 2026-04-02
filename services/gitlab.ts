import axios from "axios";
import { unstable_cache } from "next/cache";
import { format, subDays, startOfWeek, addDays, getMonth, getYear, isSameMonth } from "date-fns";
import { GITLAB_ACCOUNTS } from "@/common/constants/gitlab";

const fetchGitlabData = async (accounts: { username: string; token?: string }[]) => {
  try {
    const allData = await Promise.all(
      accounts.map((account) =>
        axios.get(`https://gitlab.com/users/${account.username}/calendar.json`, {
          headers: account.token ? { Authorization: `Bearer ${account.token}` } : {},
        }).catch((e) => {
          console.error(`Error fetching GitLab for ${account.username}:`, e.message);
          return { data: {} };
        })
      )
    );

    const mergedData: Record<string, number> = {};
    for (const res of allData) {
      if (res.data) {
        for (const [date, count] of Object.entries(res.data as Record<string, number>)) {
           // Gitlab date format is typically YYYY-MM-DD
           mergedData[date] = (mergedData[date] || 0) + count;
        }
      }
    }

    return mergedData;
  } catch (error) {
    console.error("GitLab API Error:", error);
    return null;
  }
};

const getCachedGitlabData = unstable_cache(
  async (accounts: { username: string; token?: string }[]) => fetchGitlabData(accounts),
  ["gitlab-stats-cache-key-v2"],
  {
    revalidate: 3600,
    tags: ["gitlab-stats-tag"],
  },
);

export const getGitlabData = async () => {
  const { accounts } = GITLAB_ACCOUNTS;

  if (!accounts || accounts.length === 0) {
    return { status: 500, data: null };
  }

  const rawData = await getCachedGitlabData(accounts);

  if (!rawData) {
    return { status: 502, data: null };
  }

  // Transform rawData into GitHub GraphQL-like structure
  const today = new Date();
  const endDate = today;
  // GitHub shows approx 365 days, ending on the current day, but starting at the beginning of the week 1 year ago.
  const startDate = startOfWeek(subDays(endDate, 365));

  const weeks: any[] = [];
  let currentWeekDays: any[] = [];
  let currentWeekStart = format(startDate, "yyyy-MM-dd");

  let totalContributions = 0;

  let loopDate = startDate;
  while (loopDate <= endDate) {
    const dateStr = format(loopDate, "yyyy-MM-dd");
    const count = rawData[dateStr] || 0;
    totalContributions += count;

    let color = "level0";
    if (count > 0 && count <= 3) color = "level1";
    else if (count > 3 && count <= 6) color = "level2";
    else if (count > 6 && count <= 9) color = "level3";
    else if (count > 9) color = "level4";

    currentWeekDays.push({
      date: dateStr,
      contributionCount: count,
      color: color,
    });

    if (currentWeekDays.length === 7) {
      weeks.push({
        firstDay: currentWeekStart,
        contributionDays: currentWeekDays,
      });
      currentWeekDays = [];
      loopDate = addDays(loopDate, 1);
      currentWeekStart = format(loopDate, "yyyy-MM-dd");
      continue;
    }

    loopDate = addDays(loopDate, 1);
  }

  // push remaining days in the last week
  if (currentWeekDays.length > 0) {
    weeks.push({
      firstDay: currentWeekStart,
      contributionDays: currentWeekDays,
    });
  }

  // generate months array for the labels
  // GitHub returns months with totalWeeks based on when the month started in the calendar view
  const months: any[] = [];
  let currentMonthStr = "";
  let currentMonthObj: any = null;

  for (const week of weeks) {
    const weekStartMonth = format(new Date(week.firstDay), "MMM"); // e.g. "Jan"
    if (weekStartMonth !== currentMonthStr) {
      if (currentMonthObj) {
        months.push(currentMonthObj);
      }
      currentMonthStr = weekStartMonth;
      currentMonthObj = {
        name: currentMonthStr,
        firstDay: week.firstDay,
        totalWeeks: 1,
      };
    } else {
      currentMonthObj.totalWeeks += 1;
    }
  }
  if (currentMonthObj) {
    months.push(currentMonthObj);
  }

  const structuredData = {
    totalContributions,
    colors: ["level1", "level2", "level3", "level4"],
    weeks,
    months,
  };

  return { status: 200, data: structuredData };
};
