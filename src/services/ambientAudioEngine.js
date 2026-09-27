/**
 * Ambient Soundscapes Engine using the Web Audio API.
 * 100% Royalty-Free, zero-network, offline-capable procedural sound generator.
 * Provides peaceful Rain, Ocean Waves, Night Wind, Stream Water, and Calm Ambience.
 */

class AmbientSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.currentSound = 'none';
    this.volume = 0.25; // Default modest background volume so Quran is prioritized
    this.isMuted = false;
    this.nodes = [];
    this.lfoInterval = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.audioCtx) {
      const target = this.isMuted ? 0 : this.volume * 0.4; // Max ambient sound capped at 0.4 so it never overpowers recitation
      this.masterGain.gain.setTargetAtTime(target, this.audioCtx.currentTime, 0.05);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    this.setVolume(this.volume);
  }

  stopCurrent() {
    if (this.lfoInterval) {
      clearInterval(this.lfoInterval);
      this.lfoInterval = null;
    }
    this.nodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
    });
    this.nodes = [];
  }

  // Create White/Pink/Brown Noise Buffer
  createNoiseBuffer(type = 'pink') {
    const bufferSize = this.audioCtx.sampleRate * 5; // 5 seconds looped buffer
    const buffer = this.audioCtx.createBuffer(2, bufferSize, this.audioCtx.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'brown') {
          // Brown noise (deep rumble/rain)
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else if (type === 'pink') {
          // Pink noise (natural wind/ocean)
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        } else {
          // White noise
          data[i] = white * 0.2;
        }
      }
    }
    return buffer;
  }

  playRain() {
    this.stopCurrent();
    const noiseBuffer = this.createNoiseBuffer('brown');
    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Filter for gentle rain frequency
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;

    const highpass = this.audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 180;

    source.connect(highpass);
    highpass.connect(filter);
    filter.connect(this.masterGain);

    source.start();
    this.nodes.push(source, highpass, filter);
  }

  playOcean() {
    this.stopCurrent();
    const noiseBuffer = this.createNoiseBuffer('pink');
    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Swelling filter for wave motion
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 1.0;

    // LFO to modulate wave rhythm
    const waveGain = this.audioCtx.createGain();
    waveGain.gain.value = 0.3;

    source.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    let phase = 0;
    this.lfoInterval = setInterval(() => {
      if (!this.audioCtx || this.audioCtx.state !== 'running') return;
      phase += 0.05;
      const freq = 300 + Math.sin(phase * 0.4) * 220;
      const gainVal = 0.2 + (Math.sin(phase * 0.4) + 1) * 0.35;
      filter.frequency.setTargetAtTime(freq, this.audioCtx.currentTime, 0.1);
      waveGain.gain.setTargetAtTime(gainVal, this.audioCtx.currentTime, 0.1);
    }, 100);

    source.start();
    this.nodes.push(source, filter, waveGain);
  }

  playWind() {
    this.stopCurrent();
    const noiseBuffer = this.createNoiseBuffer('pink');
    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 650;
    filter.Q.value = 3.5;

    const windGain = this.audioCtx.createGain();
    windGain.gain.value = 0.3;

    source.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);

    let phase = 0;
    this.lfoInterval = setInterval(() => {
      if (!this.audioCtx || this.audioCtx.state !== 'running') return;
      phase += 0.04;
      const freq = 500 + Math.sin(phase * 0.6) * 350 + Math.cos(phase * 1.3) * 150;
      filter.frequency.setTargetAtTime(freq, this.audioCtx.currentTime, 0.1);
    }, 120);

    source.start();
    this.nodes.push(source, filter, windGain);
  }

  playStream() {
    this.stopCurrent();
    const noiseBuffer = this.createNoiseBuffer('pink');
    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter1 = this.audioCtx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.value = 1200;
    filter1.Q.value = 2.0;

    const streamGain = this.audioCtx.createGain();
    streamGain.gain.value = 0.35;

    source.connect(filter1);
    filter1.connect(streamGain);
    streamGain.connect(this.masterGain);

    source.start();
    this.nodes.push(source, filter1, streamGain);
  }

  playNight() {
    this.stopCurrent();

    // 1. Soft nocturnal breeze (pink noise through high-Q bandpass)
    const noiseBuffer = this.createNoiseBuffer('pink');
    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const breezeFilter = this.audioCtx.createBiquadFilter();
    breezeFilter.type = 'bandpass';
    breezeFilter.frequency.value = 420;
    breezeFilter.Q.value = 2.5;

    const breezeGain = this.audioCtx.createGain();
    breezeGain.gain.value = 0.16;

    source.connect(breezeFilter);
    breezeFilter.connect(breezeGain);
    breezeGain.connect(this.masterGain);
    source.start();
    this.nodes.push(source, breezeFilter, breezeGain);

    // 2. Warm harmonic celestial drone
    const droneOsc = this.audioCtx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.value = 130.81; // C3
    const droneGain = this.audioCtx.createGain();
    droneGain.gain.value = 0.04;
    droneOsc.connect(droneGain);
    droneGain.connect(this.masterGain);
    droneOsc.start();
    this.nodes.push(droneOsc, droneGain);

    // 3. Delicate rhythmic crickets (high frequency pulsed chirp)
    const cricketSource = this.audioCtx.createBufferSource();
    cricketSource.buffer = noiseBuffer;
    cricketSource.loop = true;

    const cricketFilter = this.audioCtx.createBiquadFilter();
    cricketFilter.type = 'bandpass';
    cricketFilter.frequency.value = 4600;
    cricketFilter.Q.value = 9.0;

    const cricketGain = this.audioCtx.createGain();
    cricketGain.gain.value = 0.0;

    cricketSource.connect(cricketFilter);
    cricketFilter.connect(cricketGain);
    cricketGain.connect(this.masterGain);
    cricketSource.start();
    this.nodes.push(cricketSource, cricketFilter, cricketGain);

    // Rhythmic chirp pulse cycle (chirp-chirp-chirp... pause)
    let chirpCycle = 0;
    this.lfoInterval = setInterval(() => {
      if (!this.audioCtx || this.audioCtx.state !== 'running') return;
      chirpCycle = (chirpCycle + 1) % 18;
      const isChirping = [1, 2, 3, 5, 6, 7].includes(chirpCycle);
      const targetGain = isChirping ? 0.075 : 0.002;
      cricketGain.gain.setTargetAtTime(targetGain, this.audioCtx.currentTime, 0.025);
    }, 110);
  }

  playFire() {
    this.stopCurrent();

    // 1. Warm low rumble of combustion (brown noise through lowpass)
    const noiseBuffer = this.createNoiseBuffer('brown');
    const rumbleSource = this.audioCtx.createBufferSource();
    rumbleSource.buffer = noiseBuffer;
    rumbleSource.loop = true;

    const rumbleFilter = this.audioCtx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 260;

    const rumbleGain = this.audioCtx.createGain();
    rumbleGain.gain.value = 0.22;

    rumbleSource.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(this.masterGain);
    rumbleSource.start();
    this.nodes.push(rumbleSource, rumbleFilter, rumbleGain);

    // 2. High-frequency crackles, pops, and wood snapping
    const crackleSource = this.audioCtx.createBufferSource();
    crackleSource.buffer = this.createNoiseBuffer('pink');
    crackleSource.loop = true;

    const crackleFilter = this.audioCtx.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.value = 3200;
    crackleFilter.Q.value = 4.5;

    const crackleGain = this.audioCtx.createGain();
    crackleGain.gain.value = 0.02;

    crackleSource.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(this.masterGain);
    crackleSource.start();
    this.nodes.push(crackleSource, crackleFilter, crackleGain);

    // Random impulsive wood snaps and crackles
    this.lfoInterval = setInterval(() => {
      if (!this.audioCtx || this.audioCtx.state !== 'running') return;
      const isPop = Math.random() < 0.35;
      const popGain = isPop ? 0.12 + Math.random() * 0.22 : 0.01;
      const freq = 2000 + Math.random() * 2500;
      crackleFilter.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      crackleGain.gain.setTargetAtTime(popGain, this.audioCtx.currentTime, 0.015);
    }, 90);
  }

  playCalmPad() {
    this.stopCurrent();
    // Warm harmonic soft drone / peaceful ambient pad (C & G harmonic chord)
    const freqs = [130.81, 196.00, 261.63, 329.63]; // C3, G3, C4, E4
    const padGain = this.audioCtx.createGain();
    padGain.gain.value = 0.12;
    padGain.connect(this.masterGain);

    freqs.forEach(f => {
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;

      const subGain = this.audioCtx.createGain();
      subGain.gain.value = 0.25;

      osc.connect(subGain);
      subGain.connect(padGain);
      osc.start();
      this.nodes.push(osc, subGain);
    });

    this.nodes.push(padGain);
  }

  play(soundId) {
    this.init();
    this.currentSound = soundId;
    switch (soundId) {
      case 'rain':
        this.playRain();
        break;
      case 'ocean':
        this.playOcean();
        break;
      case 'wind':
        this.playWind();
        break;
      case 'stream':
        this.playStream();
        break;
      case 'fire':
        this.playFire();
        break;
      case 'night':
        this.playNight();
        break;
      case 'pad':
        this.playCalmPad();
        break;
      case 'none':
      default:
        this.stopCurrent();
        break;
    }
  }

  pause() {
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend();
    }
  }

  resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }
}

export const ambientSoundEngine = new AmbientSoundEngine();
