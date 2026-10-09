import { WeeklyMission, Badge } from '../types';

export const DEFAULT_MISSIONS: WeeklyMission[] = [
  {
    id: 'm-1',
    title: 'Touch Real Soil & Check Moisture',
    description: 'Walk out to your pots or garden bed. Insert your index finger 2 inches into the soil. Observe if it feels cool, moist, or dry before touching a hose.',
    category: 'touch_grass',
    xpPoints: 50,
    icon: '🌱',
    isCompleted: false
  },
  {
    id: 'm-2',
    title: '5-Minute Silent Plant Observation',
    description: 'Sit beside one of your plants for 5 undisturbed minutes with no phone or screen. Watch the leaf veins, examine new shoots, and listen to the birds.',
    category: 'observation',
    xpPoints: 75,
    icon: '🧘',
    isCompleted: false
  },
  {
    id: 'm-3',
    title: 'Gentle Pruning & Deadheading',
    description: 'Carefully snip off dry, yellowing lower foliage or spent flowers with clean scissors to redirect energy to tender new growth.',
    category: 'plant_care',
    xpPoints: 60,
    icon: '✂️',
    isCompleted: false
  },
  {
    id: 'm-4',
    title: 'Start a Kitchen Scrap Compost Bin',
    description: 'Collect vegetable peelings, banana peels, and coffee grounds in a bucket with dry brown leaves or cardboard shreds instead of landfilling them.',
    category: 'soil_health',
    xpPoints: 100,
    icon: '🍂',
    isCompleted: false
  },
  {
    id: 'm-5',
    title: 'Sow 3 Fresh Herb Seeds',
    description: 'Plant three basil, coriander, or mint seeds in a small pot with moist potting mix. Gently cover with 0.5cm of soil and mist with water.',
    category: 'touch_grass',
    xpPoints: 80,
    icon: '🌿',
    isCompleted: false
  },
  {
    id: 'm-6',
    title: 'Document Growth with a Photo',
    description: 'Capture a progress photo of a growing seedling or blooming flower. Log it into your Seed-to-Harvest tracker.',
    category: 'observation',
    xpPoints: 50,
    icon: '📸',
    isCompleted: false
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b-grass',
    title: 'Grass Toucher',
    description: 'Logged your first real-world garden moisture test with bare hands.',
    icon: '🌾',
    isUnlocked: true,
    unlockedAt: '2026-10-01'
  },
  {
    id: 'b-seedling',
    title: 'Green Sprout',
    description: 'Planted your first crop in GrowMate AI.',
    icon: '🌱',
    isUnlocked: true,
    unlockedAt: '2026-10-02'
  },
  {
    id: 'b-hydrator',
    title: 'Conscious Hydrator',
    description: 'Checked rain forecast and avoided overwatering an outdoor plant.',
    icon: '💧',
    isUnlocked: false
  },
  {
    id: 'b-streak-3',
    title: 'Nature Ritual (3-Day Streak)',
    description: 'Spent time tending plants 3 days in a row.',
    icon: '🔥',
    isUnlocked: false
  },
  {
    id: 'b-harvest',
    title: 'Bountiful Harvest',
    description: 'Logged your very first homegrown harvest record.',
    icon: '🧺',
    isUnlocked: false
  },
  {
    id: 'b-compost',
    title: 'Circular Soil Master',
    description: 'Recycled organic matter back into nutrient-rich compost.',
    icon: '♻️',
    isUnlocked: false
  }
];
