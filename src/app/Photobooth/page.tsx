'use client';

import React, { useState, useRef, FC } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { FiCamera, FiDownload, FiRepeat } from 'react-icons/fi';

// --- Type Definitions & Constants (No Changes) ---
type Photo = { src: string; filter: string };
type PhotoStudioProps = { onExit: () => void };
const FILTERS: string[] = ["Rose Gold", "Dreamy", "Film", "Golden Hour", "Moonlight"];

// --- Filter Helper Functions (No Changes) ---
const getFilterClass = (filter: string): string => {
  switch (filter.toLowerCase()) {
    case "rose gold": return "filter-[sepia(0.2)_saturate(1.4)_hue-rotate(-10deg)_contrast(0.9)_brightness(1.1)]";
    case "dreamy": return "filter-[blur(0.5px)_saturate(0.8)_contrast(0.9)_brightness(1.2)]";
    case "film": return "filter-[sepia(0.3)_contrast(1.15)_saturate(1.2)]";
    case "golden hour": return "filter-[sepia(0.4)_saturate(1.5)_contrast(1.1)_brightness(1.1)]";
    case "moonlight": return "filter-[grayscale(0.7)_contrast(1.2)_brightness(1.1)]";
    default: return "";
  }
};
const getCanvasFilter = (filter: string): string => {
  switch (filter.toLowerCase()) {
    case "rose gold": return "sepia(0.2) saturate(1.4) hue-rotate(-10deg) contrast(0.9) brightness(1.1)";
    case "dreamy": return "blur(0.5px) saturate(0.8) contrast(0.9) brightness(1.2)";
    case "film": return "sepia(0.3) contrast(1.15) saturate(1.2)";
    case "golden hour": return "sepia(0.4) saturate(1.5) contrast(1.1) brightness(1.1)";
    case "moonlight": return "grayscale(0.7) contrast(1.2) brightness(1.1)";
    default: return "none";
  }
};

const drawCoverImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
  const imgRatio = img.width / img.height;
  const destRatio = w / h;
  let sWidth = img.width, sHeight = img.height, sx = 0, sy = 0;
  if (imgRatio > destRatio) {
    sHeight = img.height;
    sWidth = sHeight * destRatio;
    sx = (img.width - sWidth) / 2;
  } else {
    sWidth = img.width;
    sHeight = sWidth / destRatio;
    sy = (img.height - sHeight) / 2;
  }
  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
};

// --- PhotoStudio Component (With Final Enhancements) ---
const PhotoStudio: FC<PhotoStudioProps> = ({ onExit }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("Rose Gold");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);

  const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

  const takePhoto = async (): Promise<void> => {
    const video = webcamRef.current?.video;
    if (!video || video.readyState < 2) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = getCanvasFilter(selectedFilter);
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const filteredImg = canvas.toDataURL("image/jpeg");
    setPhotos((prev) => [...prev, { src: filteredImg, filter: selectedFilter }]);
  };

  const startPhotoSequence = async (): Promise<void> => {
    setIsCapturing(true);
    setPhotos([]);
    setShowResult(false);
    for (let i = 0; i < 4; i++) {
      await delay(500);
      setCountdown("3"); await delay(1000);
      setCountdown("2"); await delay(1000);
      setCountdown("1"); await delay(1000);
      setCountdown("Smile!"); await delay(500);
      await takePhoto();
      setCountdown(null);
    }
    setIsCapturing(false);
    setShowResult(true);
  };

  const handleReshoot = (): void => {
    setPhotos([]);
    setShowResult(false);
  };

  const handleDownload = async (): Promise<void> => {
    if (photos.length < 4) return;
    try {
      const photoSize = 480, padding = 24, margin = 16;
      const canvasWidth = (photoSize * 2) + margin + (padding * 2);
      const canvasHeight = (photoSize * 2) + margin + (padding * 2) + 60;
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#F9F6F2";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      const imagePromises = photos.map(p => new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = p.src;
      }));
      const loadedImages = await Promise.all(imagePromises);
      drawCoverImage(ctx, loadedImages[0], padding, padding, photoSize, photoSize);
      drawCoverImage(ctx, loadedImages[1], padding + photoSize + margin, padding, photoSize, photoSize);
      drawCoverImage(ctx, loadedImages[2], padding, padding + photoSize + margin, photoSize, photoSize);
      drawCoverImage(ctx, loadedImages[3], padding + photoSize + margin, padding + photoSize + margin, photoSize, photoSize);
      
      // (UPDATED) Renamed caption text
      const captionText = `Twilight's Booth • ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
      ctx.font = "32px Georgia, serif";
      ctx.fillStyle = "#8C6C66";
      ctx.textAlign = "center";
      ctx.fillText(captionText, canvasWidth / 2, canvasHeight - 30);
      
      const dataURL = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.href = dataURL;
      // (UPDATED) Renamed download file
      link.download = "TwilightsBooth_Memories.jpg";
      link.click();
    } catch (error) { console.error("Error generating image:", error); }
  };

  return (
    <motion.div
      className="h-screen w-full relative flex flex-col items-center justify-center font-sans p-4 md:p-8 bg-cover bg-center"
      // (UPDATED) Using the new romantic background image
      style={{ backgroundImage: "url('/images/romantic-background.jpg')" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
    >
      {/* (NEW) Overlay to improve text readability over the background */}
      <div className="absolute inset-0 bg-black/20 z-0" />

      {/* All content is now in a container with z-10 to sit above the overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {!showResult ? (
          <div className="w-full max-w-4xl flex flex-col items-center">
            <div className="relative w-full max-w-xl aspect-[4/3] rounded-2xl shadow-xl overflow-hidden mb-6 bg-blush">
              {countdown && <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20"><p className="text-9xl font-bold text-white font-serif drop-shadow-lg animate-ping">{countdown.replace('Smile!', '😊')}</p></div>}
              <div className={`w-full h-full ${getFilterClass(selectedFilter)}`}><Webcam ref={webcamRef} audio={false} mirrored={true} className="w-full h-full object-cover" /></div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {FILTERS.map((filter) => (
                <div key={filter} className={`p-0.5 rounded-full bg-gradient-to-br from-rose to-blush transition-all duration-300 ${selectedFilter === filter ? 'scale-110' : 'scale-100'}`}>
                  <button
                    onClick={() => setSelectedFilter(filter)}
                    className={`block px-5 py-2 rounded-full text-sm font-medium ${selectedFilter === filter ? 'bg-rose text-cream shadow-md' : 'bg-cream text-dark-rose'}`}
                    disabled={isCapturing}
                  >{filter}</button>
                </div>
              ))}
            </div>
            <div className="p-1 rounded-full bg-gradient-to-br from-rose to-blush">
              <button
                className="w-20 h-20 rounded-full bg-rose text-cream flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
                onClick={startPhotoSequence}
                disabled={isCapturing}
              ><FiCamera size={32} /></button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
            <h2 className="font-serif text-4xl text-cream drop-shadow-md mb-6">Your Moments</h2>
            <div className="grid grid-cols-2 gap-4 p-4 bg-blush/70 backdrop-blur-sm rounded-2xl shadow-xl mb-8">
              {photos.map((photo, idx) => <div key={idx} className="rounded-lg overflow-hidden shadow-sm"><img src={photo.src} alt={`Photo ${idx + 1}`} className="w-48 h-48 object-cover" /></div>)}
            </div>
            <div className="flex gap-4">
              <div className="p-0.5 rounded-full bg-gradient-to-br from-rose to-blush">
                <button onClick={handleReshoot} className="flex items-center gap-2 px-6 py-3 bg-cream text-dark-rose rounded-full font-semibold hover:bg-blush transition-colors"><FiRepeat /> Reshoot</button>
              </div>
              <div className="p-0.5 rounded-full bg-gradient-to-br from-rose to-blush">
                <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-3 bg-cream text-dark-rose rounded-full font-semibold hover:bg-blush transition-colors"><FiDownload /> Download</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---
const PhotoBoothPage: FC = () => {
    const [step, setStep] = useState<'start' | 'preview' | 'studio'>('start');
    const handleStart = () => {
        setStep('preview');
        setTimeout(() => setStep('studio'), 2500);
    };
    const handleExitStudio = () => setStep('start');

    if (step === 'studio') {
        return <PhotoStudio onExit={handleExitStudio} />;
    }

    return (
        <div className="h-screen w-full bg-cream flex flex-col items-center justify-center text-center p-4">
            {step === 'start' && (
                <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center z-10">
                    {/* (UPDATED) Renamed the Booth */}
                    <h1 className="font-serif text-6xl md:text-8xl text-dark-rose mb-4">Twilight's Booth</h1>
                    <p className="font-sans text-lg text-rose mb-8">Create beautiful memories.</p>
                    <div className="p-1 rounded-full bg-gradient-to-br from-rose to-blush animate-pulse-slow">
                      <button 
                          onClick={handleStart} 
                          className="px-10 py-4 bg-rose text-cream font-bold rounded-full shadow-lg hover:bg-dark-rose transition-all duration-300 hover:scale-105"
                      >Tap to Begin</button>
                    </div>
                </motion.div>
            )}
            {step === 'preview' && (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="w-full h-full absolute inset-0">
                    <Webcam audio={false} mirrored={true} className="w-full h-full object-cover" />
                </motion.div>
            )}
        </div>
    );
};

export default PhotoBoothPage;