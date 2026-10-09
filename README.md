# 🌱 GrothMate AI — Open-Source AI Gardening Assistant

[![Live App](https://img.shields.io/badge/Live%20Demo-Grothmate.harshsharma.tech-brightgreen.svg)](https://grothmate.harshsharma.tech)
[![GitHub Repo](https://img.shields.io/badge/GitHub-hmorix%2FGrothMate-blue.svg)](https://github.com/hmorix/GrothMate)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-Week%201%20Touch%20Grass-orange.svg)](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)
[![Stack](https://img.shields.io/badge/Stack-React%2018%20|%20Vite%20|%20TypeScript%20|%20Tailwind-blue.svg)](https://vitejs.dev)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com)

> *"Grow More. Waste Less. Touch Grass."*

**GrothMate AI** is an intelligent, open-source gardening companion engineered to get people away from their screens and actively involved in nature, soil, and organic plant care. 

Live Deployment: **[https://grothmate.harshsharma.tech](https://grothmate.harshsharma.tech)**  
GitHub Repository: **[https://github.com/hmorix/GrothMate](https://github.com/hmorix/GrothMate)**

Developed for the **Hacktoberfest Open-Source AI Challenge (Week 1: Touch Grass)**, it combines open-weight models (such as Google Gemma) and Google Gemini with verified botanical rules to provide tailored planting plans, rainfall-aware watering schedules, symptom screening, and real-world outdoor missions.

---

## 🌟 Key Features

### 1. 🧭 Personalized Garden Planner
- Customizes recommendations to your **exact city or PIN code**, sunlight exposure (Full Sun, Partial Shade, Deep Shade), garden space (Balcony, Pots, Terrace, Backyard, Indoor Window, Community Garden), and experience level.
- Clearly separates **Verified Botanical Guidelines** from **AI-Generated Estimates** with visual trust badges (`AiBadge`).
- Direct 1-click **"Add to My Garden Tracker"** to adopt any recommended crop immediately.

### 2. 🤖 Configurable Open-Weight AI Assistant
- Built with a modular provider abstraction supporting:
  - **Google AI Studio / Gemini & Gemma API:** Auto-discovers and connects to the active model on your account (`gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-pro`, etc.) without downloading heavy weights locally.
  - **Hugging Face Serverless Inference:** Optional open-weight model endpoints (`google/gemma-2-9b-it`, `Qwen/Qwen2.5-7B-Instruct`).
  - **Deterministic Botanical Engine:** 100% offline fallback based on Royal Horticultural Society guidelines.
- **Security Guarantee:** API keys are never exposed in DOM or public repositories. Masked input prevents DOM inspection extraction.

### 3. 🌧️ Weather & Smart Watering Assistant
- **Open-Meteo Integration:** 100% free, worldwide real-time weather and 7-day precipitation forecasts without requiring any API keys or billing.
- **Dynamic Evapotranspiration & Rain Offsets:** Automatically detects incoming rain (>4mm) and advises you to skip manual watering.
- **Overwatering Safeguards:** Issues explicit warnings when plants were recently hydrated to prevent root suffocation.
- **Google Calendar Export:** 1-click button to schedule watering sessions directly into **Google Calendar** or download standard `.ics` files.

### 4. 📈 Seed-to-Harvest Timeline Tracker
- Track growth across all 6 agronomic stages: `Planned` ➔ `Seedling` ➔ `Growing` ➔ `Flowering` ➔ `Fruiting` ➔ `Harvested`.
- Record real-world growth observations, height measurements (cm), notes, and harvest yield records with celebratory confetti.

### 5. 🧘 Weekly "Touch Grass" Missions & Streaks
- Real-world outdoor missions designed to pull you away from your screen:
  - *Touch Real Soil & Check Moisture* (Index finger test)
  - *5-Minute Silent Plant Observation* (No phones, observing leaf venation)
  - *Gentle Pruning & Deadheading*
  - *Start a Kitchen Scrap Compost Bin*
  - *Sow 3 Fresh Herb Seeds*
- Keep track of your daily **Touch Grass Streak** and unlock achievement badges in the trophy case.

### 6. 🩺 Plant Health Assistant (Disease Doctor)
- Select visual symptoms (yellowing leaves, powdery mildew, curled tips, pests) and upload an optional leaf photo.
- Multi-modal vision analysis provides root causes, severity ratings, safe organic remedies, and long-term prevention strategies with responsible diagnostic disclaimers.

---

## 🏗️ Architecture

```
                       ┌─────────────────────────────┐
                       │   GrothMate AI React Shell  │
                       └──────────────┬──────────────┘
                                      │
              ┌───────────────────────┼────────────────────────┐
              ▼                       ▼                        ▼
     ┌────────────────┐      ┌─────────────────┐      ┌────────────────┐
     │ Weather Engine │      │   AI Provider   │      │ Knowledge Base │
     │  (Open-Meteo)  │      │   Abstraction   │      │ (RHS Verified) │
     └────────┬───────┘      └────────┬────────┘      └────────┬───────┘
              │                       │                        │
              ▼                       │                        ▼
     ┌────────────────┐               │               ┌────────────────┐
     │ Smart Watering │               │               │ Garden Planner │
     │ Rain Mitigation│               │               │ & Companion DB │
     └────────┬───────┘               │               └────────┬───────┘
              │                       │                        │
              │       ┌───────────────┴───────────────┐        │
              │       ▼               ▼               ▼        │
              │ ┌───────────┐   ┌───────────┐   ┌───────────┐  │
              │ │ Google AI │   │  Hugging  │   │ Botanical │  │
              │ │  Studio   │   │   Face    │   │ Determin. │  │
              │ └───────────┘   └───────────┘   └───────────┘  │
              │                                                │
              └───────────────────────┬────────────────────────┘
                                      ▼
                       ┌─────────────────────────────┐
                       │  Local Storage & .ics Cal   │
                       └─────────────────────────────┘
```

---

## 🚀 Quickstart & Local Setup

### 1. Installation

```bash
git clone https://github.com/hmorix/GrothMate.git
cd GrothMate
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

*(Note: `.env` is listed in `.gitignore` and will never be pushed to your public repository!)*

### 3. Run Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:3000`.

---

## 🌐 Vercel Deployment Guide

To deploy on **Vercel** with custom domain `grothmate.harshsharma.tech`:

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/hmorix/GrothMate.git
   git push -u origin main
   ```
2. Import the `hmorix/GrothMate` project into [Vercel](https://vercel.com).
3. In **Settings ➔ Domains**, add: `Grothmate.harshsharma.tech`.
4. In **Settings ➔ Environment Variables**, optionally add:
   - `VITE_GOOGLE_API_KEY`: *(Your Google AI Studio API key)*
   - `VITE_AI_PROVIDER`: `google_gemini`
   *(Or let users configure their own key safely inside the browser Settings UI!)*

---

## 🔒 Privacy & Free-Tier Guarantees

1. **Zero Model Downloads:** Runs entirely in browser; AI inference executes over standard secure HTTPS calls to Google AI Studio or Hugging Face serverless endpoints.
2. **Key Security:** API keys are never exposed in DOM or public repositories. Masked input prevents DOM inspection extraction.
3. **Offline Resilience:** If no internet connection or API key is available, the app automatically runs on its built-in deterministic agronomic knowledge matrix.
4. **Data Sovereignty:** All your garden plants, observations, and streaks are stored locally in your browser. Use the **Export Garden JSON** button in Settings to backup your data anytime.
5. **100% Free Ecosystem:**
   - Weather: Open-Meteo (Free, no billing, no keys required).
   - Maps: OpenStreetMap (Free, no billing, no keys required).
   - Google Calendar: Direct web link generator (Zero OAuth friction, zero password storage).

---

## 📜 License

This project is licensed under the permissive **MIT License**. See the [LICENSE](LICENSE) file for details.

Google Gemma is licensed under the [Gemma Terms of Use](https://ai.google.dev/gemma/terms).  
Weather data is provided by [Open-Meteo.com](https://open-meteo.com) under CC-BY 4.0.

---

*Made with care for Hacktoberfest 2026. Step outside and Touch Grass!* 🌱
###HMorix##
