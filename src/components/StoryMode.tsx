'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '@/types';

interface StoryModeProps {
  photos: Photo[];
  title: string;
  onClose: () => void;
}

export default function StoryMode({ photos, title, onClose }: StoryModeProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoplay, setAutoplay] = useState(false);

  const photo = photos[index];
  const progress = ((index + 1) / photos.length) * 100;

  const go = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= photos.length) return;
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
  }, [index, photos.length]);

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'p' || e.key === 'P') setAutoplay(a => !a);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, next, prev]);

  useEffect(() => {
    if (!autoplay) return;
    if (index >= photos.length - 1) { setAutoplay(false); return; }
    const timer = setTimeout(next, 4000);
    return () => clearTimeout(timer);
  }, [autoplay, index, next, photos.length]);

  // Swipe
  let touchX = 0;
  const onTouchStart = (e: React.TouchEvent) => { touchX = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const d = touchX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) { d > 0 ? next() : prev(); }
  };

  const variants = {
    enter: (d: number) => ({
      opacity: 0,
      scale: 1.04,
      x: d > 0 ? 40 : -40,
    }),
    center: { opacity: 1, scale: 1, x: 0 },
    exit: (d: number) => ({
      opacity: 0,
      scale: 0.97,
      x: d > 0 ? -40 : 40,
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9100] bg-[#050505] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Progress bars — one per photo */}
      <div className="flex gap-1 px-6 pt-5 pb-3 flex-shrink-0">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="flex-1 story-progress-bar h-[2px] relative"
          >
            <motion.div
              className="story-progress-fill"
              animate={{
                width: i < index ? '100%' : i === index ? `${autoplay ? 100 : 100}%` : '0%',
              }}
              transition={i === index && autoplay ? { duration: 4, ease: 'linear' } : { duration: 0.3 }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: i < index ? 'var(--accent)' : i === index ? 'var(--accent)' : 'var(--border)',
                opacity: i <= index ? 1 : 1,
              }}
            />
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pb-4 flex-shrink-0">
        <div>
          <p className="caption-text text-[#bfa882]">{title}</p>
          <p className="font-display italic text-2xl text-[#eeeae3]">{photo.title}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAutoplay(a => !a)}
            className={`caption-text transition-colors ${autoplay ? 'text-[#bfa882]' : 'text-[#7a746e] hover:text-[#eeeae3]'}`}
          >
            {autoplay ? 'Pause' : 'Play'}
          </button>
          <button onClick={onClose} className="caption-text text-[#7a746e] hover:text-[#eeeae3]">✕ Exit</button>
        </div>
      </div>

      {/* Main image */}
      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center px-4"
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
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-4 flex items-center justify-center"
          >
            <div
              style={{
                aspectRatio: `${photo.width} / ${photo.height}`,
                maxHeight: '100%',
                maxWidth: '100%',
                width: 'auto',
              }}
              className="relative"
            >
              <div
                className="w-full h-full"
                style={{ backgroundColor: photo.placeholder || '#0e0e0e', minWidth: 200, minHeight: 150 }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / next hit areas */}
        <button
          onClick={prev}
          disabled={index === 0}
          className="absolute left-0 top-0 w-1/3 h-full z-10 opacity-0"
          aria-label="Previous"
        />
        <button
          onClick={next}
          disabled={index === photos.length - 1}
          className="absolute right-0 top-0 w-1/3 h-full z-10 opacity-0"
          aria-label="Next"
        />
      </div>

      {/* Caption / metadata bar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={photo.id + '-caption'}
          className="flex-shrink-0 px-6 py-5 border-t border-[#111] flex flex-col md:flex-row md:items-start gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex-1">
            {photo.description && (
              <p className="font-display italic text-[#7a746e] text-sm leading-relaxed max-w-xl">
                {photo.description}
              </p>
            )}
            {photo.metadata?.thoughts && (
              <p className="font-display italic text-[#3d3835] text-sm mt-1 max-w-xl">
                &ldquo;{photo.metadata.thoughts}&rdquo;
              </p>
            )}
          </div>
          {photo.metadata && (
            <div className="flex gap-6 flex-wrap">
              {photo.metadata.camera && (
                <span className="caption-text">{photo.metadata.camera}</span>
              )}
              {photo.metadata.aperture && (
                <span className="caption-text">{photo.metadata.aperture}</span>
              )}
              {photo.metadata.location && (
                <span className="caption-text">{photo.metadata.location}</span>
              )}
              {photo.metadata.date && (
                <span className="caption-text">{photo.metadata.date}</span>
              )}
            </div>
          )}
          <div className="caption-text text-[#3d3835] md:text-right">
            {index + 1} / {photos.length}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
