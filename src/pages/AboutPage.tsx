import React from 'react';
import { Sprout, ShieldCheck, Heart, Github, Sparkles, BookOpen, Globe, Award, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-nature-900 to-earth-950 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 uppercase tracking-wider">
            Hacktoberfest 2026
          </span>
          <span className="text-nature-300 text-xs font-semibold">Open-Source AI Challenge</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight">
          GrowMate AI: Touch Grass 🌱
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          An open-source intelligent gardening companion built to get people off glowing screens and out into living soil, fresh air, and biodiversity.
        </p>
      </div>

      {/* Why Open Innovation Matters */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-nature-600" />
          <h2 className="font-display font-bold text-xl text-slate-900">
            Why Does Open Innovation Matter?
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Nature and agriculture are fundamentally decentralized, local, and collaborative. A rooftop balcony gardener in New Delhi faces vastly different soil microbiology, monsoons, and pest pressures than an urban grower in Bristol or Kyoto.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          When agricultural intelligence is trapped inside closed, proprietary APIs, it requires continuous internet access, recurring billing fees, and black-box recommendations that cannot be audited or modified by local agronomy extensions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-nature-50 border border-nature-200 space-y-1">
            <h4 className="font-bold text-xs text-nature-900">Zero Paywalls for Soil Knowledge</h4>
            <p className="text-[11px] text-nature-800 leading-snug">
              Every home gardener, community plot, or student can access verified companion planting guidelines completely free.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
            <h4 className="font-bold text-xs text-amber-900">Swappable Open Weights</h4>
            <p className="text-[11px] text-amber-800 leading-snug">
              Architecture supports Google Gemma, Qwen, or Google Gemini through clean provider interfaces without vendor lock-in.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
            <h4 className="font-bold text-xs text-sky-900">100% Free Ecosystem</h4>
            <p className="text-[11px] text-sky-800 leading-snug">
              Uses Open-Meteo for rainfall forecasts and OpenStreetMap for geocoding, keeping the app accessible to anyone with zero credit cards.
            </p>
          </div>
        </div>
      </section>

      {/* AI Architecture & Engine Abstraction */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-nature-600" />
          <h2 className="font-display font-bold text-xl text-slate-900">
            System Architecture & AI Providers
          </h2>
        </div>
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-[11px]">
            <p className="font-bold text-slate-900 font-sans text-xs">Architectural Flow:</p>
            <p>1. User Input (City, Space, Sun, Symptoms) ➔ GardenContext</p>
            <p>2. Weather Engine ➔ Open-Meteo REST API (Precipitation & drying curve)</p>
            <p>3. AI Provider Layer ➔ [Google Gemini 1.5 Flash / Gemma] OR [HuggingFace Serverless API] OR [Botanical Matrix Fallback]</p>
            <p>4. Dynamic Hydration Engine ➔ Rain offset & overwatering safeguards</p>
            <p>5. Local Storage & Calendar ➔ Browser Indexed Storage + Google Calendar .ics export</p>
          </div>
        </div>
      </section>

      {/* Open-Source License & Hacktoberfest Submission Draft */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="font-display font-bold text-xl text-slate-900">
            Hacktoberfest DEV.to Submission Ready Draft
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Copy and use this draft directly for your submission on DEV.to for the Week 1: Touch Grass challenge!
        </p>

        <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl text-xs font-mono space-y-3 overflow-x-auto">
          <p className="text-amber-300"># GrowMate AI — An Open-Source AI Gardening Assistant</p>
          <p className="text-slate-400">## What I Built</p>
          <p>GrowMate AI is an intelligent, open-source gardening assistant created for Hacktoberfest Week 1: "Touch Grass". It helps people grow herbs, vegetables, and flowers tuned to their city, rainfall, and sunlight. Its primary goal is to get users away from screens and into living soil through real-world missions, rain-aware watering reminders, and botanical disease diagnosis.</p>
          
          <p className="text-slate-400">## How I Built It</p>
          <p>Built using React, Vite, and Tailwind CSS. The AI layer connects to open-weight Google Gemma models and Google Gemini API via configurable providers with an instant offline botanical fallback. Weather is powered by Open-Meteo (100% free, no API key), with OpenStreetMap for garden location mapping and direct Google Calendar export.</p>
          
          <p className="text-slate-400">## Why Does Open Innovation Matter?</p>
          <p>Food security and gardening knowledge belong to everyone. Open-source models and free APIs ensure that localized agricultural advice remains decentralized, accessible, and resilient without expensive subscriptions.</p>
        </div>
      </section>

      {/* License */}
      <div className="text-center text-xs text-slate-500 space-y-1">
        <p>Released under the permissive <strong>MIT Open-Source License</strong>.</p>
        <p>Google Gemma is governed by the Gemma Terms of Use. Open-Meteo weather is licensed under CC-BY 4.0.</p>
      </div>
    </div>
  );
};
