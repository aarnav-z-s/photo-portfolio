'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AudioToggle from './AudioToggle';

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/experimental', label: 'Experimental' },
  { href: '/bw', label: 'B&W' },
  { href: '/essays', label: 'Essays' },
  { href: '/upload', label: 'Upload' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
        style={{ height: 'var(--nav-height)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        {/* Background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: scrolled
              ? 'linear-gradient(180deg, rgba(7,7,7,0.95) 0%, transparent 100%)'
              : 'transparent',
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Logo */}
        <Link
          href="/"
          className="relative z-10 font-display text-2xl tracking-[-0.04em] text-[#eeeae3] hover:text-[#bfa882] transition-colors duration-300"
          style={{ fontStyle: 'italic', fontWeight: 300 }}
        >
          AZ
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 relative z-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href || pathname.startsWith(link.href + '/') ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: audio + menu */}
        <div className="flex items-center gap-4 relative z-10">
          <AudioToggle />
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <motion.span
              className="block w-5 h-px bg-[#eeeae3]"
              animate={{ rotateZ: menuOpen ? 45 : 0, y: menuOpen ? 4 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-5 h-px bg-[#eeeae3]"
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-px bg-[#eeeae3]"
              animate={{ rotateZ: menuOpen ? -45 : 0, y: menuOpen ? -4 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#070707] flex flex-col justify-center items-start px-8"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    className={`font-display text-5xl font-light italic ${
                      pathname === link.href ? 'text-[#bfa882]' : 'text-[#eeeae3]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="absolute bottom-12 left-8 caption-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              AZ Photography · All rights reserved
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
