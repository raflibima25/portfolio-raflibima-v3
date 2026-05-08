export type GalleryImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type ProjectItem = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  images?: GalleryImage[];
  link_demo?: string | null;
  link_github?: string | null;
  stacks: string[];
  content?: string | null;
  is_show: boolean;
  is_featured: boolean;
};

export type ProjectItemProps = {
  projects: ProjectItem[];
}
