import type { MetadataRoute } from "next";
import { METADATA } from "@/common/constants/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/_next/"],
      },
    ],
    sitemap: `${METADATA.baseUrl}/sitemap.xml`,
    host: METADATA.baseUrl,
  };
}
