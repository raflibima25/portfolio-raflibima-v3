import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import SmartTalk from "@/modules/smarttalk";
import { METADATA } from "@/common/constants/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "SmartTalkPage" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `${METADATA.baseUrl}${locale === 'en' ? '' : `/${locale}`}/smart-talk` },
  };
}

const SmartTalkPage = async (props: Props) => {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "SmartTalkPage" });
  return (
    <Container data-aos="fade-up">
      <PageHeading title={t("title")} description={t("description")} />
      <SmartTalk />
    </Container>
  );
};

export default SmartTalkPage;
