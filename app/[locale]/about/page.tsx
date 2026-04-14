import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import About from "@/modules/about";
import { METADATA } from "@/common/constants/metadata";
import JsonLd from "@/common/components/seo/JsonLd";

type Props = { params: { locale: string } };

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `${METADATA.baseUrl}${locale === 'en' ? '' : `/${locale}`}/about` },
  };
}

const AboutPage = async ({ params: { locale } }: Props) => {
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "About Rafli Bima Pratandra",
    url: `${METADATA.baseUrl}${locale === 'en' ? '' : `/${locale}`}/about`,
    mainEntity: {
      "@type": "Person",
      name: "Rafli Bima Pratandra",
      alternateName: ["Rafli Bima", "Rafli"],
      url: METADATA.baseUrl,
      image: `${METADATA.baseUrl}${METADATA.profile}`,
      jobTitle: "Software Engineer",
      description:
        "Backend Developer specializing in Golang, Node.js, and Next.js from Indonesia.",
      nationality: "Indonesian",
      knowsAbout: [
        "Golang",
        "Node.js",
        "Next.js",
        "Backend Development",
        "Software Engineering",
      ],
      sameAs: METADATA.sameAs,
    },
  };

  return (
    <Container data-aos="fade-up">
      <JsonLd data={profilePageSchema} />
      <PageHeading title={t("title")} description={t("description")} />
      <About />
    </Container>
  );
};

export default AboutPage;
