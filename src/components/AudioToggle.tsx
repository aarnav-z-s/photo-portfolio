'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BAR_COUNT = 4;

export default function AudioToggle() {
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
    // Synthesize ambient audio via Web Audio API (no file needed)
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const createAmbientTone = () => {
    if (typeof window === 'undefined') return;
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioCtxRef.current = ctx;

    const bufferSize = ctx.sampleRate * 4; // 4-second loop
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < bufferSize; i++) {
        // Pink-ish noise with gentle filtering
        data[i] = (Math.random() * 2 - 1) * 0.015;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Low-pass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;

    // Second filter for more warmth
    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'peaking';
    filter2.frequency.value = 120;
    filter2.gain.value = 6;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gainRef.current = gain;

    source.connect(filter);
    filter.connect(filter2);
    filter2.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    sourceRef.current = source;
  };

  const toggle = () => {
    if (!playing) {
      if (!audioCtxRef.current) {
        createAmbientTone();
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setTargetAtTime(1, audioCtxRef.current.currentTime, 0.5);
      }
      setPlaying(true);
    } else {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      }
      setPlaying(false);
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 group"
      aria-label={playing ? 'Mute ambient audio' : 'Play ambient audio'}
    >
      <span className="caption-text group-hover:text-[#eeeae3] transition-colors">
        {playing ? 'Ambient On' : 'Ambient Off'}
      </span>
      <div className="flex items-end gap-px h-4">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className="audio-bar"
            style={{
              height: playing ? undefined : '4px',
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${0.8 + i * 0.15}s`,
              animationPlayState: playing ? 'running' : 'paused',
            }}
            animate={playing ? {
              scaleY: [0.3, 1, 0.5, 0.8, 0.3],
              transition: {
                duration: 0.8 + i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              },
            } : { scaleY: 0.3 }}
          />
        ))}
      </div>
    </button>
  );
}
