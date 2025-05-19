"use client";
import Image from "next/image";
import { useState } from "react";

const images = [
  "/g1.jpg", "/g2.jpg", "/g3.jpg",
  "/g4.jpg", "/bg.png", "/g5.jpg",
  "/g6.jpg", "/g7.png", "/g8.png"
];

export default function AnniGrid() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-rose-100 to-amber-100 p-4">
      <div
        className="grid grid-cols-3 grid-rows-3 gap-6 bg-white/10 rounded-2xl shadow-2xl p-6 backdrop-blur-md w-[90vw] h-[90vw] max-w-[700px] max-h-[700px]"
        style={{ aspectRatio: '1/1' }}
      >
        {images.map((src, idx) => (
          <button
            key={idx}
            className={`rounded-2xl glassmorph overflow-hidden shadow-lg transition-transform duration-300 aspect-square flex items-center justify-center focus:outline-none ${idx === 4 ? "ring-4 ring-pink-200/40 hover:scale-110 hover:ring-pink-400/60 hover:shadow-pink-300 rounded-3xl" : "hover:scale-105 hover:shadow-pink-200"}`}
            onClick={() => setOpenIdx(idx)}
            aria-label="Enlarge image"
            tabIndex={0}
          >
            <Image
              src={src}
              alt={idx === 4 ? "center" : "img"}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 700px) 33vw, 230px"
            />
          </button>
        ))}
      </div>
      {/* Lightbox Modal */}
      {openIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadein"
          onClick={() => setOpenIdx(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] p-2 md:p-4 rounded-2xl bg-white/10 shadow-2xl flex items-center justify-center"
            style={{ minWidth: 200, minHeight: 200 }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[openIdx]}
              alt="popup"
              width={600}
              height={600}
              className="object-contain rounded-2xl shadow-xl"
              style={{ maxWidth: '80vw', maxHeight: '80vh' }}
            />
            <button
              className="absolute top-2 right-2 bg-white/80 hover:bg-pink-200 text-pink-700 rounded-full w-8 h-8 flex items-center justify-center shadow-md text-2xl font-bold focus:outline-none"
              onClick={() => setOpenIdx(null)}
              aria-label="Close popup"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        .glassmorph {
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 24px 0 rgba(255, 0, 80, 0.08);
        }
        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadein {
          animation: fadein 0.2s;
        }
      `}</style>
    </div>
  );
} 