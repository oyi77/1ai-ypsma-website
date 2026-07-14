import React, { useState, useCallback, useEffect, useRef } from 'react';

interface Props {
  images: string[];
  alt?: string;
}

export default function PhotoSlideshow({ images, alt = 'Dokumentasi' }: Props) {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, true>>({ 0: true });
  const touchRef = useRef({ startX: 0, endX: 0 });

  const prev = useCallback(() => setIdx(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() => setIdx(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  // Preload adjacent
  useEffect(() => {
    const preload = (i: number) => {
      if (!loaded[i]) {
        const img = new Image();
        img.onload = () => setLoaded(p => ({ ...p, [i]: true }));
        img.src = images[i];
      }
    };
    preload((idx + 1) % images.length);
    preload(idx === 0 ? images.length - 1 : idx - 1);
  }, [idx, images, loaded]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  const onTouchStart = (e: React.TouchEvent) => { touchRef.current.startX = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchRef.current.startX;
    if (Math.abs(diff) > 50) diff > 0 ? prev() : next();
  };

  if (!images.length) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main image */}
      <div
        className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={i === 0 ? alt : ''}
            width="1200" height="750"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}

        {/* Arrows */}
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm z-10" aria-label="Sebelumnya">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm z-10" aria-label="Selanjutnya">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>

        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
          {idx + 1} / {images.length}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === idx ? 'bg-coral-500 w-6' : 'bg-neutral-300 hover:bg-neutral-400'}`}
            aria-label={`Foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
