'use client';

import { bwPhotos } from '@/lib/photos';
import GalleryGrid from '@/components/GalleryGrid';
import PageHeader from '@/components/PageHeader';

export default function BWClient() {
  return (
    <div className="min-h-screen pt-[var(--nav-height)]">
      <PageHeader
        label="03 — Black & White"
        title="The Classical Form"
        subtitle="Silver gelatin aesthetics. Light, shadow, and the textures film alone can hold."
        accent="#7a746e"
        heroPhoto={bwPhotos[0]}
      />

      <section className="section-padding">
        <div className="container-editorial">
          <GalleryGrid
            photos={bwPhotos}
            title="Black & White"
            layout="masonry"
            showStoryMode
          />
        </div>
      </section>
    </div>
  );
}
