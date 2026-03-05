'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { VillaPhoto } from '@/lib/types';

interface PhotoCarouselProps {
  photos: VillaPhoto[];
}

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const sorted = useMemo(
    () => [...photos].sort((a, b) => a.sort_order - b.sort_order),
    [photos]
  );

  if (sorted.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        Aucune photo disponible
      </div>
    );
  }

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c === 0 ? sorted.length - 1 : c - 1));
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c === sorted.length - 1 ? 0 : c + 1));
  };

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%' }),
    center: { x: 0 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%' }),
  };

  return (
    <div className="relative w-full overflow-hidden aspect-[16/9] md:aspect-[2.2/1] bg-gray-100 group">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) next();
            else if (info.offset.x > 80) prev();
          }}
        >
          <Image
            src={sorted[current].url}
            alt={sorted[current].alt}
            fill
            className="object-cover select-none"
            priority={current === 0}
            sizes="100vw"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient bas */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {/* Arrows — visibles au hover */}
      {sorted.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Photo précédente"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Photo suivante"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Compteur */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
        {current + 1} / {sorted.length}
      </div>

      {/* Dots navigation */}
      {sorted.length > 1 && sorted.length <= 12 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {sorted.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Photo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === current ? 'bg-white w-5' : 'bg-white/50 w-1.5 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
