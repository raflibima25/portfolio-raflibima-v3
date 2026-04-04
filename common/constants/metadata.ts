const BASE_URL = "https://raflibima.my.id";
const OG_IMAGE = `${BASE_URL}/images/og.png`;
const TITLE = "Rafli Bima Pratandra – Software Engineer | Backend Developer";
const DESCRIPTION =
  "Portfolio of Rafli Bima Pratandra, a Software Engineer specializing in backend development with Golang, Node.js, and Next.js from Indonesia.";

export const METADATA = {
  baseUrl: BASE_URL,
  creator: "Rafli Bima Pratandra",
  title: TITLE,
  titleTemplate: "%s | Rafli Bima Pratandra",
  description: DESCRIPTION,
  keyword:
    "rafli, rafli bima, rafli bima pratandra, backend engineer, web developer, golang, nextjs, software engineer indonesia",
  authors: {
    name: "Rafli Bima Pratandra",
    url: BASE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: BASE_URL,
    siteName: "Rafli Bima Pratandra",
    locale: "id_ID",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
  exTitle: "| Rafli Bima Pratandra",
  profile: "/images/rafli.jpg",
};

