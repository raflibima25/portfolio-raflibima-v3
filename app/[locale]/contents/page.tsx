import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import Tiktok from "@/modules/contents/Tiktok";
import { METADATA } from "@/common/constants/metadata";
import JsonLd from "@/common/components/seo/JsonLd";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "ContentsPage" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${METADATA.baseUrl}/${locale}/contents`,
    },
  };
}

const ContentsPage = async ({ params: { locale } }: Props) => {
  const t = await getTranslations({ locale, namespace: "ContentsPage" });

  const contentsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Contents – Rafli Bima Pratandra",
    description:
      "Video content and TikTok posts created by Rafli Bima Pratandra about software engineering and technology.",
    url: `${METADATA.baseUrl}/${locale}/contents`,
    author: {
      "@type": "Person",
      name: "Rafli Bima Pratandra",
      url: METADATA.baseUrl,
      sameAs: METADATA.sameAs,
    },
  };

  return (
    <Container data-aos="fade-up">
      <JsonLd data={contentsSchema} />
      <PageHeading title={t("title")} description={t("description")} />
      <Tiktok />
    </Container>
  );
};

export default ContentsPage;
