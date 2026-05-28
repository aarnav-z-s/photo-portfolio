'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '@/types';
import MetadataOverlay from './MetadataOverlay';

interface LightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [showMeta, setShowMeta] = useState(false);

  const photo = photos[index];

  const prev = useCallback(() => {
    if (index > 0) { setDirection(-1); setIndex(i => i - 1); }
  }, [index]);

  const next = useCallback(() => {
    if (index < photos.length - 1) { setDirection(1); setIndex(i => i + 1); }
  }, [index, photos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'i' || e.key === 'I') setShowMeta(m => !m);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  // Touch / swipe
  let touchStartX = 0;
  const onTouchStart = (e: React.TouchEvent) => { touchStartX = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) { delta > 0 ? next() : prev(); }
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '8%' : '-8%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-8%' : '8%', opacity: 0 }),
  };

  return (
    <motion.div
      className="lightbox-overlay fixed inset-0 z-[9000] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-[#1c1c1c] z-10 flex-shrink-0">
        <div className="font-display italic text-xl text-[#eeeae3]">{photo.title}</div>
        <div className="flex items-center gap-6">
          <span className="caption-text">
            {index + 1} / {photos.length}
          </span>
          <button
            onClick={() => setShowMeta(m => !m)}
            className={`caption-text transition-colors ${showMeta ? 'text-[#bfa882]' : 'text-[#7a746e] hover:text-[#eeeae3]'}`}
          >
            Info
          </button>
          <button
            onClick={onClose}
            className="caption-text text-[#7a746e] hover:text-[#eeeae3] transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={photo.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-8 flex items-center justify-center"
          >
            <div
              className="relative max-w-full max-h-full"
              style={{
                aspectRatio: `${photo.width} / ${photo.height}`,
                maxHeight: '80vh',
                width: 'auto',
              }}
            >
              <div
                className="w-full h-full"
                style={{ backgroundColor: photo.placeholder || '#0e0e0e', minWidth: 200, minHeight: 150 }}
              />
              {/* Metadata overlay over image */}
              <MetadataOverlay photo={photo} visible={showMeta} position="bottom" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next */}
        <button
          onClick={prev}
          disabled={index === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#7a746e] hover:text-[#eeeae3] disabled:opacity-20 transition-colors z-10"
          aria-label="Previous"
        >
          ←
        </button>
        <button
          onClick={next}
          disabled={index === photos.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#7a746e] hover:text-[#eeeae3] disabled:opacity-20 transition-colors z-10"
          aria-label="Next"
        >
          →
        </button>
      </div>

      {/* Bottom filmstrip */}
      <div className="flex items-center gap-2 px-6 py-4 border-t border-[#1c1c1c] overflow-x-auto flex-shrink-0">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            className={`flex-shrink-0 w-12 h-8 transition-opacity ${i === index ? 'opacity-100 ring-1 ring-[#bfa882]' : 'opacity-30 hover:opacity-60'}`}
          >
            <div className="w-full h-full" style={{ backgroundColor: p.placeholder || '#0e0e0e' }} />
          </button>
        ))}
        <div className="ml-auto caption-text text-[#3d3835] flex-shrink-0 pl-4">Press I for info · ← → to navigate · Esc to close</div>
      </div>
    </motion.div>
  );
}
