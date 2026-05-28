'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Photo } from '@/types';
import ParallaxSection from './ParallaxSection';

interface PageHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  accent?: string;
  heroPhoto?: Photo;
}

export default function PageHeader({
  label,
  title,
  subtitle,
  accent = '#bfa882',
  heroPhoto,
}: PageHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <motion.header
      ref={ref}
      className="relative h-[60vh] md:h-[70vh] flex items-end overflow-hidden border-b border-[#111]"
      style={{ opacity }}
    >
      {/* BG */}
      <ParallaxSection speed={0.2} className="absolute inset-0">
        <div
          className="w-full h-[130%] -mt-[15%]"
          style={{ backgroundColor: heroPhoto?.placeholder || '#0a0d12' }}
        />
      </ParallaxSection>
      <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container-editorial pb-10 w-full">
        <motion.p
          className="caption-text mb-4"
          style={{ color: accent }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {label}
        </motion.p>
        <div className="overflow-hidden">
          <motion.h1
            className="font-display font-light italic text-[clamp(3rem,9vw,8rem)] leading-[0.85] text-[#eeeae3]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h1>
        </div>
        {subtitle && (
          <motion.p
            className="font-display italic text-[#7a746e] text-lg mt-4 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.header>
  );
}
