import React from 'react';
import { Plant, WeatherData } from '../../types';
import { Droplets, Calendar, Sun, Clock, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WateringEngine } from '../../services/wateringEngine';

interface PlantCardProps {
  plant: Plant;
  weather: WeatherData | null;
  onSelect: (plant: Plant) => void;
  onWater: (plantId: string) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, weather, onSelect, onWater }) => {
  const wateringAdvice = weather ? WateringEngine.evaluatePlantWatering(plant, weather) : null;

  const stageColors: Record<string, string> = {
    planned: 'bg-slate-100 text-slate-700 border-slate-200',
    seedling: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    growing: 'bg-nature-100 text-nature-800 border-nature-200',
    flowering: 'bg-purple-100 text-purple-800 border-purple-200',
    fruiting: 'bg-amber-100 text-amber-800 border-amber-200',
    harvested: 'bg-rose-100 text-rose-800 border-rose-200'
  };

  const planted = new Date(plant.plantedDate);
  const now = new Date();
  const daysGrowing = Math.max(0, Math.floor((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, plant.targetHarvestDays - daysGrowing);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Top Banner / Image */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img 
          src={plant.imageUrl} 
          alt={plant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Stage Pill */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border backdrop-blur-md shadow-xs ${stageColors[plant.currentStage] || 'bg-white/90 text-slate-800'}`}>
            {plant.currentStage}
          </span>
        </div>

        {/* Space type pill */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/40 text-white backdrop-blur-md border border-white/20 capitalize">
            {plant.spaceType}
          </span>
        </div>

        {/* Name on image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-display font-bold text-lg leading-tight drop-shadow-sm">{plant.name}</h3>
          <p className="text-xs text-white/90 italic truncate">{plant.variety}</p>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Metrics Row */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-nature-600 shrink-0" />
            <span>Day <strong>{daysGrowing}</strong> ({daysRemaining}d to harvest)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="capitalize">{plant.sunlight.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Dynamic Watering Status Recommendation */}
        {wateringAdvice && (
          <div className={`p-2.5 rounded-xl text-xs border flex items-start gap-2 ${
            wateringAdvice.shouldWaterToday 
              ? 'bg-sky-50 border-sky-200 text-sky-900' 
              : wateringAdvice.urgency === 'skip_rain'
              ? 'bg-blue-50 border-blue-200 text-blue-900'
              : wateringAdvice.urgency === 'overwater_warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50/70 border-emerald-200/70 text-emerald-900'
          }`}>
            {wateringAdvice.shouldWaterToday ? (
              <Droplets className="w-4 h-4 text-sky-600 shrink-0 mt-0.5 animate-bounce" />
            ) : wateringAdvice.urgency === 'skip_rain' ? (
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="leading-snug">
              <p className="font-semibold">
                {wateringAdvice.shouldWaterToday ? 'Hydration Needed Today' : 'Moisture Optimal'}
              </p>
              <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                {wateringAdvice.recommendedAction}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => onWater(plant.id)}
            className="flex-1 py-2 px-3 rounded-xl bg-nature-50 hover:bg-nature-100 text-nature-800 font-semibold text-xs flex items-center justify-center gap-1.5 border border-nature-200 transition-colors"
          >
            <Droplets className="w-3.5 h-3.5 text-nature-600" />
            <span>Water Now</span>
          </button>
          
          <button
            onClick={() => onSelect(plant)}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1 transition-colors"
            title="View seed-to-harvest timeline and observations"
          >
            <span>Timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
