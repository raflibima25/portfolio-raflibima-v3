import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import Projects from "@/modules/projects";
import { METADATA } from "@/common/constants/metadata";
import JsonLd from "@/common/components/seo/JsonLd";

interface ProjectsPageProps {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: ProjectsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "ProjectsPage" });

  return {
    title: `${t("title")} ${METADATA.exTitle}`,
    description: t("description"),
    keywords: "portfolio frontend developer, software engineer jambi",
    alternates: {
      canonical: `${METADATA.baseUrl}/${locale}/projects`,
    },
  };
}

const ProjectsPage = async ({ params: { locale } }: ProjectsPageProps) => {
  const t = await getTranslations({ locale, namespace: "ProjectsPage" });

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects – Rafli Bima Pratandra",
    description:
      "A portfolio of software projects built by Rafli Bima Pratandra, including web applications and backend systems.",
    url: `${METADATA.baseUrl}/${locale}/projects`,
    author: {
      "@type": "Person",
      name: "Rafli Bima Pratandra",
      url: METADATA.baseUrl,
    },
  };

  return (
    <Container data-aos="fade-up">
      <JsonLd data={collectionPageSchema} />
      <PageHeading title={t("title")} description={t("description")} />
      <Projects />
    </Container>
  );
};

export default ProjectsPage;
