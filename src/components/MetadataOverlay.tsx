'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '@/types';

interface MetadataOverlayProps {
  photo: Photo;
  visible: boolean;
  position?: 'bottom' | 'side';
}

export default function MetadataOverlay({
  photo,
  visible,
  position = 'bottom',
}: MetadataOverlayProps) {
  const meta = photo.metadata;
  if (!meta) return null;

  const entries = [
    meta.camera && { label: 'Camera', value: meta.camera },
    meta.lens && { label: 'Lens', value: meta.lens },
    meta.aperture && { label: 'Aperture', value: meta.aperture },
    meta.shutter && { label: 'Shutter', value: meta.shutter },
    meta.iso && { label: 'ISO', value: meta.iso },
    meta.location && { label: 'Location', value: meta.location },
    meta.date && { label: 'Date', value: meta.date },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`absolute ${
            position === 'bottom'
              ? 'bottom-0 left-0 right-0 p-6'
              : 'top-0 right-0 p-6 w-64'
          } bg-gradient-to-t from-[#070707]/95 to-transparent pointer-events-none`}
          initial={{ opacity: 0, y: position === 'bottom' ? 10 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="font-display text-lg italic text-[#eeeae3] mb-3">
            {photo.title}
          </div>

          {entries.length > 0 && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {entries.map((e) => (
                <div key={e.label}>
                  <span className="caption-text text-[#3d3835]">{e.label} </span>
                  <span className="caption-text text-[#7a746e]">{e.value}</span>
                </div>
              ))}
            </div>
          )}

          {meta.thoughts && (
            <p className="mt-3 font-display italic text-sm text-[#7a746e] leading-relaxed border-t border-[#1c1c1c] pt-3">
              &ldquo;{meta.thoughts}&rdquo;
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
