import React from 'react';
import { 
  Sprout, 
  ArrowRight, 
  Compass, 
  Droplets, 
  Stethoscope, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Sun,
  Flame,
  Globe
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentTab }) => {
  const { profile } = useGarden();

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hacktoberfest Week 1 Announcement Banner */}
      <div className="bg-gradient-to-r from-nature-800 via-nature-700 to-earth-800 text-white py-3 px-4 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-3 border border-nature-600/40">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold text-xs uppercase tracking-wider">
            Hacktoberfest 2026
          </span>
          <span className="text-xs sm:text-sm font-medium">
            Week 1 Challenge: <strong>Touch Grass</strong> 🌱 — Powered by Open-Weight AI
          </span>
        </div>
        <button
          onClick={() => setCurrentTab('missions')}
          className="text-xs bg-white text-nature-900 font-bold px-3 py-1.5 rounded-xl hover:bg-nature-100 transition-colors flex items-center gap-1 shadow-xs"
        >
          <span>Take a Mission</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-6 pb-12 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
        
        {/* Mission pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nature-100/80 border border-nature-200 text-nature-900 text-xs font-semibold shadow-xs">
          <Sprout className="w-4 h-4 text-nature-600" />
          <span>Grow More. Waste Less. Touch Grass.</span>
        </div>

        {/* Hero Heading */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-slate-900 tracking-tight leading-[1.15]">
          Your Intelligent, Open-Source <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-nature-700 via-nature-600 to-emerald-500 bg-clip-text text-transparent">
            Gardening Companion
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Step away from your screen and connect with living soil. Grow herbs, vegetables, and flowers tuned to your local rainfall, sun exposure, and city climate.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentTab('planner')}
            className="px-6 py-3.5 rounded-2xl bg-nature-600 hover:bg-nature-700 text-white font-bold text-sm shadow-lg shadow-nature-600/25 hover:shadow-xl transition-all flex items-center gap-2 group"
          >
            <span>Plan My Garden</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Open Garden Tracker</span>
          </button>

          <button
            onClick={() => setCurrentTab('assistant')}
            className="px-5 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-sm border border-amber-200/80 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Ask AI Assistant</span>
          </button>
        </div>

        {/* Verified vs AI Trust Pill */}
        <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-nature-600" />
            <span>Verified Horticultural Rules</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-sky-600" />
            <span>Free Open-Meteo Weather</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Configurable Gemma & Gemini AI</span>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
            Engineered for Real Soil & Hands in the Dirt
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            GrowMate AI combines open-weight models with botanical rules so you spend less time configuring and more time harvesting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Feature 1 */}
          <div 
            onClick={() => setCurrentTab('planner')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-nature-100 text-nature-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">Personalized Garden Planner</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Input your city, sunlight hours, and container type. Get customized planting windows and companion plant pairings with verified spacing guidelines.
            </p>
            <div className="text-xs font-semibold text-nature-700 flex items-center gap-1">
              <span>Start Planning</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 2 */}
          <div 
            onClick={() => setCurrentTab('weather-water')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">Smart Rain-Aware Hydration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never water on a rigid calendar. GrowMate checks local rainfall forecasts and temperature drying curves, preventing suffocated roots and root rot.
            </p>
            <div className="text-xs font-semibold text-sky-700 flex items-center gap-1">
              <span>Check Watering Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 3 */}
          <div 
            onClick={() => setCurrentTab('missions')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">Weekly 'Touch Grass' Missions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              5-minute silent observation, soil finger checks, and kitchen composting. Complete real-world tasks outdoors to unlock badges and maintain streaks.
            </p>
            <div className="text-xs font-semibold text-amber-800 flex items-center gap-1">
              <span>View Missions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Touch Grass Philosophy Section */}
      <section className="bg-gradient-to-br from-nature-900 to-earth-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-5">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-nature-800/80 text-nature-200 border border-nature-600/50">
            Open-Source Philosophy
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl leading-tight">
            Technology Should Bring Us Closer to Nature, Not Keep Us Trapped in Pixels.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            GrowMate AI is engineered to be a companion that nudges you outside. The moment you read your morning watering advisory or log your radish sprout, close your laptop, pick up your watering can, and feel the morning breeze.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentTab('onboarding')}
              className="px-5 py-3 rounded-xl bg-nature-500 hover:bg-nature-400 text-nature-950 font-bold text-xs transition-colors"
            >
              Setup Garden Profile
            </button>
            <button
              onClick={() => setCurrentTab('about')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors border border-white/20"
            >
              Read Open-Source Blueprint
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
