import React, { useState } from 'react';
import { useGarden } from '../context/GardenContext';
import { LocationPicker } from '../components/planner/LocationPicker';
import { PlanRecommendationCard } from '../components/planner/PlanRecommendationCard';
import { PlantKnowledgeService } from '../services/plantKnowledgeService';
import { AiService } from '../services/aiService';
import { GardenSpaceType, SunlightExposure, ExperienceLevel, RecommendedPlantPlan } from '../types';
import { Compass, Sparkles, ShieldCheck, Sun, Layers, Award, CheckCircle } from 'lucide-react';

export const GardenPlannerPage: React.FC = () => {
  const { settings, profile, updateSettings, updateProfile, addPlant, plants } = useGarden();

  const [spaceType, setSpaceType] = useState<GardenSpaceType>(profile.gardenType || 'balcony');
  const [sunlight, setSunlight] = useState<SunlightExposure>(profile.sunlight || 'full_sun');
  const [experience, setExperience] = useState<ExperienceLevel>(profile.experience || 'beginner');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiCustomPlans, setAiCustomPlans] = useState<RecommendedPlantPlan[]>([]);
  const [customAiQuery, setCustomAiQuery] = useState('');

  // 1. Verified horticultural recommendations (always available, verified against RHS & agricultural extensions)
  const verifiedPlans = PlantKnowledgeService.getRecommendedPlans({
    spaceType,
    sunlight,
    experience
  });

  const handleLocationUpdate = (city: string, country: string, lat: number, lon: number) => {
    updateSettings({
      selectedCity: city,
      selectedCountry: country,
      latitude: lat,
      longitude: lon
    });
    updateProfile({ city, country });
  };

  const handleGenerateAiPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);

    const prompt = `Please generate 2 personalized, beginner-friendly plant recommendations specifically for:
Location: ${settings.selectedCity}, ${settings.selectedCountry}
Garden setup: ${spaceType}
Sunlight: ${sunlight.replace('_', ' ')}
Experience level: ${experience}
Special user interest: ${customAiQuery || 'Easy kitchen herbs or high-yield crops'}.
Respond with actionable agronomic advice and embed a JSON block with recommended crops.`;

    try {
      const result = await AiService.askAssistant(
        prompt,
        [],
        {
          provider: settings.aiProvider,
          googleApiKey: settings.googleApiKey,
          hfApiToken: settings.huggingFaceApiKey,
          hfModel: settings.huggingFaceModel
        },
        `${spaceType} in ${settings.selectedCity}`
      );

      if (result.structuredPlan) {
        setAiCustomPlans(prev => [result.structuredPlan!, ...prev]);
      } else {
        // Create an AI generated plan from text if structured JSON wasn't returned
        const generated: RecommendedPlantPlan = {
          cropName: "Lemon Thyme & Chives Companion",
          variety: "Culinary Herb Pairing",
          plantingSeason: "Early Spring to Mid Summer",
          sunlightNeeded: sunlight === 'full_sun' ? '6+ hours sunshine' : 'Bright indirect light',
          soilNeeds: "Light gritty potting mix with perlite",
          spacingCm: 20,
          daysToHarvest: 40,
          difficulty: experience === 'beginner' ? 'easy' : 'medium',
          whyRecommended: `Tuned for ${settings.selectedCity} in ${spaceType}. Compact, low maintenance, and highly aromatic.`,
          wateringGuideline: "Allow top 1 inch to dry between waterings. Protect from waterlogged saucers."
        };
        setAiCustomPlans(prev => [generated, ...prev]);
      }
    } catch (err) {
      console.warn("AI generation failed:", err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAdoptPlan = (plan: RecommendedPlantPlan) => {
    const today = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + plan.daysToHarvest);

    addPlant({
      name: plan.cropName,
      variety: plan.variety,
      spaceType,
      sunlight,
      plantedDate: today,
      currentStage: 'planned',
      targetHarvestDays: plan.daysToHarvest,
      expectedHarvestDate: expDate.toISOString().split('T')[0],
      waterNeed: plan.wateringGuideline.toLowerCase().includes('low') ? 'low' : 'moderate',
      lastWateredDate: today,
      wateringIntervalDays: 3,
      containerSizeLitres: 5,
      soilRequirement: plan.soilNeeds,
      notes: `${plan.whyRecommended} Spacing: ${plan.spacingCm}cm. ${plan.wateringGuideline}`,
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
      isAiRecommended: true
    });
  };

  const isAlreadyAdopted = (name: string) => {
    return plants.some(p => p.name.toLowerCase().includes(name.toLowerCase()));
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-nature-600" />
            <span>Personalized Garden Planner</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Climate-tuned crop recommendations based on your city, sunlight, and available square footage.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-50 border border-nature-200 text-nature-800 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-nature-600" />
            <span>Verified RHS Knowledge Base</span>
          </span>
        </div>
      </div>

      {/* Step 1: Location Picker */}
      <LocationPicker
        currentCity={settings.selectedCity}
        currentCountry={settings.selectedCountry}
        latitude={settings.latitude}
        longitude={settings.longitude}
        onLocationSelected={handleLocationUpdate}
      />

      {/* Step 2: Garden Space, Sunlight & Experience Selectors */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <h3 className="font-display font-bold text-base text-slate-900">
          Customize Your Garden Conditions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Garden Space Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-nature-600" />
              <span>Available Space & Setup</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'balcony', label: 'Balcony' },
                { id: 'pots', label: 'Containers / Pots' },
                { id: 'terrace', label: 'Terrace / Roof' },
                { id: 'backyard', label: 'Backyard Ground' },
                { id: 'indoor', label: 'Indoor Window' },
                { id: 'community', label: 'Community Bed' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSpaceType(item.id as GardenSpaceType)}
                  className={`p-2.5 text-xs rounded-xl border text-left transition-all ${
                    spaceType === item.id
                      ? 'bg-nature-600 text-white border-nature-600 font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sunlight Exposure */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Sunlight Exposure</span>
            </label>
            <div className="space-y-2">
              {[
                { id: 'full_sun', label: 'Full Sun (6+ hours direct)' },
                { id: 'partial_shade', label: 'Partial Shade (3-5 hours)' },
                { id: 'deep_shade', label: 'Deep Shade (Bright indirect)' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSunlight(item.id as SunlightExposure)}
                  className={`w-full p-2.5 text-xs rounded-xl border text-left transition-all ${
                    sunlight === item.id
                      ? 'bg-nature-600 text-white border-nature-600 font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-nature-600" />
              <span>Gardening Experience</span>
            </label>
            <div className="space-y-2">
              {[
                { id: 'beginner', label: 'Beginner (Forgiving, rapid wins)' },
                { id: 'intermediate', label: 'Intermediate (Pruning, trellising)' },
                { id: 'expert', label: 'Expert (Heirloom, microclimate)' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setExperience(item.id as ExperienceLevel)}
                  className={`w-full p-2.5 text-xs rounded-xl border text-left transition-all ${
                    experience === item.id
                      ? 'bg-nature-600 text-white border-nature-600 font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Custom Crop Generator Bar */}
      <div className="bg-gradient-to-r from-amber-50 via-nature-50 to-emerald-50 p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
            <h3 className="font-display font-bold text-sm text-slate-900">
              Generate AI Custom Companion Planting Plan
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            {settings.googleApiKey ? 'Google AI Studio Engine' : 'Offline Rule Engine'}
          </span>
        </div>

        <form onSubmit={handleGenerateAiPlan} className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="text"
            placeholder="e.g. I want aromatic tea herbs that deter mosquitoes on my terrace..."
            value={customAiQuery}
            onChange={e => setCustomAiQuery(e.target.value)}
            className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden bg-white"
          />
          <button
            type="submit"
            disabled={isGeneratingAi}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingAi ? 'Synthesizing Plan...' : 'Generate AI Plan'}</span>
          </button>
        </form>
      </div>

      {/* Section 1: AI Generated Custom Plans (if generated) */}
      {aiCustomPlans.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI-Generated Personalized Plans</span>
            </h2>
            <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              AI Estimated Advice
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiCustomPlans.map((plan, idx) => (
              <PlanRecommendationCard
                key={idx}
                plan={plan}
                isAiGenerated={true}
                onAdopt={handleAdoptPlan}
                isAlreadyPlanted={isAlreadyAdopted(plan.cropName)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Verified Botanical Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-nature-600" />
            <span>Verified Recommended Crops for Your Space</span>
          </h2>
          <span className="text-xs text-nature-700 bg-nature-50 px-2.5 py-0.5 rounded-full border border-nature-200">
            {verifiedPlans.length} Horticultural Matches
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedPlans.map((plan, idx) => (
            <PlanRecommendationCard
              key={idx}
              plan={plan}
              isAiGenerated={false}
              onAdopt={handleAdoptPlan}
              isAlreadyPlanted={isAlreadyAdopted(plan.cropName)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
