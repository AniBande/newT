'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import styles from './wish.module.css';

const months = [
  '1st Month', '2nd Month', '3rd Month', '4th Month',
  '5th Month', '6th Month', '7th Month', '8th Month',
  '9th Month', '10th Month', '11th Month', '12th Month'
];

const message = {
  title: 'Our Journey Together',
  content: `Every moment with you has been a beautiful adventure. 
  From our first date to this anniversary, each day has been filled with love and joy. 
  You make my life complete, and I cherish every second we spend together. 
  Here's to many more years of love, laughter, and beautiful memories. 
  I love you more than words can express.`
};

export default function WishPage() {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [showAnniversary, setShowAnniversary] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialize stars with varying sizes and opacities
    const newStars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.5
    }));
    setStars(newStars);

    // Initialize audio
    audioRef.current = new Audio('/song.mp3');
    audioRef.current.loop = true;

    // Draw stars on canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const drawStars = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          newStars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          });
          requestAnimationFrame(drawStars);
        };
        drawStars();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (currentMonth < months.length - 1) {
      const timer = setTimeout(() => {
        setCurrentMonth(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowAnniversary(true);
    }
  }, [currentMonth]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <canvas ref={canvasRef} className={styles.starrySky} />
      </div>

      {!showAnniversary ? (
        <div className={styles.loadingContainer}>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progress}
              initial={{ width: '0%' }}
              animate={{ width: `${((currentMonth + 1) / months.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <motion.h2
            key={currentMonth}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {months[currentMonth]}
          </motion.h2>
        </div>
      ) : (
        <motion.div
          className={styles.anniversaryContainer}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {showAnniversary && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={250} recycle={false} gravity={0.3} />}
          <motion.h1 
            className={styles.anniversaryText}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Happy Anniversary
          </motion.h1>
          <motion.div 
            className={`${styles.card} ${isCardOpen ? styles.cardOpen : ''}`}
            onClick={() => setIsCardOpen(!isCardOpen)}
            whileHover={{ scale: 1.04 }}
            initial={false}
            animate={{ boxShadow: isCardOpen ? '0 8px 32px 0 rgba(255,107,107,0.25)' : '0 4px 16px 0 rgba(0,0,0,0.15)' }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.cardInner} style={{ transform: isCardOpen ? 'rotateY(0deg)' : 'rotateY(0deg)' }}>
              {!isCardOpen ? (
                <div className={styles.cardFront}>
                  <h3>Click to Open</h3>
                </div>
              ) : (
                <div className={styles.cardBack}>
                  <h3>{message.title}</h3>
                  <p>{message.content}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <button
        className={styles.audioToggle}
        onClick={toggleAudio}
      >
        {isAudioPlaying ? '🔇' : '🔊'}
      </button>
    </div>
  );
} 