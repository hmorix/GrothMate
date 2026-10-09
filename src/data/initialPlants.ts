import { Plant } from '../types';

export const INITIAL_PLANTS: Plant[] = [
  {
    id: 'plant-1',
    name: 'Sweet Basil',
    variety: 'Genovese Large Leaf',
    scientificName: 'Ocimum basilicum',
    spaceType: 'balcony',
    sunlight: 'full_sun',
    plantedDate: '2026-09-15',
    currentStage: 'growing',
    targetHarvestDays: 35,
    expectedHarvestDate: '2026-10-20',
    waterNeed: 'moderate',
    lastWateredDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], // 2 days ago
    wateringIntervalDays: 3,
    containerSizeLitres: 5,
    soilRequirement: 'Loose organic potting soil with perlite',
    imageUrl: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=600&q=80',
    notes: 'Smells wonderful on the morning balcony. Pinching central stems to make it bushy.',
    companionPlants: ['Tomato', 'Pepper'],
    incompatiblePlants: ['Rue'],
    observations: [
      {
        id: 'obs-1',
        date: '2026-09-18',
        stage: 'seedling',
        note: 'First pair of true leaves emerged! Healthy bright emerald green.',
        heightCm: 3
      },
      {
        id: 'obs-2',
        date: '2026-10-02',
        stage: 'growing',
        note: 'Pruned top pair of leaves to induce branching. Branching stems already visible.',
        heightCm: 14
      }
    ],
    harvests: []
  },
  {
    id: 'plant-2',
    name: 'Cherry Tomato',
    variety: 'Sweet 100',
    scientificName: 'Solanum lycopersicum',
    spaceType: 'terrace',
    sunlight: 'full_sun',
    plantedDate: '2026-08-20',
    currentStage: 'flowering',
    targetHarvestDays: 65,
    expectedHarvestDate: '2026-10-25',
    waterNeed: 'moderate',
    lastWateredDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], // 3 days ago (needs watering!)
    wateringIntervalDays: 3,
    containerSizeLitres: 15,
    soilRequirement: 'Deep rich compost mix with crushed eggshells (calcium)',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
    notes: 'Tied to bamboo cane trellis. Yellow flower clusters looking vigorous.',
    companionPlants: ['Basil', 'Marigold'],
    incompatiblePlants: ['Potato', 'Fennel'],
    observations: [
      {
        id: 'obs-201',
        date: '2026-09-01',
        stage: 'growing',
        note: 'Main vine reached 40cm. Staked with garden bamboo.',
        heightCm: 40
      },
      {
        id: 'obs-202',
        date: '2026-09-28',
        stage: 'flowering',
        note: 'Yellow blossoms open! Bees noticed buzzing around them.',
        heightCm: 68
      }
    ],
    harvests: []
  },
  {
    id: 'plant-3',
    name: 'Cherry Belle Radish',
    variety: 'Fast Round',
    scientificName: 'Raphanus sativus',
    spaceType: 'pots',
    sunlight: 'partial_shade',
    plantedDate: '2026-09-20',
    currentStage: 'fruiting',
    targetHarvestDays: 24,
    expectedHarvestDate: '2026-10-14',
    waterNeed: 'moderate',
    lastWateredDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // Yesterday
    wateringIntervalDays: 2,
    containerSizeLitres: 4,
    soilRequirement: 'Loose sandy potting mix',
    imageUrl: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=600&q=80',
    notes: 'Bright red bulb shoulders are peeking above soil line! Harvest expected in a few days.',
    companionPlants: ['Lettuce', 'Spinach'],
    observations: [
      {
        id: 'obs-301',
        date: '2026-09-24',
        stage: 'seedling',
        note: 'Germinated quickly in 4 days.',
        heightCm: 4
      }
    ],
    harvests: []
  }
];
