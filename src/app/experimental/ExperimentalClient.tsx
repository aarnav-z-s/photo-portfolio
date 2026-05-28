'use client';

import { experimentalPhotos } from '@/lib/photos';
import GalleryGrid from '@/components/GalleryGrid';
import PageHeader from '@/components/PageHeader';

export default function ExperimentalClient() {
  return (
    <div className="min-h-screen pt-[var(--nav-height)]">
      <PageHeader
        label="02 — Experimental"
        title="Process & Abstraction"
        subtitle="Alternative processes, multiple exposures, and chemical experimentation."
        accent="#6b8cae"
        heroPhoto={experimentalPhotos[0]}
      />

      <section className="section-padding">
        <div className="container-editorial">
          <GalleryGrid
            photos={experimentalPhotos}
            title="Experimental"
            layout="grid"
            showStoryMode
          />
        </div>
      </section>
    </div>
  );
}
