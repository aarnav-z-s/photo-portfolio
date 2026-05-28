'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '@/types';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';
import StoryMode from './StoryMode';

interface GalleryGridProps {
  photos: Photo[];
  title?: string;
  layout?: 'masonry' | 'grid' | 'editorial';
  showStoryMode?: boolean;
}

type GridLayout = 'masonry' | 'grid' | 'editorial';

export default function GalleryGrid({
  photos,
  title = 'Gallery',
  layout: initialLayout = 'masonry',
  showStoryMode = true,
}: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [storyMode, setStoryMode] = useState(false);
  const [layout, setLayout] = useState<GridLayout>(initialLayout);

  const openLightbox = (photo: Photo) => {
    const idx = photos.indexOf(photo);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  return (
    <>
      {/* Controls bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="caption-text text-[#3d3835]">{photos.length} images</div>
        <div className="flex items-center gap-4">
          {showStoryMode && (
            <button
              onClick={() => setStoryMode(true)}
              className="caption-text text-[#7a746e] hover:text-[#bfa882] transition-colors"
            >
              Story Mode ▶
            </button>
          )}
          {/* Layout toggles */}
          <div className="flex gap-2">
            {(['masonry', 'grid', 'editorial'] as GridLayout[]).map(l => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`caption-text transition-colors ${layout === l ? 'text-[#bfa882]' : 'text-[#3d3835] hover:text-[#7a746e]'}`}
              >
                {l === 'masonry' ? '⊞' : l === 'grid' ? '⊟' : '≡'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={layout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={
            layout === 'masonry'
              ? 'masonry-grid'
              : layout === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4'
              : 'flex flex-col gap-6 md:gap-10'
          }
        >
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className={layout === 'masonry' ? 'masonry-grid-item' : layout === 'editorial' ? 'grid md:grid-cols-2 gap-6 items-center' : ''}
            >
              {layout === 'editorial' && i % 2 === 1 ? (
                <>
                  <div className="order-2 md:order-1 flex flex-col gap-3 px-4 md:px-8">
                    <p className="caption-text text-[#bfa882]">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="font-display text-3xl md:text-4xl italic text-[#eeeae3]">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-[#7a746e] text-sm leading-relaxed">{photo.description}</p>
                    )}
                    {photo.metadata?.location && (
                      <p className="caption-text">{photo.metadata.location} · {photo.metadata.date}</p>
                    )}
                    <button
                      onClick={() => openLightbox(photo)}
                      className="caption-text text-[#bfa882] hover:text-[#eeeae3] transition-colors mt-2 text-left"
                    >
                      View full image →
                    </button>
                  </div>
                  <PhotoCard photo={photo} onClick={openLightbox} index={i} className="order-1 md:order-2" />
                </>
              ) : layout === 'editorial' ? (
                <>
                  <PhotoCard photo={photo} onClick={openLightbox} index={i} />
                  <div className="flex flex-col gap-3 px-4 md:px-8">
                    <p className="caption-text text-[#bfa882]">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="font-display text-3xl md:text-4xl italic text-[#eeeae3]">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-[#7a746e] text-sm leading-relaxed">{photo.description}</p>
                    )}
                    {photo.metadata?.location && (
                      <p className="caption-text">{photo.metadata.location} · {photo.metadata.date}</p>
                    )}
                    <button
                      onClick={() => openLightbox(photo)}
                      className="caption-text text-[#bfa882] hover:text-[#eeeae3] transition-colors mt-2 text-left"
                    >
                      View full image →
                    </button>
                  </div>
                </>
              ) : (
                <PhotoCard photo={photo} onClick={openLightbox} index={i} />
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>

      {/* Story mode */}
      <AnimatePresence>
        {storyMode && (
          <StoryMode
            photos={photos}
            title={title}
            onClose={() => setStoryMode(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
