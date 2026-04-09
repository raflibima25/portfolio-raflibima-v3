import NextTopLoader from "nextjs-toploader";
import Script from "next/script";
import { getServerSession } from "next-auth";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";

import Layouts from "@/common/components/layouts";
import ThemeProviderContext from "@/common/stores/theme";
import NextAuthProvider from "@/SessionProvider";
import { METADATA } from "@/common/constants/metadata";
import { inter } from "@/common/styles/fonts";
import SkeletonThemeProvider from "@/SkeletonThemeProvider";
import { routing } from "@/i18n/routing";
import JsonLd from "@/common/components/seo/JsonLd";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(METADATA.baseUrl),
  title: {
    default: METADATA.title,
    template: METADATA.titleTemplate,
  },
  description: METADATA.description,
  keywords: METADATA.keyword,
  creator: METADATA.creator,
  authors: {
    name: METADATA.creator,
    url: METADATA.baseUrl,
  },
  alternates: {
    canonical: METADATA.baseUrl,
    languages: {
      "en": `${METADATA.baseUrl}/en`,
      "id": `${METADATA.baseUrl}/id`,
      "x-default": `${METADATA.baseUrl}/en`,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: METADATA.openGraph.title,
    description: METADATA.openGraph.description,
    url: METADATA.openGraph.url,
    siteName: METADATA.openGraph.siteName,
    locale: METADATA.openGraph.locale,
    images: METADATA.openGraph.images,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: METADATA.twitter.title,
    description: METADATA.twitter.description,
    images: METADATA.twitter.images,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

const RootLayout = async ({
  children,
  params: { locale },
}: RootLayoutProps) => {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const session = await getServerSession();

  // Person structured data – tells Google this site belongs to Rafli Bima Pratandra
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rafli Bima Pratandra",
    alternateName: ["Rafli Bima", "Rafli"],
    url: METADATA.baseUrl,
    image: `${METADATA.baseUrl}${METADATA.profile}`,
    jobTitle: "Software Engineer",
    description:
      "Backend Developer specializing in Golang, Node.js, and Next.js from Indonesia.",
    nationality: "Indonesian",
    knowsAbout: ["Golang", "Node.js", "Next.js", "Backend Development", "Software Engineering"],
    sameAs: METADATA.sameAs,
  };

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        />
        <JsonLd data={personSchema} />
      </head>
      <body className={inter.className}>
        <NextTopLoader
          color="#fbe400"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #fbe400,0 0 5px #ffffb8"
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <NextAuthProvider session={session}>
            <ThemeProviderContext>
              <SkeletonThemeProvider>
                <Layouts>{children}</Layouts>
              </SkeletonThemeProvider>
            </ThemeProviderContext>
          </NextAuthProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
