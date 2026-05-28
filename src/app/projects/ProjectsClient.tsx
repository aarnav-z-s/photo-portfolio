'use client';

import { motion } from 'framer-motion';
import { projectPhotos } from '@/lib/photos';
import GalleryGrid from '@/components/GalleryGrid';
import PageHeader from '@/components/PageHeader';

export default function ProjectsClient() {
  return (
    <div className="min-h-screen pt-[var(--nav-height)]">
      <PageHeader
        label="01 — Projects"
        title="Long-form Work"
        subtitle="Multi-image narratives exploring place, time, and human presence."
        accent="#bfa882"
        heroPhoto={projectPhotos[0]}
      />

      <section className="section-padding">
        <div className="container-editorial">
          <GalleryGrid
            photos={projectPhotos}
            title="Projects"
            layout="masonry"
            showStoryMode
          />
        </div>
      </section>
    </div>
  );
}
