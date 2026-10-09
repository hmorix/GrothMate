import React, { useState } from 'react';
import { useGarden } from '../context/GardenContext';
import { PlantCard } from '../components/garden/PlantCard';
import { PlantTimeline } from '../components/garden/PlantTimeline';
import { Modal } from '../components/common/Modal';
import { AddPlantModal } from '../components/garden/AddPlantModal';
import { Plant, GrowthStage } from '../types';
import { 
  Sprout, 
  Droplets, 
  Sun, 
  Flame, 
  Plus, 
  Sparkles, 
  Compass, 
  Calendar, 
  AlertCircle, 
  ArrowRight,
  CloudRain,
  CheckCircle2
} from 'lucide-react';
import { WateringEngine } from '../services/wateringEngine';

interface DashboardPageProps {
  setCurrentTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setCurrentTab }) => {
  const { 
    plants, 
    weather, 
    missions, 
    badges, 
    profile, 
    waterPlant, 
    addPlant, 
    updatePlant, 
    deletePlant, 
    addObservation, 
    addHarvest,
    completeMission 
  } = useGarden();

  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Compute plants requiring water today
  const wateringList = weather 
    ? plants.map(p => ({ plant: p, advice: WateringEngine.evaluatePlantWatering(p, weather) }))
    : [];

  const plantsNeedingWater = wateringList.filter(item => item.advice.shouldWaterToday);
  const activeMission = missions.find(m => !m.isCompleted) || missions[0];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl text-slate-900">
              Welcome back, {profile.name} 🌱
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-nature-100 text-nature-800 capitalize">
              {profile.experience}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Garden hub set for <strong>{profile.city}</strong> ({profile.gardenType} garden, {profile.sunlight.replace('_', ' ')})
          </p>
        </div>

        {/* Quick CTA Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-nature-600 hover:bg-nature-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Plant</span>
          </button>
          
          <button
            onClick={() => setCurrentTab('planner')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>Plan Next Season</span>
          </button>
        </div>
      </div>

      {/* 4 Key Stat Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Crops */}
        <div 
          onClick={() => setCurrentTab('garden')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Crops</span>
            <div className="w-8 h-8 rounded-xl bg-nature-50 text-nature-700 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900 mt-2">{plants.length}</p>
          <p className="text-[11px] text-nature-700 mt-1 flex items-center gap-1">
            <span>View all in My Garden</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Need Water Today */}
        <div 
          onClick={() => setCurrentTab('weather-water')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Hydration Needed</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900 mt-2">{plantsNeedingWater.length}</p>
          <p className="text-[11px] text-sky-700 mt-1 flex items-center gap-1">
            <span>{plantsNeedingWater.length > 0 ? 'Watering advised today' : 'All plants hydrated'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Outdoor Streak */}
        <div 
          onClick={() => setCurrentTab('missions')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Touch Grass Streak</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900 mt-2">{profile.streakDays} Days</p>
          <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
            <span>{profile.totalXp} XP points earned</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Live Weather Forecast */}
        <div 
          onClick={() => setCurrentTab('weather-water')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Live Weather</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900 mt-2">
            {weather ? `${weather.temperatureC}°C` : '26°C'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {weather?.weatherDescription || 'Pleasant sunshine'}
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: My Active Plants */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-slate-900">Your Living Plants</h2>
              <span className="text-xs text-slate-500">({plants.length} total)</span>
            </div>
            <button
              onClick={() => setCurrentTab('garden')}
              className="text-xs font-semibold text-nature-700 hover:text-nature-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {plants.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <Sprout className="w-10 h-10 text-nature-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">Your garden is ready for its first seed!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your favorite herb or vegetable, or use the Garden Planner to get tailored recommendations for your climate.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-nature-600 text-white text-xs font-semibold shadow-xs"
              >
                Plant Your First Crop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plants.slice(0, 4).map(plant => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  weather={weather}
                  onSelect={setSelectedPlant}
                  onWater={waterPlant}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Today's Touch Grass Mission & Watering Queue */}
        <div className="space-y-6">
          
          {/* Active Weekly Mission */}
          {activeMission && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-3xl border border-amber-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900 uppercase tracking-wider flex items-center gap-1">
                  <span>Today's Outdoor Mission</span>
                </span>
                <span className="text-xs font-bold text-amber-800">+{activeMission.xpPoints} XP</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{activeMission.icon}</span>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">{activeMission.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{activeMission.description}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => completeMission(activeMission.id)}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Done in Real Life</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Weather Rain Alert */}
          {weather && weather.forecastRainNext24hMm > 2 && (
            <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 flex items-start gap-3 text-xs text-sky-900">
              <CloudRain className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Approaching Rain Alert ({weather.forecastRainNext24hMm.toFixed(1)}mm)</p>
                <p className="text-sky-700 mt-0.5">
                  Rain expected in {weather.city} within 24h. Outdoor pots will be naturally watered; skip manual hose watering today!
                </p>
              </div>
            </div>
          )}

          {/* Today's Watering Queue */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span>Today's Watering Advice</span>
              </h3>
              <span className="text-[11px] text-slate-500">{plantsNeedingWater.length} to drink</span>
            </div>

            {plantsNeedingWater.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded-xl border border-slate-100">
                🌿 All plants have adequate root moisture. No hydration required today!
              </p>
            ) : (
              <div className="space-y-2">
                {plantsNeedingWater.map(({ plant }) => (
                  <div key={plant.id} className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 text-xs">
                    <div>
                      <span className="font-semibold text-slate-900">{plant.name}</span>
                      <span className="text-[10px] text-slate-500 block">{plant.spaceType}</span>
                    </div>
                    <button
                      onClick={() => waterPlant(plant.id)}
                      className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-[11px] transition-colors"
                    >
                      Hydrate Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPlantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addPlant}
      />

      {selectedPlant && (
        <Modal
          isOpen={!!selectedPlant}
          onClose={() => setSelectedPlant(null)}
          title={`Seed-to-Harvest: ${selectedPlant.name}`}
          maxWidth="max-w-2xl"
        >
          <PlantTimeline
            plant={selectedPlant}
            onClose={() => setSelectedPlant(null)}
            onUpdateStage={(st: GrowthStage) => {
              updatePlant(selectedPlant.id, { currentStage: st });
              setSelectedPlant(p => p ? { ...p, currentStage: st } : null);
            }}
            onAddObservation={(obs) => {
              addObservation(selectedPlant.id, obs);
              setSelectedPlant(p => p ? { ...p, observations: [{ id: `obs-${Date.now()}`, ...obs }, ...p.observations] } : null);
            }}
            onAddHarvest={(h) => {
              addHarvest(selectedPlant.id, h);
              setSelectedPlant(p => p ? { ...p, harvests: [{ id: `harvest-${Date.now()}`, ...h }, ...p.harvests] } : null);
            }}
            onDeletePlant={(id) => {
              deletePlant(id);
              setSelectedPlant(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};
