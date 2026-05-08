"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useTranslations } from "next-intl";

import Portal from "@/common/components/elements/Portal";
import { GalleryImage } from "@/common/types/projects";

interface ImageLightboxProps {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}

const ImageLightbox = ({ images, index, onClose, onChange }: ImageLightboxProps) => {
  const t = useTranslations("ProjectsPage");
  const [isVisible, setIsVisible] = useState(true);
  const total = images.length;
  const current = images[index];

  const handleClose = useCallback(() => setIsVisible(false), []);

  const prev = useCallback(
    () => onChange((index - 1 + total) % total),
    [index, total, onChange],
  );
  const next = useCallback(
    () => onChange((index + 1) % total),
    [index, total, onChange],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose, prev, next]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -80) next();
    else if (info.offset.x > 80) prev();
  };

  return (
    <Portal>
      <AnimatePresence onExitComplete={onClose}>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          >
            <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4">
              <span className="text-sm text-white/50 tabular-nums">
                {t("gallery_counter", { current: index + 1, total })}
              </span>
              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                aria-label={t("gallery_close")}
              >
                <HiX size={20} />
              </button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                drag={total > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.src}
                  alt={current.alt}
                  className="max-h-[80vh] max-w-full w-auto h-auto object-contain rounded-lg select-none"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {current.caption && (
              <p className="mt-4 text-sm text-white/50 text-center max-w-2xl px-4">
                {current.caption}
              </p>
            )}

            {total > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                  aria-label={t("gallery_prev")}
                >
                  <HiChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                  aria-label={t("gallery_next")}
                >
                  <HiChevronRight size={24} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default ImageLightbox;
