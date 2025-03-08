/* eslint-disable */

'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Player } from '@lottiefiles/react-lottie-player'; // Updated import

export default function Page1() {
  const [showProposal, setShowProposal] = useState(true);
  const [backgroundStyle, setBackgroundStyle] = useState(
    'linear-gradient(117deg, #ff41f7 0%, rgba(255, 73, 73, 0.81) 100%)'
  );

  const propose = () => {
    setShowProposal(false);
    setBackgroundStyle('linear-gradient(116.82deg, #ff94e7 0%, #27cbff 100%)');
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !showProposal) {
      const anime = (window as any).anime;
      if (anime) {
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
      }
    }
  }, [showProposal]);

  return (
    <>
      <Head>
        <title>Propose</title>
        <meta
          name="description"
          content="You are the only one who understands me even more than myself. You are the only one with whom I can share everything, even my secrets. I want you to be with me always.! I LOVE YOU!"
        />
        <meta
          property="og:image"
          content="https://static.toiimg.com/thumb/msid-74004000,imgsize-511880,width-400,resizemode-4/74004000.jpg"
        />
        <link
          rel="shortcut icon"
          type="image/png"
          href="https://github.com/images/modules/search/mona-love.png"
        />
      </Head>

      <div
        style={{
          height: '100vh',
          margin: 0,
          padding: 0,
          background: backgroundStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {showProposal ? (
          <div id="parentElement">
            <div className="d-flex justify-content-center">
              <Player
                src="https://assets10.lottiefiles.com/private_files/lf30_mywfoph1.json"
                background="transparent"
                speed={1}
                style={{ width: '300px', height: '300px' }}
                loop
                autoplay
              />
            </div>
            <h1
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 'clamp(40px, 5vw, 72px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Will you be Mine?🥰
            </h1>
            <div className="d-flex justify-content-center">
              <button
                onClick={propose}
                style={{
                  color: 'gray',
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  width: '200px',
                  height: '50px',
                  margin: '10px',
                  fontWeight: 'bold',
                }}
                className="btn-hover"
              >
                Yes!
              </button>
              <button
                onClick={propose}
                style={{
                  color: 'gray',
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  width: '200px',
                  height: '50px',
                  margin: '10px',
                  fontWeight: 'bold',
                }}
                className="btn-hover"
              >
                Of Course, Yes!
              </button>
            </div>
          </div>
        ) : (
          <div
            id="showMessage"
            className="position-absolute top-50 start-50 translate-middle"
            style={{ textAlign: 'center' }}
          >
            <Player
              src="https://assets1.lottiefiles.com/packages/lf20_utsfwa3k.json"
              background="transparent"
              speed={1}
              style={{ width: '300px', height: '300px' }}
              loop
              autoplay
            />
            <h1
              className="ml6"
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: '50px',
                fontWeight: 700,
                position: 'relative',
              }}
            >
              <span
                className="text-wrapper"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  paddingTop: '0.2em',
                  paddingRight: '0.05em',
                  paddingBottom: '0.1em',
                  overflow: 'hidden',
                }}
              >
                <span className="letters">I Love you!</span>
              </span>
            </h1>
          </div>
        )}
      </div>

      {/* Only need anime.js script */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js"
        strategy="afterInteractive"
      />

      <style jsx global>{`
        html,
        body {
          height: 100%;
          margin: 0;
          padding: 0;
        }

        @media (max-width: 1148px) {
          h1 {
            font-size: 50px !important;
          }
          button {
            width: 150px !important;
            height: 40px !important;
          }
        }

        @media (max-width: 795px) {
          h1 {
            font-size: 40px !important;
          }
        }

        .ml6 .letter {
          display: inline-block;
          line-height: 1em;
        }

        .btn-hover:hover {
          background-color: #ff4690 !important;
          border: 2px solid white !important;
          color: white !important;
        }

        .d-flex {
          display: flex;
          justify-content: center;
        }

        .position-absolute {
          position: absolute;
        }

        .top-50 {
          top: 50%;
        }

        .start-50 {
          left: 50%;
        }

        .translate-middle {
          transform: translate(-50%, -50%);
        }
      `}</style>
    </>
  );
}