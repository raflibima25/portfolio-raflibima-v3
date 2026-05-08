import { unstable_cache } from "next/cache";
import sharp from "sharp";

import { createClient } from "@/common/utils/server";
import { GalleryImage } from "@/common/types/projects";

type GalleryMeta = {
  filename: string;
  alt?: string;
  caption?: string;
};

const probeDimensions = unstable_cache(
  async (url: string): Promise<{ width: number; height: number } | null> => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const buffer = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(buffer).metadata();
      if (!meta.width || !meta.height) return null;
      return { width: meta.width, height: meta.height };
    } catch {
      return null;
    }
  },
  ["gallery-image-probe"],
  { revalidate: 3600 },
);

export const getProjectsData = async () => {
  const supabase = createClient();

  let { data, error } = await supabase.from("projects").select();

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((item) => {
    const { data: imageData } = supabase.storage
      .from("projects")
      .getPublicUrl(`${item.slug}.webp`);

    return {
      ...item,
      title: item.name,
      link_github: item.link_repo,
      image: imageData.publicUrl,
    };
  });
};

export const getProjectsDataBySlug = async (slug: string) => {
  const supabase = createClient();

  let { data, error } = await supabase
    .from("projects")
    .select()
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const { data: imageData } = supabase.storage
    .from("projects")
    .getPublicUrl(`${data.slug}.webp`);

  const galleryMeta: GalleryMeta[] = Array.isArray(data.gallery)
    ? data.gallery
    : [];

  const images = (
    await Promise.all(
      galleryMeta.map(async (item): Promise<GalleryImage | null> => {
        const { data: urlData } = supabase.storage
          .from("projects")
          .getPublicUrl(`${slug}/${item.filename}`);

        const dims = await probeDimensions(urlData.publicUrl);
        if (!dims) return null;

        return {
          src: urlData.publicUrl,
          width: dims.width,
          height: dims.height,
          alt: item.alt ?? data.name,
          caption: item.caption,
        };
      }),
    )
  ).filter((img): img is GalleryImage => img !== null);

  return {
    ...data,
    title: data.name,
    link_github: data.link_repo,
    image: imageData.publicUrl,
    images,
  };
};
