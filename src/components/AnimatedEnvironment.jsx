import React, { useEffect, useRef, useState, memo } from 'react';
import { getEnvironmentById } from '../data/backgroundVisualsData';

/**
 * Single Video Layer Component
 * Renders an HTML5 looping video with a photographic fallback poster.
 * Properly configures muted, playsInline, autoPlay for iOS/Android compliance.
 */
const NatureVideoLayer = memo(({ env, isVisible = true }) => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Mobile WebKit / Chromium autoplay requirements
    video.defaultMuted = true;
    video.muted = true;

    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Handled gracefully; poster remains visible if autoplay is delayed
          console.debug('[AnimatedEnvironment] Video play note:', err?.message || err);
        });
      }
    };

    playVideo();

    // Replay on tab refocus or visibility restoration
    const handleVisibility = () => {
      if (!document.hidden && video && !video.ended) {
        playVideo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [env?.videoSrc]);

  if (!env) return null;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      {/* 1. Cinematic Photographic Poster (Displays instantly while video loads / on error) */}
      <img
        src={env.poster}
        alt={env.name}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none select-none ${
          isVideoLoaded && !hasError ? 'opacity-0' : 'opacity-100'
        }`}
        loading="eager"
      />

      {/* 2. Realistic Looping Nature Video */}
      {!hasError && (
        <video
          ref={videoRef}
          src={env.videoSrc}
          poster={env.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onPlaying={() => setIsVideoLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none select-none ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 3. Explicit diagnostic notice if video asset is missing (Zero silent fallbacks) */}
      {hasError && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 max-w-xs sm:max-w-md px-3.5 py-2 bg-red-950/95 border border-red-500/70 rounded-xl text-red-200 text-xs shadow-2xl backdrop-blur-md z-30 flex items-center gap-2 text-center pointer-events-auto">
          <span>⚠️ Video asset missing or unplayable: <code className="font-mono font-bold text-red-100">{env.videoSrc}</code></span>
        </div>
      )}
    </div>
  );
});

NatureVideoLayer.displayName = 'NatureVideoLayer';

/**
 * AnimatedEnvironment Component
 * Manages full-screen cinematic video backgrounds with smooth 1.5s crossfading.
 * Unmounts departing video elements to conserve mobile memory & video decoder limits.
 */
export const AnimatedEnvironment = memo(({ environmentId = 'rain', isPlaying = true }) => {
  const normalizedId = environmentId === 'nature' ? 'forest' : environmentId;
  const currentEnv = getEnvironmentById(normalizedId);

  // Crossfade state management
  const [activeEnv, setActiveEnv] = useState(currentEnv);
  const [departingEnv, setDepartingEnv] = useState(null);
  const [fadeIncoming, setFadeIncoming] = useState(true);

  const prevEnvIdRef = useRef(normalizedId);
  const cleanupTimerRef = useRef(null);

  useEffect(() => {
    if (normalizedId !== prevEnvIdRef.current) {
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }

      // Previous active environment moves to departing slot
      setDepartingEnv(activeEnv);
      setActiveEnv(currentEnv);
      setFadeIncoming(false);

      // Trigger crossfade in next browser animation frame
      const rAF = requestAnimationFrame(() => {
        setFadeIncoming(true);
      });

      // After 1500ms crossfade completes, safely unload departing video
      cleanupTimerRef.current = setTimeout(() => {
        setDepartingEnv(null);
      }, 1500);

      prevEnvIdRef.current = normalizedId;

      return () => {
        cancelAnimationFrame(rAF);
        if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
      };
    }
  }, [normalizedId, currentEnv, activeEnv]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
      role="presentation"
      aria-hidden="true"
    >
      {/* Base Layer: Departing Video Scene (Underneath during crossfade) */}
      {departingEnv && (
        <div className="absolute inset-0 w-full h-full z-[1]">
          <NatureVideoLayer key={`departing-${departingEnv.id}`} env={departingEnv} isVisible={false} />
        </div>
      )}

      {/* Top Layer: Incoming/Active Video Scene (Smoothly dissolves in) */}
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out ${
          departingEnv ? (fadeIncoming ? 'opacity-100' : 'opacity-0') : 'opacity-100'
        } ${departingEnv ? 'z-[2]' : 'z-[1]'}`}
      >
        <NatureVideoLayer key={`active-${activeEnv.id}`} env={activeEnv} isVisible={true} />
      </div>

      {/* Subtle Readability Gradient Overlay (NO BLUR! Scenery remains 100% visible & crisp) */}
      <div 
        className="absolute inset-0 pointer-events-none z-[10]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.06) 22%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0.76) 100%)'
        }}
      />
    </div>
  );
});

AnimatedEnvironment.displayName = 'AnimatedEnvironment';

export default AnimatedEnvironment;
