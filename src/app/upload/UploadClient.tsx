'use client';

import { motion } from 'framer-motion';
import UploadZone from '@/components/UploadZone';

export default function UploadClient() {
  return (
    <div className="min-h-screen pt-[var(--nav-height)]">
      <section className="section-padding">
        <div className="container-editorial max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="caption-text text-[#bfa882] mb-4">Manage</p>
            <h1 className="font-display italic font-light text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] text-[#eeeae3] mb-4">
              Upload
            </h1>
            <p className="font-display italic text-[#7a746e] text-lg mb-12 max-w-md">
              Add new images to your portfolio. Thumbnails are generated automatically.
            </p>

            <UploadZone />

            <div className="mt-16 border-t border-[#1c1c1c] pt-10 space-y-3">
              <p className="caption-text text-[#bfa882]">Notes</p>
              <p className="text-[#7a746e] text-sm leading-relaxed">
                Uploaded images are stored via Vercel Blob (configure <code className="font-mono text-xs text-[#bfa882]">BLOB_READ_WRITE_TOKEN</code> in your environment). Thumbnails are generated at 800px wide using Sharp.
              </p>
              <p className="text-[#7a746e] text-sm leading-relaxed">
                To create a password-protected private album, visit <code className="font-mono text-xs text-[#bfa882]">/private/[slug]</code> and set <code className="font-mono text-xs text-[#bfa882]">ALBUM_PASSWORD_HASH</code> in your environment.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
