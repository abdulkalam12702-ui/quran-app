import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { SURAHS_DATA, getSurahById } from '../data/surahsData';
import { RECITERS_DATA, getReciterById, getSurahAudioUrl } from '../data/recitersData';
import { BACKGROUND_VISUALS } from '../data/backgroundVisualsData';
import { ambientSoundEngine } from '../services/ambientAudioEngine';
import { usePreferences } from './PreferencesContext';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const { defaultReciterId, recordPlayHistory } = usePreferences();

  // Active track state
  const [currentSurahId, setCurrentSurahId] = useState(1);
  const [currentReciterId, setCurrentReciterId] = useState(defaultReciterId || 'mishary_alafasy');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Progress & Duration
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);

  // Playback settings
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'one', 'all'
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  // Separate Audio Controls: Quran vs Ambient Background
  const [quranVolume, setQuranVolumeState] = useState(1.0);
  const [isQuranMuted, setIsQuranMuted] = useState(false);

  const [ambientSound, setAmbientSoundState] = useState('rain'); // 'none', 'rain', 'ocean', 'wind', 'stream', 'pad'
  const [ambientVolume, setAmbientVolumeState] = useState(0.2);
  const [isAmbientMuted, setIsAmbientMuted] = useState(false);

  // UI States
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [activeVisualId, setActiveVisualId] = useState(BACKGROUND_VISUALS[0].id);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(null); // in seconds

  // Audio elements & timers
  const audioElementRef = useRef(new Audio());
  const sleepTimerRef = useRef(null);
  const fallbackTriedRef = useRef(false);

  const currentSurah = getSurahById(currentSurahId);
  const currentReciter = getReciterById(currentReciterId);
  const activeVisual = BACKGROUND_VISUALS.find(v => v.id === activeVisualId) || BACKGROUND_VISUALS[0];

  // Set Quran recitation volume
  const setQuranVolume = (val) => {
    const v = Math.max(0, Math.min(1, val));
    setQuranVolumeState(v);
    if (audioElementRef.current) {
      audioElementRef.current.volume = isQuranMuted ? 0 : v;
    }
  };

  const toggleMuteQuran = () => {
    setIsQuranMuted(prev => {
      const next = !prev;
      if (audioElementRef.current) {
        audioElementRef.current.volume = next ? 0 : quranVolume;
      }
      return next;
    });
  };

  // Set Ambient Sound & Volume
  const setAmbientSound = (soundId) => {
    setAmbientSoundState(soundId);
    if (isPlaying && soundId !== 'none' && !isAmbientMuted) {
      ambientSoundEngine.play(soundId);
      ambientSoundEngine.setVolume(ambientVolume);
    } else {
      ambientSoundEngine.play('none');
    }
  };

  const setAmbientVolume = (val) => {
    const v = Math.max(0, Math.min(1, val));
    setAmbientVolumeState(v);
    ambientSoundEngine.setVolume(v);
  };

  const toggleMuteAmbient = () => {
    setIsAmbientMuted(prev => {
      const next = !prev;
      ambientSoundEngine.setMuted(next);
      return next;
    });
  };

  // Skip time (+10s, -10s)
  const skipTime = (deltaSeconds) => {
    if (!audioElementRef.current || !duration) return;
    const target = Math.max(0, Math.min(duration, audioElementRef.current.currentTime + deltaSeconds));
    audioElementRef.current.currentTime = target;
    setCurrentTime(target);
  };

  // Seek
  const seek = (timeInSeconds) => {
    if (!audioElementRef.current || !duration) return;
    const target = Math.max(0, Math.min(duration, timeInSeconds));
    audioElementRef.current.currentTime = target;
    setCurrentTime(target);
  };

  // Play Next Surah
  const playNext = useCallback(() => {
    const nextId = currentSurahId < 114 ? currentSurahId + 1 : 1;
    playSurah(nextId, currentReciterId);
  }, [currentSurahId, currentReciterId]);

  // Play Previous Surah
  const playPrevious = useCallback(() => {
    // If more than 3 seconds in, restart current track
    if (currentTime > 3) {
      seek(0);
      return;
    }
    const prevId = currentSurahId > 1 ? currentSurahId - 1 : 114;
    playSurah(prevId, currentReciterId);
  }, [currentSurahId, currentReciterId, currentTime]);

  // Play a specific Surah
  const playSurah = (surahId, reciterId = currentReciterId) => {
    const sId = Number(surahId);
    setCurrentSurahId(sId);
    setCurrentReciterId(reciterId);
    setHasError(false);
    setErrorMessage('');
    setIsLoading(true);
    fallbackTriedRef.current = false;

    const reciter = getReciterById(reciterId);
    const { primaryUrl } = getSurahAudioUrl(reciter, sId);

    const audio = audioElementRef.current;
    audio.src = primaryUrl;
    audio.playbackRate = playbackRate;
    audio.volume = isQuranMuted ? 0 : quranVolume;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          recordPlayHistory(sId, reciterId);
          // Start ambient sound if selected
          if (ambientSound !== 'none' && !isAmbientMuted) {
            ambientSoundEngine.play(ambientSound);
            ambientSoundEngine.setVolume(ambientVolume);
          }
        })
        .catch((err) => {
          console.warn("Audio autoplay / play interrupted:", err);
          // May be autoplay policy or load error
          setIsLoading(false);
        });
    }
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    const audio = audioElementRef.current;
    if (!audio.src) {
      playSurah(currentSurahId, currentReciterId);
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      ambientSoundEngine.pause();
    } else {
      setIsLoading(true);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(false); // will be updated by 'play' event
            setIsPlaying(true);
            setIsLoading(false);
            if (ambientSound !== 'none' && !isAmbientMuted) {
              ambientSoundEngine.resume();
            }
          })
          .catch((err) => {
            console.error("Playback error:", err);
            setIsLoading(false);
          });
      }
    }
  };

  // Set Sleep Timer
  const setSleepTimer = (minutes) => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    if (!minutes || minutes <= 0) {
      setSleepTimerRemaining(null);
      return;
    }

    let remainingSeconds = minutes * 60;
    setSleepTimerRemaining(remainingSeconds);

    sleepTimerRef.current = setInterval(() => {
      remainingSeconds -= 1;
      setSleepTimerRemaining(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(sleepTimerRef.current);
        sleepTimerRef.current = null;
        setSleepTimerRemaining(null);
        // Pause playback gently
        if (audioElementRef.current) {
          audioElementRef.current.pause();
        }
        setIsPlaying(false);
        ambientSoundEngine.stopCurrent();
      }
    }, 1000);
  };

  // Setup Audio Event Listeners
  useEffect(() => {
    const audio = audioElementRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.buffered.length > 0 && audio.duration) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        setBufferedPercent((bufferedEnd / audio.duration) * 100);
      }
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      if (ambientSound !== 'none' && !isAmbientMuted) {
        ambientSoundEngine.play(ambientSound);
        ambientSoundEngine.setVolume(ambientVolume);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      ambientSoundEngine.pause();
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all' || autoPlayNext) {
        playNext();
      } else {
        setIsPlaying(false);
        ambientSoundEngine.stopCurrent();
      }
    };

    const handleError = (e) => {
      console.warn("Audio playback error encountered on primary URL:", audio.src, e);
      // Try fallback URL if primary fails
      if (!fallbackTriedRef.current) {
        fallbackTriedRef.current = true;
        const reciter = getReciterById(currentReciterId);
        const { fallbackUrl } = getSurahAudioUrl(reciter, currentSurahId);
        if (fallbackUrl && fallbackUrl !== audio.src) {
          console.info("Switching to verified backup CDN:", fallbackUrl);
          audio.src = fallbackUrl;
          audio.play().catch(err => {
            setHasError(true);
            setErrorMessage('Unable to stream this Surah audio. Please check your network connection.');
            setIsLoading(false);
            setIsPlaying(false);
          });
          return;
        }
      }

      setHasError(true);
      setErrorMessage('Audio stream unavailable. Please check your internet or select another reciter.');
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSurahId, currentReciterId, repeatMode, autoPlayNext, ambientSound, ambientVolume, isAmbientMuted, playNext]);

  // Update Playback Rate
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Synchronize MediaSession API for mobile lock screens and notifications
  useEffect(() => {
    if ('mediaSession' in navigator && currentSurah && currentReciter) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: `Surah ${currentSurah.name_en} (${currentSurah.name_ar})`,
        artist: currentReciter.name_en,
        album: 'The Holy Quran',
        artwork: [
          { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
      navigator.mediaSession.setActionHandler('seekbackward', () => skipTime(-10));
      navigator.mediaSession.setActionHandler('seekforward', () => skipTime(10));
    }
  }, [currentSurah, currentReciter, isPlaying, playNext, playPrevious]);

  return (
    <AudioContext.Provider
      value={{
        currentSurah,
        currentSurahId,
        currentReciter,
        currentReciterId,
        isPlaying,
        isLoading,
        hasError,
        errorMessage,
        currentTime,
        duration,
        bufferedPercent,
        playbackRate,
        setPlaybackRate,
        repeatMode,
        setRepeatMode,
        autoPlayNext,
        setAutoPlayNext,
        quranVolume,
        setQuranVolume,
        isQuranMuted,
        toggleMuteQuran,
        ambientSound,
        setAmbientSound,
        ambientVolume,
        setAmbientVolume,
        isAmbientMuted,
        toggleMuteAmbient,
        activeVisual,
        activeVisualId,
        setActiveVisualId,
        isFullScreenOpen,
        openFullScreen: () => setIsFullScreenOpen(true),
        closeFullScreen: () => setIsFullScreenOpen(false),
        playSurah,
        togglePlayPause,
        seek,
        skipTime,
        playNext,
        playPrevious,
        sleepTimerRemaining,
        setSleepTimer,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
