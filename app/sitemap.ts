import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { METADATA } from "@/common/constants/metadata";

// Use the vanilla supabase-js client (no cookies) — the SSR cookie-based
// server client throws when called outside a Request context (e.g. sitemap).
const getSupabaseClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

/** Round a number to 2 decimal places to avoid floating-point display issues */
const round2 = (n: number) => Math.round(n * 100) / 100;

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
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => {
      const isDefault = locale === "en";
      const pathPrefix = isDefault ? "" : `/${locale}`;
      return {
        url: `${BASE_URL}${pathPrefix}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: isDefault ? route.priority : round2(route.priority - 0.05),
        alternates: {
          languages: {
            en: `${BASE_URL}${route.path}`,
            id: `${BASE_URL}/id${route.path}`,
            "x-default": `${BASE_URL}${route.path}`,
          },
        },
      };
    })
  );

  // Generate project slug entries for each locale
  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = getSupabaseClient();
    const { data: projects, error } = await supabase
      .from("projects")
      .select("slug, updated_at")
      .order("updated_at", { ascending: false });

    if (!error && projects && projects.length > 0) {
      projectEntries = projects.flatMap((project) =>
        locales.map((locale) => {
          const isDefault = locale === "en";
          const pathPrefix = isDefault ? "" : `/${locale}`;
          return {
            url: `${BASE_URL}${pathPrefix}/projects/${project.slug}`,
            lastModified: new Date(project.updated_at ?? now),
            changeFrequency: "monthly" as const,
            priority: isDefault ? 0.7 : 0.65,
            alternates: {
              languages: {
                en: `${BASE_URL}/projects/${project.slug}`,
                id: `${BASE_URL}/id/projects/${project.slug}`,
                "x-default": `${BASE_URL}/projects/${project.slug}`,
              },
            },
          };
        })
      );
    }

    if (error) {
      console.warn("[sitemap] Supabase error fetching projects:", error.message);
    }
  } catch (err) {
    console.warn("[sitemap] Could not fetch project slugs from DB:", err);
  }

  return [...staticEntries, ...projectEntries];
}

