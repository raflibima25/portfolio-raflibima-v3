import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import Contact from "@/modules/contact";
import { METADATA } from "@/common/constants/metadata";
import JsonLd from "@/common/components/seo/JsonLd";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `${METADATA.baseUrl}${locale === 'en' ? '' : `/${locale}`}/contact` },
  };
}

const ContactPage = async (props: Props) => {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Rafli Bima Pratandra",
    description:
      "Get in touch with Rafli Bima Pratandra, a Software Engineer specializing in backend development.",
    url: `${METADATA.baseUrl}${locale === 'en' ? '' : `/${locale}`}/contact`,
    mainEntity: {
      "@type": "Person",
      name: "Rafli Bima Pratandra",
      url: METADATA.baseUrl,
      sameAs: METADATA.sameAs,
    },
  };

  return (
    <Container data-aos="fade-up">
      <JsonLd data={contactPageSchema} />
      <PageHeading title={t("title")} description={t("description")} />
      <Contact />
    </Container>
  );
};

export default ContactPage;
