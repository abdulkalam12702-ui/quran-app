// Cinematic Looping Video Background Environments for Full-Screen Quran Player

export const ENVIRONMENTS = [
  {
    id: "rain",
    name: "Rain",
    icon: "CloudRain",
    tagline: "Realistic falling rain & misty atmosphere",
    description: "Cinematic rainfall in a peaceful natural environment with moving clouds and mist",
    videoSrc: "/environments/rain.mp4",
    poster: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=260&q=80",
    ambientSound: "rain",
    ambientName: "Peaceful Rain",
    accentColor: "#38bdf8",
  },
  {
    id: "mountains",
    name: "Misty Mountains",
    icon: "Mountain",
    tagline: "Slowly drifting clouds & serene peaks",
    description: "Cinematic mountain landscape with clouds moving slowly through peaceful valleys",
    videoSrc: "/environments/mountains.mp4",
    poster: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=260&q=80",
    ambientSound: "wind",
    ambientName: "Mountain Wind",
    accentColor: "#60a5fa",
  },
  {
    id: "forest",
    name: "Forest",
    icon: "Trees",
    tagline: "Swaying branches & sunlight through trees",
    description: "Real forest trees with leaves swaying in a gentle breeze and sunlight filtering through",
    videoSrc: "/environments/forest.mp4",
    poster: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=260&q=80",
    ambientSound: "stream",
    ambientName: "Forest Stream & Breeze",
    accentColor: "#34d399",
  },
  {
    id: "ocean",
    name: "Ocean",
    icon: "Waves",
    tagline: "Rolling waves & shimmering water reflections",
    description: "Cinematic ocean waves continuously rolling toward the shore with natural sunlight",
    videoSrc: "/environments/ocean.mp4",
    poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=260&q=80",
    ambientSound: "ocean",
    ambientName: "Ocean Waves",
    accentColor: "#2dd4bf",
  },
  {
    id: "fire",
    name: "Fire",
    icon: "Flame",
    tagline: "Dancing campfire flames & glowing embers",
    description: "Realistic crackling fire with glowing embers, gentle smoke, and warm lighting",
    videoSrc: "/environments/fire.mp4",
    poster: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=260&q=80",
    ambientSound: "fire",
    ambientName: "Fire Crackling",
    accentColor: "#f97316",
  },
  {
    id: "night",
    name: "Night / Crickets",
    icon: "Moon",
    tagline: "Luminous full moon & tranquil night clouds",
    description: "Realistic peaceful night sky with a full moon shining through slowly drifting clouds and nocturnal crickets ambience",
    videoSrc: "/environments/night.mp4",
    poster: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=260&q=80",
    ambientSound: "night",
    ambientName: "Night Crickets & Breeze",
    accentColor: "#818cf8",
  },
  {
    id: "sunset",
    name: "Sunset",
    icon: "Sunset",
    tagline: "Golden sunset & moving twilight clouds",
    description: "Realistic cinematic sunset with slowly moving clouds and warm atmospheric haze",
    videoSrc: "/environments/sunset.mp4",
    poster: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=260&q=80",
    ambientSound: "wind",
    ambientName: "Sunset Breeze",
    accentColor: "#fbbf24",
  }
];

export const DEFAULT_ENVIRONMENT_ID = "rain";

// Mapping environment id to ambient sound
export const ENVIRONMENT_AMBIENT_MAP = {
  rain: "rain",
  mountains: "wind",
  forest: "stream",
  nature: "stream",
  ocean: "ocean",
  fire: "fire",
  night: "night",
  sunset: "wind",
};

export const getEnvironmentById = (id) => {
  if (id === 'nature') id = 'forest';
  return ENVIRONMENTS.find((e) => e.id === id) || ENVIRONMENTS[0];
};

// Backward-compatibility export for existing components
export const BACKGROUND_VISUALS = ENVIRONMENTS.map(e => ({
  ...e,
  baseImage: e.poster,
  url: e.poster,
}));
