'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { essayPhotos } from '@/lib/photos';
import { Photo } from '@/types';
import PageHeader from '@/components/PageHeader';
import StoryMode from '@/components/StoryMode';
import ParallaxSection from '@/components/ParallaxSection';

function EssayCard({ photo, index }: { photo: Photo; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [storyMode, setStoryMode] = useState(false);

  return (
    <>
      <motion.article
        className="border-t border-[#1c1c1c] pt-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-5%' }}
        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Index + title row */}
        <div className="grid md:grid-cols-12 gap-6 mb-8">
          <div className="md:col-span-1">
            <p className="caption-text text-[#bfa882]">{String(index + 1).padStart(2, '0')}</p>
          </div>
          <div className="md:col-span-7">
            <h2 className="font-display italic text-[clamp(2rem,5vw,4rem)] leading-[0.9] text-[#eeeae3] mb-2">
              {photo.title}
            </h2>
            {photo.subtitle && (
              <p className="caption-text text-[#7a746e]">{photo.subtitle}</p>
            )}
          </div>
          <div className="md:col-span-4 flex flex-col justify-end items-end gap-2">
            {photo.metadata?.date && <p className="caption-text">{photo.metadata.date}</p>}
            {photo.metadata?.camera && <p className="caption-text text-[#3d3835]">{photo.metadata.camera}</p>}
          </div>
        </div>

        {/* Hero image */}
        <div className="relative overflow-hidden mb-8" style={{ aspectRatio: `${photo.width}/${photo.height}`, maxHeight: '75vh' }}>
          <ParallaxSection speed={0.12} className="absolute inset-0">
            <div
              className="w-full h-[130%] -mt-[15%]"
              style={{ backgroundColor: photo.placeholder || '#0e0e0e' }}
            />
          </ParallaxSection>
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/50 to-transparent" />
        </div>

        {/* Essay body */}
        {photo.essay && (
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-1" />
            <div className="md:col-span-7 space-y-6">
              <p className="essay-body">{photo.essay.intro}</p>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6 overflow-hidden"
                  >
                    {photo.essay.sections.map((section, i) => (
                      <div key={i}>
                        {section.heading && (
                          <p className="essay-heading">{section.heading}</p>
                        )}
                        <p className="essay-body">{section.body}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-6 pt-2">
                <button
                  onClick={() => setExpanded(e => !e)}
                  className="caption-text text-[#7a746e] hover:text-[#bfa882] transition-colors"
                >
                  {expanded ? 'Read less ↑' : 'Read more ↓'}
                </button>
                <button
                  onClick={() => setStoryMode(true)}
                  className="caption-text text-[#7a746e] hover:text-[#bfa882] transition-colors"
                >
                  View as film ▶
                </button>
              </div>
            </div>
            {photo.metadata?.thoughts && (
              <div className="md:col-span-4">
                <p className="caption-text text-[#3d3835] mb-2">Field notes</p>
                <p className="font-display italic text-[#7a746e] text-sm leading-relaxed">
                  &ldquo;{photo.metadata.thoughts}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}
      </motion.article>

      <AnimatePresence>
        {storyMode && (
          <StoryMode
            photos={[photo]}
            title={photo.title}
            onClose={() => setStoryMode(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function EssaysClient() {
  return (
    <div className="min-h-screen pt-[var(--nav-height)]">
      <PageHeader
        label="04 — Visual Essays"
        title="Photography as Literature"
        subtitle="Sequences of images that tell extended stories."
        accent="#bfa882"
        heroPhoto={essayPhotos[0]}
      />

      <section className="section-padding">
        <div className="container-editorial space-y-20 md:space-y-32">
          {essayPhotos.map((photo, i) => (
            <EssayCard key={photo.id} photo={photo} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
