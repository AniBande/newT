'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const text = " I vow to help you cherish every moment, to hold you close in warmth and tenderness. To listen not just with my ears but with my heart. To adore your laughter, wipe away your tears, and walk beside you through every adventure. I promise to love you endlessly, as you are my forever, my dream, my home. ✨💖";

export default function LovePage() {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startExperience = () => {
    setStarted(true);

    // Play video & audio
    if (videoRef.current) videoRef.current.play();
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Start with low volume
      audioRef.current.play();

      // Gradually increase volume
      let volume = 0.3;
      const volumeInterval = setInterval(() => {
        if (volume < 1) {
          volume += 0.05;
          audioRef.current!.volume = Math.min(volume, 1);
        } else {
          clearInterval(volumeInterval);
        }
      }, 2000); // Increase volume every 2 seconds
    }

    // Start text animation
    const words = text.split(" ");
    let index = 0;
    const duration = 25000; // 25 seconds
    const intervalTime = duration / words.length;

    const textInterval = setInterval(() => {
      if (index < words.length) {
        setDisplayedText((prev) => prev + words[index] + " ");
        index++;
      } else {
        clearInterval(textInterval);
      }
    }, intervalTime);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-center text-white px-6">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Audio */}
      <audio ref={audioRef} src="/music.mp3" />

      {/* Start Button */}
      {!started && (
        <motion.button
          className="relative z-10 px-6 py-3 text-lg font-semibold bg-pink-600 hover:bg-pink-700 rounded-lg shadow-lg"
          onClick={startExperience}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Start Experience
        </motion.button>
      )}

      {/* Text Animation */}
      {started && (
        <motion.div
          className="relative z-10 bg-black/40 p-6 rounded-lg shadow-lg max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-2xl md:text-3xl font-semibold leading-relaxed tracking-wide font-serif text-pink-300 shadow-lg">
            {displayedText.trim()}
          </h1>
        </motion.div>
      )}
    </div>
  );
}
