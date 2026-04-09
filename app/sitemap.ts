import type { MetadataRoute } from "next";
import { METADATA } from "@/common/constants/metadata";
import { getProjectsData } from "@/services/projects";

const BASE_URL = METADATA.baseUrl;
const locales = ["en", "id"] as const;

// Static pages with their priorities and change frequencies
const staticRoutes = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/achievements", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contents", priority: 0.8, changeFrequency: "weekly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Generate one entry per locale per static route
  // (Next.js 14.1.x does not render alternates.languages in XML output,
  //  so we explicitly list each locale URL as a separate <url> entry)
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: locale === "en" ? route.priority : route.priority - 0.05,
      alternates: {
        languages: {
          en: `${BASE_URL}/en${route.path}`,
          id: `${BASE_URL}/id${route.path}`,
          "x-default": `${BASE_URL}/en${route.path}`,
        },
      },
    }))
  );

  // Generate project slug entries for each locale
  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const projects = await getProjectsData();

    if (projects.length > 0) {
      projectEntries = projects.flatMap((project) =>
        locales.map((locale) => ({
          url: `${BASE_URL}/${locale}/projects/${project.slug}`,
          lastModified: new Date(project.updated_at ?? now),
          changeFrequency: "monthly" as const,
          priority: locale === "en" ? 0.7 : 0.65,
          alternates: {
            languages: {
              en: `${BASE_URL}/en/projects/${project.slug}`,
              id: `${BASE_URL}/id/projects/${project.slug}`,
              "x-default": `${BASE_URL}/en/projects/${project.slug}`,
            },
          },
        }))
      );
    }
  } catch (err) {
    console.warn("[sitemap] Could not fetch project slugs from DB:", err);
  }

  return [...staticEntries, ...projectEntries];
}

