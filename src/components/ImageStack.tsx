'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Photo } from '@/types';

interface ImageStackProps {
  photos: Photo[];
  onClick?: (photo: Photo) => void;
  label?: string;
}

export default function ImageStack({ photos, onClick, label }: ImageStackProps) {
  const [hovered, setHovered] = useState(false);
  const visible = photos.slice(0, 4);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick?.(photos[0])}
      style={{ paddingBottom: `${(visible.length - 1) * 12}px` }}
    >
      {visible.map((photo, i) => {
        const isTop = i === 0;
        const offset = i * 12;
        const rotation = i % 2 === 0 ? i * 1.2 : -(i * 1.2);

        return (
          <motion.div
            key={photo.id}
            className="absolute left-0 right-0 overflow-hidden shadow-2xl"
            style={{
              top: offset,
              zIndex: visible.length - i,
              originX: 0.5,
              originY: 0.5,
            }}
            animate={
              hovered
                ? {
                    y: -(i * 18),
                    rotate: rotation,
                    scale: isTop ? 1.02 : 1,
                  }
                : {
                    y: 0,
                    rotate: i * 0.5,
                    scale: 1,
                  }
            }
            transition={{
              duration: 0.6,
              delay: i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div
              className="w-full"
              style={{
                aspectRatio: `${photo.width} / ${photo.height}`,
                backgroundColor: photo.placeholder || '#0e0e0e',
              }}
            />
          </motion.div>
        );
      })}

      {/* Label */}
      {label && (
        <motion.div
          className="relative caption-text text-[#7a746e] mt-4"
          style={{ paddingTop: `${(visible.length - 1) * 12}px` }}
          animate={{ opacity: hovered ? 1 : 0.5 }}
        >
          {label} · {photos.length} images
        </motion.div>
      )}
    </div>
  );
}
