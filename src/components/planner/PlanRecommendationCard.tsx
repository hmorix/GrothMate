import React from 'react';
import { RecommendedPlantPlan } from '../../types';
import { Sprout, Sun, Clock, Ruler, Droplets, Check, Plus } from 'lucide-react';
import { AiBadge } from '../common/AiBadge';

interface PlanRecommendationCardProps {
  plan: RecommendedPlantPlan;
  isAiGenerated?: boolean;
  onAdopt: (plan: RecommendedPlantPlan) => void;
  isAlreadyPlanted?: boolean;
}

export const PlanRecommendationCard: React.FC<PlanRecommendationCardProps> = ({
  plan,
  isAiGenerated = false,
  onAdopt,
  isAlreadyPlanted = false
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4">
      
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-slate-900">{plan.cropName}</h3>
              <AiBadge isAiGenerated={isAiGenerated} />
            </div>
            <p className="text-xs text-slate-500 italic mt-0.5">{plan.variety}</p>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-nature-100 text-nature-800 capitalize">
            {plan.difficulty}
          </span>
        </div>

        {/* Why Recommended Quote */}
        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-3 leading-relaxed">
          {plan.whyRecommended}
        </p>
      </div>

      {/* Agronomic Specifications Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100 text-amber-900 flex items-center gap-2">
          <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="truncate">{plan.sunlightNeeded}</span>
        </div>

        <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-900 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{plan.daysToHarvest} days to harvest</span>
        </div>

        <div className="p-2 rounded-xl bg-sky-50/60 border border-sky-100 text-sky-900 flex items-center gap-2">
          <Ruler className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>{plan.spacingCm} cm spacing</span>
        </div>

        <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100 text-purple-900 flex items-center gap-2">
          <Droplets className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span className="truncate">{plan.plantingSeason}</span>
        </div>
      </div>

      {/* Soil & Watering Advice */}
      <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
        <div>
          <span className="font-semibold text-slate-700">Soil requirement: </span>
          <span>{plan.soilNeeds}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Watering rhythm: </span>
          <span>{plan.wateringGuideline}</span>
        </div>
      </div>

      {/* Adopt Action Button */}
      <button
        onClick={() => onAdopt(plan)}
        disabled={isAlreadyPlanted}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
          isAlreadyPlanted
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-nature-600 hover:bg-nature-700 text-white shadow-xs'
        }`}
      >
        {isAlreadyPlanted ? (
          <>
            <Check className="w-4 h-4" />
            <span>Already in Your Garden</span>
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span>Add to My Garden Tracker</span>
          </>
        )}
      </button>
    </div>
  );
};
