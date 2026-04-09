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
  {
    path: "/achievements",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contents", priority: 0.8, changeFrequency: "weekly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Build static routes with hreflang alternates
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}/en${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: {
        en: `${BASE_URL}/en${route.path}`,
        id: `${BASE_URL}/id${route.path}`,
      },
    },
  }));

  // Build dynamic project routes
  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const projects = await getProjectsData();
    projectEntries = projects.flatMap((project) =>
      locales.map((locale) => ({
        url: `${BASE_URL}/${locale}/projects/${project.slug}`,
        lastModified: new Date(project.updated_at ?? new Date()),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/projects/${project.slug}`,
            id: `${BASE_URL}/id/projects/${project.slug}`,
          },
        },
      }))
    );

    // Deduplicate: keep only one entry per slug (the 'en' variant as canonical)
    const seen = new Set<string>();
    projectEntries = projectEntries.filter((entry) => {
      const slug = (entry.url as string).split("/projects/")[1];
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    });
  } catch {
    // If DB is unavailable during build, skip dynamic project routes
    console.warn("[sitemap] Could not fetch project slugs from DB.");
  }

  return [...staticEntries, ...projectEntries];
}
