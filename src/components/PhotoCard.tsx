'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Photo } from '@/types';
import MetadataOverlay from './MetadataOverlay';

interface PhotoCardProps {
  photo: Photo;
  onClick?: (photo: Photo) => void;
  priority?: boolean;
  showMeta?: boolean;
  className?: string;
  index?: number;
}

export default function PhotoCard({
  photo,
  onClick,
  priority = false,
  showMeta = true,
  className = '',
  index = 0,
}: PhotoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [hovered, setHovered] = useState(false);

  const aspectRatio = photo.width / photo.height;

  return (
    <motion.div
      ref={ref}
      className={`relative group cursor-pointer overflow-hidden ${className}`}
      style={{ aspectRatio }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: (index % 4) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => onClick?.(photo)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Placeholder / image */}
      <motion.div
        className="absolute inset-0 img-hover-scale"
        animate={{ scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="w-full h-full"
          style={{ backgroundColor: photo.placeholder || '#0e0e0e' }}
        />
        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/70 via-transparent to-transparent" />
      </motion.div>

      {/* Hover caption */}
      {showMeta && (
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 hover-caption">
          <p className="font-display italic text-base text-[#eeeae3] leading-none mb-1">
            {photo.title}
          </p>
          {photo.metadata?.location && (
            <p className="caption-text">{photo.metadata.location}</p>
          )}
        </div>
      )}

      {/* Full metadata overlay */}
      {showMeta && photo.metadata && (
        <MetadataOverlay photo={photo} visible={hovered} position="bottom" />
      )}

      {/* View indicator */}
      <motion.div
        className="absolute top-4 right-4 caption-text text-[#bfa882] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        View
      </motion.div>
    </motion.div>
  );
}
