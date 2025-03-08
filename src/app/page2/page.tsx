'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StarProps {
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}


export default function LovePage() {
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentNickname, setCurrentNickname] = useState(0);
  const [showStartButton, setShowStartButton] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const nicknames = [
    "संध्या", "Baby girl", "क्यूटी ","Twilight", "चिमणे", "jaanuu","छुटकू" ,
    "waga", "राणी", "Darling","बाळा", "Baby",
     "बायको", "shonul godul","पोरे","oyee","गाबडे"
  ];

  const startExperience = () => {
    setShowStartButton(false);
    setLoading(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.1; // Start at low volume
      audioRef.current.play().catch(err => console.log("Autoplay failed:", err));
      
      // Gradually increase volume
      let volume = 0.1;
      const volumeInterval = setInterval(() => {
        if (audioRef.current && volume < 1.0) {
          volume = Math.min(volume + 0.1, 1.0);
          audioRef.current.volume = volume;
        } else {
          clearInterval(volumeInterval);
        }
      }, 1000);
    }

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);

    const nicknameInterval = setInterval(() => {
      setCurrentNickname(prev => (prev + 1) % nicknames.length);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(nicknameInterval);
    };
  };

  return (
    <div className="relative min-h-screen">
      <audio ref={audioRef} src="/ring.mp3" preload="auto" />
      {showStartButton ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-50">
          <button
            className="px-6 py-3 bg-pink-500 text-lg font-semibold rounded-full shadow-lg hover:bg-pink-600 transition"
            onClick={startExperience}
          >
            Start Experience ❤️
          </button>
        </div>
      ) : (
        <AnimatePresence>
          {loading ? (
            <motion.div
              className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
              key="loader"
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  key={currentNickname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-10"
                >
                  {nicknames[currentNickname]}
                </motion.div>
                
                <div className="relative w-64 sm:w-80 md:w-96 h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 rounded-full"
                    style={{ width: `${loadingProgress}%` }}
                  ></motion.div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              key="main-content"
              transition={{ duration: 1.5 }}
              className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: "url('/aa.jpg')" }} // Background image applied here
            >
              <div className="text-white text-5xl sm:text-6xl md:text-7xl font-bold mb-8 tracking-tight">
                <motion.span
                  animate={{ textShadow: ["0 0 5px #ff69b4", "0 0 15px #ff69b4"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  I Love You संध्या ❤️ 
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
