import React from 'react';
import { Sprout, Heart, Github, Globe, Sparkles } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-nature-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-white">GrowMate AI</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-nature-900 text-nature-300 border border-nature-700">
                Hacktoberfest 2026
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An intelligent, open-source gardening companion engineered to get people away from their glowing screens and into living soil, sunshine, and biodiversity.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-nature-400" />
              <span>Theme: Week 1 — Touch Grass 🌱</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentTab('planner')} className="text-slate-400 hover:text-white transition-colors">
                  Garden Planner
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('weather-water')} className="text-slate-400 hover:text-white transition-colors">
                  Smart Rain-Aware Watering
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('missions')} className="text-slate-400 hover:text-white transition-colors">
                  Weekly Outdoor Missions
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('doctor')} className="text-slate-400 hover:text-white transition-colors">
                  Plant Health Doctor
                </button>
              </li>
            </ul>
          </div>

          {/* Open-Source & Ethics */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Open-Source</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentTab('about')} className="text-slate-400 hover:text-white transition-colors">
                  Model Licenses & Architecture
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('settings')} className="text-slate-400 hover:text-white transition-colors">
                  API Key & Provider Config
                </button>
              </li>
              <li>
                <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>Open-Meteo Weather API</span>
                </a>
              </li>
              <li>
                <span className="text-slate-500 text-xs">
                  Zero heavy local downloads. 100% Free tiers.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 GrowMate AI. Released under the open-source MIT License.</p>
          <div className="flex items-center gap-2">
            <span>Built with care for nature & open science</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
