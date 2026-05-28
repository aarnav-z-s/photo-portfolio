'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { featuredPhotos, gallerySections } from '@/lib/photos';
import ParallaxSection from '@/components/ParallaxSection';
import ImageStack from '@/components/ImageStack';
import Lightbox from '@/components/Lightbox';
import StoryMode from '@/components/StoryMode';
import ThreeCanvas from '@/components/ThreeCanvas';
import { Photo } from '@/types';

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale  = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const featured = featuredPhotos[0];

  return (
    <section ref={ref} className="relative h-screen flex items-end overflow-hidden">
      {/* Particle canvas */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <ThreeCanvas />
      </div>

      {/* Background image */}
      <motion.div className="absolute inset-0 z-0" style={{ scale }}>
        <div
          className="w-full h-full"
          style={{ backgroundColor: featured?.placeholder || '#0a0d12' }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707]/60 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 container-editorial pb-16 md:pb-24 w-full"
        style={{ opacity, y: titleY }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="caption-text text-[#bfa882] mb-6"
        >
          AZ · Photography · {new Date().getFullYear()}
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            className="font-display font-light italic text-[clamp(4rem,14vw,13rem)] leading-[0.85] tracking-[-0.03em] text-[#eeeae3]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Aarnav
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            className="font-display font-light text-[clamp(4rem,14vw,13rem)] leading-[0.85] tracking-[-0.03em] text-[#bfa882]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Sareen
          </motion.h1>
        </div>

        <motion.p
          className="font-display italic text-[#7a746e] text-lg md:text-xl mt-6 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          Cinematic photography — projects, experiments, and visual essays.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="flex items-center gap-3 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <div className="scroll-line h-12 w-px" />
          <span className="caption-text text-[#3d3835]">Scroll</span>
        </motion.div>
      </motion.div>

      {/* Corner metadata */}
      <motion.div
        className="absolute right-8 bottom-8 z-10 text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        {featured?.metadata && (
          <>
            <p className="caption-text">{featured.metadata.camera}</p>
            <p className="caption-text text-[#3d3835]">{featured.metadata.location} · {featured.metadata.date}</p>
          </>
        )}
      </motion.div>
    </section>
  );
}

// ── Featured Strip ─────────────────────────────────────────────────────────
function FeaturedStrip() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [storyMode, setStoryMode] = useState(false);

  return (
    <section className="section-padding border-t border-[#111]">
      <div className="container-editorial">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="caption-text text-[#bfa882] mb-3">Selected Work</p>
            <h2 className="font-display font-light text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] italic text-[#eeeae3]">
              Featured
            </h2>
          </div>
          <button
            onClick={() => setStoryMode(true)}
            className="caption-text text-[#7a746e] hover:text-[#bfa882] transition-colors"
          >
            View as Film ▶
          </button>
        </div>

        {/* Three-image editorial grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Large left image */}
          {featuredPhotos[0] && (
            <motion.div
              className="col-span-12 md:col-span-7 group cursor-pointer relative overflow-hidden"
              style={{ aspectRatio: '3/4' }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setLightboxIndex(0)}
            >
              <ParallaxSection speed={0.15} className="absolute inset-0">
                <div
                  className="w-full h-[120%] -mt-[10%]"
                  style={{ backgroundColor: featuredPhotos[0].placeholder || '#0a0d12' }}
                />
              </ParallaxSection>
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="caption-text text-[#bfa882] mb-1">01</p>
                <h3 className="font-display italic text-3xl text-[#eeeae3] hover-caption">
                  {featuredPhotos[0].title}
                </h3>
                <p className="hover-caption caption-text mt-1">{featuredPhotos[0].metadata?.location}</p>
              </div>
            </motion.div>
          )}

          {/* Right column: two stacked */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-4 md:gap-6">
            {featuredPhotos.slice(1, 3).map((photo, i) => (
              <motion.div
                key={photo.id}
                className="group cursor-pointer relative overflow-hidden flex-1"
                style={{ aspectRatio: '16/10' }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLightboxIndex(i + 1)}
              >
                <ParallaxSection speed={0.1} className="absolute inset-0">
                  <div
                    className="w-full h-[120%] -mt-[10%]"
                    style={{ backgroundColor: photo.placeholder || '#0e0e0e' }}
                  />
                </ParallaxSection>
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="caption-text text-[#bfa882] mb-0.5">0{i + 2}</p>
                  <h3 className="font-display italic text-xl text-[#eeeae3] hover-caption">
                    {photo.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={featuredPhotos}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>

      {/* Story mode */}
      <AnimatePresence>
        {storyMode && (
          <StoryMode
            photos={featuredPhotos}
            title="Featured Work"
            onClose={() => setStoryMode(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Section Previews ───────────────────────────────────────────────────────
const sectionMeta: Record<string, { href: string; accent: string }> = {
  projects:     { href: '/projects',     accent: '#bfa882' },
  experimental: { href: '/experimental', accent: '#6b8cae' },
  bw:           { href: '/bw',           accent: '#7a746e' },
  essays:       { href: '/essays',       accent: '#bfa882' },
};

function SectionPreviews() {
  return (
    <section className="section-padding border-t border-[#111]">
      <div className="container-editorial">
        <p className="caption-text text-[#bfa882] mb-12">Sections</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {gallerySections.map((section, i) => {
            const meta = sectionMeta[section.id] || { href: '/', accent: '#bfa882' };
            return (
              <Link key={section.id} href={meta.href} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Image stack preview */}
                  <div className="relative mb-5 overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <ImageStack photos={section.photos.slice(0, 4)} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/60 to-transparent pointer-events-none" />
                  </div>

                  {/* Section info */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="caption-text mb-1" style={{ color: meta.accent }}>
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <h3 className="font-display italic text-3xl md:text-4xl text-[#eeeae3] group-hover:text-[#bfa882] transition-colors duration-300">
                        {section.title}
                      </h3>
                      <p className="caption-text mt-1 text-[#3d3835]">{section.subtitle}</p>
                    </div>
                    <motion.span
                      className="caption-text text-[#3d3835] group-hover:text-[#bfa882] transition-colors"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Statement ──────────────────────────────────────────────────────────────
function Statement() {
  return (
    <section className="section-padding border-t border-[#111]">
      <div className="container-editorial">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            className="caption-text text-[#bfa882] mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Statement
          </motion.p>
          <motion.blockquote
            className="font-display font-light italic text-[clamp(1.5rem,4vw,3rem)] leading-[1.2] text-[#eeeae3]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            &ldquo;Photography is not about cameras or darkrooms or even images.
            It is about time — the instant before, the instant after, and the long
            silence that contains everything.&rdquo;
          </motion.blockquote>
          <motion.p
            className="caption-text text-[#3d3835] mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            — AZ
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-[#111] py-10">
      <div className="container-editorial flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <span className="font-display italic text-2xl text-[#eeeae3]">AZ</span>
        <nav className="flex gap-6">
          {[
            { href: '/projects', label: 'Projects' },
            { href: '/experimental', label: 'Experimental' },
            { href: '/bw', label: 'B&W' },
            { href: '/essays', label: 'Essays' },
            { href: '/upload', label: 'Upload' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="caption-text text-[#3d3835]">
          © {new Date().getFullYear()} Aarnav Sareen
        </p>
      </div>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedStrip />
      <SectionPreviews />
      <Statement />
      <Footer />
    </div>
  );
}
