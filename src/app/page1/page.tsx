'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Player } from '@lottiefiles/react-lottie-player'; 

export default function Page1() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevents server-side rendering
  }

  const [showProposal, setShowProposal] = useState(true);
  const [backgroundStyle, setBackgroundStyle] = useState(
    'linear-gradient(117deg, #ff41f7 0%, rgba(255, 73, 73, 0.81) 100%)'
  );

  const propose = () => {
    setShowProposal(false);
    setBackgroundStyle('linear-gradient(116.82deg, #ff94e7 0%, #27cbff 100%)');
  };

  useEffect(() => {
    import('animejs').then((animeModule) => {
      const anime = animeModule.default;
      const textWrapper = document.querySelector('.ml6 .letters');

      if (textWrapper) {
        textWrapper.innerHTML =
          textWrapper.textContent?.replace(/\S/g, "<span class='letter'>$&</span>") || '';

        anime.timeline({ loop: true })
          .add({
            targets: '.ml6 .letter',
            translateY: ['1.1em', 0],
            translateZ: 0,
            duration: 750,
            delay: (el: any, i: number) => 50 * i,
          })
          .add({
            targets: '.ml6',
            opacity: 0,
            duration: 1000,
            easing: 'easeOutExpo',
            delay: 1000,
          });
      }
    });
  }, [showProposal]);

  return (
    <>
      <Head>
        <title>Propose</title>
        <meta name="description" content="A sweet proposal page ❤️" />
      </Head>

      <div
        style={{
          height: '100vh',
          background: backgroundStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {showProposal ? (
          <div id="parentElement">
            <Player
              src="https://assets10.lottiefiles.com/private_files/lf30_mywfoph1.json"
              background="transparent"
              speed={1}
              style={{ width: '300px', height: '300px' }}
              loop
              autoplay
            />
            <h1 style={{ textAlign: 'center', color: 'white', fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 700 }}>
              Will you be Mine?🥰
            </h1>
            <div className="d-flex">
              <button onClick={propose} className="btn-hover">Yes!</button>
              <button onClick={propose} className="btn-hover">Of Course, Yes!</button>
            </div>
          </div>
        ) : (
          <div id="showMessage" className="position-absolute top-50 start-50 translate-middle">
            <Player
              src="https://assets1.lottiefiles.com/packages/lf20_utsfwa3k.json"
              background="transparent"
              speed={1}
              style={{ width: '300px', height: '300px' }}
              loop
              autoplay
            />
            <h1 className="ml6">
              <span className="text-wrapper">
                <span className="letters">I Love you!</span>
              </span>
            </h1>
          </div>
        )}
      </div>

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js" strategy="afterInteractive" />
    </>
  );
}
