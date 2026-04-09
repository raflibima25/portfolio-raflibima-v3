import { Metadata } from "next";

import BackButton from "@/common/components/elements/BackButton";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import ProjectDetail from "@/modules/projects/components/ProjectDetail";
import { ProjectItem } from "@/common/types/projects";
import { METADATA } from "@/common/constants/metadata";
import { loadMdxFiles } from "@/common/libs/mdx";
import { getProjectsDataBySlug } from "@/services/projects";
import JsonLd from "@/common/components/seo/JsonLd";

interface ProjectDetailPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

const getProjectDetail = async (slug: string): Promise<ProjectItem> => {
  const projects = await getProjectsDataBySlug(slug);
  const contents = loadMdxFiles();
  const content = contents.find((item) => item.slug === slug);
  const response = { ...projects, content: content?.content };
  return JSON.parse(JSON.stringify(response));
};

export const generateMetadata = async ({
  params,
}: ProjectDetailPageProps): Promise<Metadata> => {
  const project = await getProjectDetail(params?.slug);
  const locale = params.locale || "en";

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      images: project.image,
      url: `${METADATA.openGraph.url}/${project.slug}`,
      siteName: METADATA.openGraph.siteName,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "article",
      authors: [METADATA.creator],
    },
    keywords: project.title,
    alternates: {
      canonical: `${METADATA.baseUrl}/${locale}/projects/${params.slug}`,
    },
  };
};

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const data = await getProjectDetail(params?.slug);
  const locale = params.locale || "en";

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: data?.title,
    description: data?.description,
    url: `${METADATA.baseUrl}/${locale}/projects/${params.slug}`,
    image: data?.image,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: "Rafli Bima Pratandra",
      url: METADATA.baseUrl,
    },
    creator: {
      "@type": "Person",
      name: "Rafli Bima Pratandra",
    },
  };

  return (
    <Container data-aos="fade-up">
      <JsonLd data={softwareAppSchema} />
      <BackButton url="/projects" />
      <PageHeading title={data?.title} description={data?.description} />
      <ProjectDetail {...data} />
    </Container>
  );
};

export default ProjectDetailPage;
