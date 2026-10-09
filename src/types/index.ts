export type GrowthStage = 'planned' | 'seedling' | 'growing' | 'flowering' | 'fruiting' | 'harvested';

export type GardenSpaceType = 'pots' | 'balcony' | 'terrace' | 'backyard' | 'indoor' | 'community';

export type SunlightExposure = 'full_sun' | 'partial_shade' | 'deep_shade';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';

export type WaterNeedLevel = 'low' | 'moderate' | 'high';

export interface PlantObservation {
  id: string;
  date: string;
  note: string;
  photoUrl?: string;
  stage: GrowthStage;
  heightCm?: number;
}

export interface HarvestRecord {
  id: string;
  date: string;
  quantity: string;
  notes?: string;
  rating?: number;
}

export interface Plant {
  id: string;
  name: string;
  variety: string;
  scientificName?: string;
  spaceType: GardenSpaceType;
  sunlight: SunlightExposure;
  plantedDate: string;
  currentStage: GrowthStage;
  targetHarvestDays: number;
  expectedHarvestDate: string;
  waterNeed: WaterNeedLevel;
  lastWateredDate: string;
  wateringIntervalDays: number;
  containerSizeLitres?: number;
  notes?: string;
  imageUrl: string;
  isAiRecommended?: boolean;
  companionPlants?: string[];
  incompatiblePlants?: string[];
  soilRequirement?: string;
  observations: PlantObservation[];
  harvests: HarvestRecord[];
}

export interface WeatherData {
  city: string;
  country: string;
  temperatureC: number;
  humidity: number;
  weatherCode: number;
  weatherDescription: string;
  precipitationMm: number;
  forecastRainNext24hMm: number;
  uvIndex: number;
  windSpeedKmh: number;
  forecastDays: {
    date: string;
    tempMax: number;
    tempMin: number;
    rainProbability: number;
    precipitationMm: number;
    weatherCode: number;
    description: string;
  }[];
}

export interface WeeklyMission {
  id: string;
  title: string;
  description: string;
  category: 'touch_grass' | 'plant_care' | 'observation' | 'biodiversity' | 'soil_health';
  xpPoints: number;
  icon: string;
  isCompleted: boolean;
  completedAt?: string;
  proofNote?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface PlantDoctorDiagnosis {
  plantName: string;
  suspectedIssue: string;
  confidenceScore: number; // e.g. 85 for 85%
  isAiGenerated: boolean;
  severity: 'low' | 'medium' | 'high';
  symptomsIdentified: string[];
  possibleCauses: string[];
  safeOrganicRemedies: string[];
  preventionAdvice: string[];
  disclaimer: string;
}

export type AiProviderType = 'google_gemini' | 'huggingface' | 'deterministic_rules';

export interface AppSettings {
  aiProvider: AiProviderType;
  googleApiKey: string;
  huggingFaceApiKey?: string;
  huggingFaceModel?: string;
  selectedCity: string;
  selectedCountry: string;
  latitude: number;
  longitude: number;
  weatherProvider: 'open_meteo';
  mapProvider: 'openstreetmap' | 'google_maps';
  googleMapsApiKey?: string;
  enableOverwateringWarnings: boolean;
}

export interface UserProfile {
  name: string;
  city: string;
  country: string;
  gardenType: GardenSpaceType;
  sunlight: SunlightExposure;
  experience: ExperienceLevel;
  streakDays: number;
  totalXp: number;
  onboarded: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isAiGenerated?: boolean;
  structuredPlan?: RecommendedPlantPlan;
}

export interface RecommendedPlantPlan {
  cropName: string;
  variety: string;
  plantingSeason: string;
  sunlightNeeded: string;
  soilNeeds: string;
  spacingCm: number;
  daysToHarvest: number;
  difficulty: 'easy' | 'medium' | 'hard';
  whyRecommended: string;
  wateringGuideline: string;
  verifiedSource?: string;
}
