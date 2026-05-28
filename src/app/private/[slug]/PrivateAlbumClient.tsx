'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryGrid from '@/components/GalleryGrid';
import { Photo } from '@/types';

// Demo private photos — replace with real data from your CMS / DB
const DEMO_PRIVATE_PHOTOS: Photo[] = [
  { id: 'priv1', title: 'Untitled I',  src: '', placeholder: '#0a0a0a', width: 3200, height: 2400, category: 'projects' },
  { id: 'priv2', title: 'Untitled II', src: '', placeholder: '#111',    width: 2400, height: 3200, category: 'projects' },
  { id: 'priv3', title: 'Untitled III',src: '', placeholder: '#0d0d0d', width: 2700, height: 2700, category: 'projects' },
];

interface Props {
  slug: string;
}

export default function PrivateAlbumClient({ slug }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/private/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password }),
      });

      if (res.ok) {
        setUnlocked(true);
      } else {
        setError('Incorrect password.');
        setPassword('');
        inputRef.current?.focus();
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-[var(--nav-height)]">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="lock"
            className="flex items-center justify-center min-h-[80vh] px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-sm text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <p className="caption-text text-[#bfa882] mb-3">Private Album</p>
                <h1 className="font-display italic text-4xl text-[#eeeae3] mb-2">
                  {slug.replace(/-/g, ' ')}
                </h1>
                <p className="font-display italic text-[#7a746e] mb-10">
                  This collection is password-protected.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-transparent border border-[#1c1c1c] text-[#eeeae3] px-4 py-3 caption-text placeholder:text-[#3d3835] focus:outline-none focus:border-[#bfa882] transition-colors"
                    autoFocus
                  />

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        className="caption-text text-red-500/70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading || !password}
                    className="w-full py-3 border border-[#bfa882]/40 hover:border-[#bfa882] caption-text text-[#bfa882] hover:text-[#eeeae3] transition-all disabled:opacity-40"
                  >
                    {loading ? 'Verifying...' : 'Enter'}
                  </button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <section className="section-padding">
              <div className="container-editorial">
                <p className="caption-text text-[#bfa882] mb-3">Private</p>
                <h1 className="font-display italic text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] text-[#eeeae3] mb-12">
                  {slug.replace(/-/g, ' ')}
                </h1>
                <GalleryGrid
                  photos={DEMO_PRIVATE_PHOTOS}
                  title={slug}
                  layout="masonry"
                  showStoryMode
                />
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
