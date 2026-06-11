import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import ChatRoom from "@/modules/chat";
import { METADATA } from "@/common/constants/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "ChatRoomPage" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `${METADATA.baseUrl}${locale === 'en' ? '' : `/${locale}`}/chat` },
  };
}

const ChatRoomPage = async (props: Props) => {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "ChatRoomPage" });
  return (
    <Container data-aos="fade-up">
      <PageHeading title={t("title")} description={t("description")} />
      <ChatRoom />
    </Container>
  );
};

export default ChatRoomPage;
