'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  id: number;
  description: string;
}

const slides: Slide[] = [
  { id: 1, description: "Our first date, where time stood still and hearts connected." },
  { id: 2, description: "That magical moment when we knew this was something special." },
  { id: 3, description: "Every laugh we shared, every tear we wiped away together." },
  { id: 4, description: "The little moments that made our love story unique." },
  { id: 5, description: "Through ups and downs, our love only grew stronger." },
  { id: 6, description: "Creating memories that will last a lifetime." },
  { id: 7, description: "The way your smile lights up my world every day." },
  { id: 8, description: "Our adventures together, making every day special." },
  { id: 9, description: "The comfort of knowing you're always there for me." },
  { id: 10, description: "One year of beautiful moments, with many more to come." },
  { id: 11, description: "The warmth of your embrace, my safe haven in any storm." },
  { id: 12, description: "Every shared dream that brings us closer to our future." },
  { id: 13, description: "The quiet evenings where just being together feels like enough." },
  { id: 14, description: "The spark in your eyes that still gives me butterflies." },
  { id: 15, description: "Every promise we've made, sealed with trust and love." },
  { id: 16, description: "The joy of building a life together, one moment at a time." },
  { id: 17, description: "Looking forward to forever, hand in hand with you." }
];

export default function AnniversaryPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const autoplayInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoplay) {
      autoplayInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => {
      if (autoplayInterval.current) {
        clearInterval(autoplayInterval.current);
      }
    };
  }, [isAutoplay, slides.length]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setDragStart('touches' in e ? e.touches[0].clientX : e.clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const end = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStart - end;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-amber-100 relative overflow-hidden">
      {/* Falling rose petals animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 text-2xl"
            initial={{ top: -20, left: `${Math.random() * 100}%` }}
            animate={{
              top: '100%',
              left: `${Math.random() * 100}%`,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            ❀💗
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Main slideshow container */}
            <div
              className="relative flex flex-col md:flex-row aspect-auto md:aspect-[16/9] rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-xl"
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchEnd={handleDragEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="flex flex-col md:flex-row w-full h-full"
                >
                  {/* Main image */}
                  <div className="w-full md:w-2/3 relative min-h-[220px] md:min-h-0 bg-white/20 flex items-center justify-center">
                    <Image
                      src={`/year/im${currentSlide + 1}.jpg`}
                      alt={`Anniversary memory ${currentSlide + 1}`}
                      fill
                      className="object-contain"
                      priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                      <p className="text-white font-dancing text-xl">
                        {slides[currentSlide].description}
                      </p>
                    </div>
                  </div>

                  {/* Note image */}
                  <div className="w-full md:w-1/3 relative flex items-center justify-center p-4 md:p-0 mt-4 md:mt-0">
                    <motion.div
                      initial={{ rotate: -5, y: 20 }}
                      animate={{ rotate: -5, y: 0 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="w-full max-w-xs aspect-[3/4] rounded-xl shadow-lg bg-white/30"
                    >
                      <Image
                        src={`/year/n${currentSlide + 1}.jpg`}
                        alt="Love note"
                        fill
                        className="object-contain rounded-xl"
                        priority
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
              aria-label="Next slide"
            >
              →
            </button>

            {/* Autoplay toggle */}
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
              aria-label={isAutoplay ? "Pause slideshow" : "Play slideshow"}
            >
              {isAutoplay ? "⏸" : "▶"}
            </button>

            {/* Progress dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-amber-400 scale-125"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 