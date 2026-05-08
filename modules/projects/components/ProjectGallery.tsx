"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import Image from "@/common/components/elements/Image";
import { GalleryImage } from "@/common/types/projects";

import ImageLightbox from "./ImageLightbox";

interface ProjectGalleryProps {
  images: GalleryImage[];
  title: string;
}

const ProjectGallery = ({ images, title }: ProjectGalleryProps) => {
  const t = useTranslations("ProjectsPage");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!images.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
        {t("gallery_title")}
      </h2>

      <div className="space-y-4">
        {images.map((img, idx) => (
          <figure
            key={idx}
            className="cursor-zoom-in"
            onClick={() => setActiveIndex(idx)}
            aria-label={img.alt ?? title}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              rounded="rounded-xl"
              className="w-full h-auto transition duration-500 hover:scale-[1.02]"
            />
            {img.caption && (
              <figcaption className="mt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {activeIndex !== null && (
        <ImageLightbox
          images={images}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onChange={setActiveIndex}
        />
      )}
    </div>
  );
};

export default ProjectGallery;
