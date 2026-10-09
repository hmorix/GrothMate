import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Plant,
  WeatherData,
  WeeklyMission,
  Badge,
  AppSettings,
  UserProfile,
  GrowthStage,
  PlantObservation,
  HarvestRecord
} from '../types';
import { INITIAL_PLANTS } from '../data/initialPlants';
import { DEFAULT_MISSIONS, INITIAL_BADGES } from '../data/defaultMissions';
import { WeatherService } from '../services/weatherService';
import confetti from 'canvas-confetti';

interface GardenContextType {
  plants: Plant[];
  weather: WeatherData | null;
  missions: WeeklyMission[];
  badges: Badge[];
  settings: AppSettings;
  profile: UserProfile;
  isWeatherLoading: boolean;
  addPlant: (plant: Omit<Plant, 'id' | 'observations' | 'harvests'>) => void;
  updatePlant: (id: string, updates: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  waterPlant: (id: string) => void;
  addObservation: (plantId: string, obs: Omit<PlantObservation, 'id'>) => void;
  addHarvest: (plantId: string, harvest: Omit<HarvestRecord, 'id'>) => void;
  completeMission: (missionId: string, proofNote?: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  refreshWeather: () => Promise<void>;
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

const STORAGE_KEY = 'growmate_garden_state_v1';

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or use defaults
  const [plants, setPlants] = useState<Plant[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plants`);
    return saved ? JSON.parse(saved) : INITIAL_PLANTS;
  });

  const [missions, setMissions] = useState<WeeklyMission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_missions`);
    return saved ? JSON.parse(saved) : DEFAULT_MISSIONS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_badges`);
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    const envKey = (import.meta as any).env?.VITE_GOOGLE_API_KEY || '';
    const defaultSettings: AppSettings = {
      aiProvider: envKey ? 'google_gemini' : 'deterministic_rules',
      googleApiKey: envKey,
      selectedCity: 'New Delhi',
      selectedCountry: 'India',
      latitude: 28.6139,
      longitude: 77.2090,
      weatherProvider: 'open_meteo',
      mapProvider: 'openstreetmap',
      enableOverwateringWarnings: true
    };
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
    return saved ? JSON.parse(saved) : {
      name: 'Eco Gardener',
      city: 'New Delhi',
      country: 'India',
      gardenType: 'balcony',
      sunlight: 'full_sun',
      experience: 'beginner',
      streakDays: 4,
      totalXp: 350,
      onboarded: true
    };
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_plants`, JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_missions`, JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_badges`, JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  // Load weather when coordinates or city change
  const refreshWeather = async () => {
    setIsWeatherLoading(true);
    try {
      const data = await WeatherService.fetchWeather(
        settings.latitude,
        settings.longitude,
        settings.selectedCity,
        settings.selectedCountry
      );
      setWeather(data);
    } catch (err) {
      console.warn("Weather fetch failed:", err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    refreshWeather();
  }, [settings.latitude, settings.longitude, settings.selectedCity]);

  // Plant Actions
  const addPlant = (newPlantData: Omit<Plant, 'id' | 'observations' | 'harvests'>) => {
    const id = `plant-${Date.now()}`;
    const newPlant: Plant = {
      ...newPlantData,
      id,
      observations: [
        {
          id: `obs-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          stage: newPlantData.currentStage,
          note: `Planted in ${newPlantData.spaceType}. Ready to start growing!`
        }
      ],
      harvests: []
    };
    setPlants(prev => [newPlant, ...prev]);

    // Check sprout badge
    unlockBadge('b-seedling');
  };

  const updatePlant = (id: string, updates: Partial<Plant>) => {
    setPlants(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePlant = (id: string) => {
    setPlants(prev => prev.filter(p => p.id !== id));
  };

  const waterPlant = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setPlants(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          lastWateredDate: today
        };
      }
      return p;
    }));

    // Trigger celebration & check water badge
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3ba750', '#62c375', '#38bdf8']
    });

    unlockBadge('b-hydrator');
  };

  const addObservation = (plantId: string, obs: Omit<PlantObservation, 'id'>) => {
    const observation: PlantObservation = {
      ...obs,
      id: `obs-${Date.now()}`
    };
    setPlants(prev => prev.map(p => {
      if (p.id === plantId) {
        return {
          ...p,
          currentStage: obs.stage,
          observations: [observation, ...p.observations]
        };
      }
      return p;
    }));
  };

  const addHarvest = (plantId: string, harvest: Omit<HarvestRecord, 'id'>) => {
    const record: HarvestRecord = {
      ...harvest,
      id: `harvest-${Date.now()}`
    };
    setPlants(prev => prev.map(p => {
      if (p.id === plantId) {
        return {
          ...p,
          currentStage: 'harvested',
          harvests: [record, ...p.harvests]
        };
      }
      return p;
    }));

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#fb7185', '#3ba750']
    });

    unlockBadge('b-harvest');
  };

  const completeMission = (missionId: string, proofNote?: string) => {
    let earnedXp = 0;
    setMissions(prev => prev.map(m => {
      if (m.id === missionId && !m.isCompleted) {
        earnedXp = m.xpPoints;
        return {
          ...m,
          isCompleted: true,
          completedAt: new Date().toISOString(),
          proofNote: proofNote || 'Completed outdoors in nature.'
        };
      }
      return m;
    }));

    if (earnedXp > 0) {
      setProfile(p => ({
        ...p,
        totalXp: p.totalXp + earnedXp,
        streakDays: p.streakDays + 1
      }));

      // Fire victory confetti!
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#2c873f', '#97dca5', '#ba7f4f']
      });

      unlockBadge('b-grass');
      if (missionId === 'm-4') unlockBadge('b-compost');
    }
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => prev.map(b => {
      if (b.id === badgeId && !b.isUnlocked) {
        return {
          ...b,
          isUnlocked: true,
          unlockedAt: new Date().toISOString().split('T')[0]
        };
      }
      return b;
    }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  return (
    <GardenContext.Provider
      value={{
        plants,
        weather,
        missions,
        badges,
        settings,
        profile,
        isWeatherLoading,
        addPlant,
        updatePlant,
        deletePlant,
        waterPlant,
        addObservation,
        addHarvest,
        completeMission,
        updateSettings,
        updateProfile,
        refreshWeather
      }}
    >
      {children}
    </GardenContext.Provider>
  );
};

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
};
