import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import Achievements from "@/modules/achievements";
import { METADATA } from "@/common/constants/metadata";
import { Suspense } from "react";
import JsonLd from "@/common/components/seo/JsonLd";

interface AchievementsPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: AchievementsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "AchievementsPage" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: "backend engineer achievements, certificates, rafli bima pratandra",
    alternates: {
      canonical: `${METADATA.baseUrl}${locale === 'en' ? '' : `/${locale}`}/achievements`,
    },
  };
}

const AchievementsPage = async ({
  params: { locale },
}: AchievementsPageProps) => {
  const t = await getTranslations({ locale, namespace: "AchievementsPage" });

  const achievementsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Achievements & Certifications – Rafli Bima Pratandra",
    description:
      "Certifications and achievements earned by Rafli Bima Pratandra as a Software Engineer.",
    url: `${METADATA.baseUrl}${locale === 'en' ? '' : `/${locale}`}/achievements`,
    author: {
      "@type": "Person",
      name: "Rafli Bima Pratandra",
      url: METADATA.baseUrl,
    },
  };

  return (
    <Container data-aos="fade-up">
      <JsonLd data={achievementsSchema} />
      <PageHeading title={t("title")} description={t("description")} />
      <Suspense>
        <Achievements />
      </Suspense>
    </Container>
  );
};

export default AchievementsPage;
