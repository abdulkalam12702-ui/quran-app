# Quran - Modern Quran Audio & Recitation Application

A complete, modern Quran audio application designed for mobile devices (Android & iOS), tablets, and desktop. Built with React 19, Vite, Tailwind CSS, Lucide icons, and Web Audio API ambient soundscapes.

## Features

- **All 114 Surahs**: Complete authentic Holy Quran metadata with Arabic calligraphy names, transliterations, English meanings, verse counts, and Meccan/Medinan tags.
- **World-Renowned Qaris & Reciters**: High-definition audio streams for Mishary Rashid Alafasy, AbdulBaset AbdulSamad, Maher Al-Muaiqly, Mahmoud Khalil Al-Husary, Muhammad Siddiq Al-Minshawi, Yasser Al-Dosari, Saad Al-Ghamdi, Abu Bakr Al-Shatri, Saud Al-Shuraim, Nasser Al-Qatami, Ali Jaber, and Hani Ar-Rifai.
- **Immersive Full-Screen Player**: Peaceful background visuals (misty mountains, sunset clouds, starry night sky, mosque silhouettes, desert dunes, calm ocean) with smooth transitions, dark transparent overlay, and large touch-friendly controls.
- **Separate Dual Audio Volume Controls**: Independent volume sliders for **Quran Recitation** and **Background Ambient Sound** (Gentle Rain, Ocean Waves, Night Breeze, Forest Stream, Serenity Tone) powered by zero-network procedural Web Audio synthesis.
- **Mini Player**: Floating mini-player above bottom navigation that allows continuous audio playback while exploring the app.
- **PWA (Progressive Web App)**: Installable on Android & iOS home screens with offline caching of app shell, manifest, and service worker.
- **Instant Search & Filters**: Search by Arabic name, English name, transliteration, or Surah number.
- **Favorites & History**: Save favorite Surahs and Reciters, with local persistence and recently played history.
- **MediaSession API**: Native mobile lock screen and notification shade controls (play, pause, next, previous, seek).
- **Themes & Arabic Typography**: Dark Navy, OLED Obsidian Black, Islamic Emerald, and Clean Light themes with adjustable Arabic calligraphy sizes.

## How to Start the Application

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev -- --host

# 3. Build for production
npm run build
```

## How to Test on Mobile Phone

1. Make sure your phone is connected to the same Wi-Fi network as your computer.
2. Look at the Vite output network address: `http://<your-local-ip>:5173/` (e.g. `http://10.49.173.1:5173/`).
3. Open that address in Chrome on Android or Safari on iPhone.
4. Tap the browser menu and select **"Add to Home Screen"** or **"Install App"**.

## Converting to a Native Android APK

To package this application into a native Android APK:
1. Run `npm run build` to generate the `/dist` directory.
2. Install Capacitor:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "Quran" "com.quran.audio" --web-dir dist
   npx cap add android
   npx cap sync
   ```
3. Open in Android Studio:
   ```bash
   npx cap open android
   ```
4. Build APK or Signed Bundle (`Build > Build Bundle(s) / APK(s) > Build APK(s)`).
