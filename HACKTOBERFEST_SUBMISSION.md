# GrothMate AI — An Open-Source AI Gardening Assistant

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

## What I Built

**GrothMate AI** is an intelligent, open-source gardening assistant designed specifically to tackle screen fatigue and get people outdoors into living soil, fresh air, and biodiversity.

Modern apps tend to trap our attention behind glowing screens. GrothMate AI flips that dynamic:
- It guides urban, balcony, and backyard gardeners on what to plant based on their exact city climate, sun exposure, and container space.
- It calculates dynamic, rain-aware watering advisories using real-time Open-Meteo forecasts so plants are never overwatered on rigid calendar schedules.
- It nudges users off their screens with weekly **"Touch Grass" real-world missions** (e.g., 5-minute silent plant observation, soil finger moisture tests, kitchen composting).
- It provides multimodal plant health diagnosis with organic remedies and safe IPM guidelines.
- It clearly separates verified botanical rules from AI-generated estimates with clear visual trust badges.

## Demo

- **Live Production URL:** [https://grothmate.harshsharma.tech](https://grothmate.harshsharma.tech)
- **Hosted on:** Vercel

## Code

- **GitHub Repository:** [https://github.com/hmorix/GrothMate](https://github.com/hmorix/GrothMate)
- **License:** MIT License (100% Open-Source & Permissive)

## How I Built It

### 1. Technology Stack (Ultra-Lightweight & 100% Free Tiers)
- **Frontend & App Core:** React 18, TypeScript, Vite, Tailwind CSS.
- **Styling & Aesthetics:** Nature-inspired palette (forest greens, warm terracotta, earth tones, soft organic glassmorphism, micro-animations, Inter & Outfit Google Fonts).
- **Icons & Effects:** Lucide React, Canvas Confetti.

### 2. Open-Weight AI Architecture
GrothMate AI uses a swappable, modular provider abstraction:
1. **Google AI Studio / Gemini & Gemma API:** Fast multimodal inference for plant symptom analysis and companion planting synthesis with dynamic model auto-discovery (supports `gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-pro`, etc.) without downloading heavy weights locally.
2. **Hugging Face Serverless Inference:** Open-weight `google/gemma-2-9b-it` or `Qwen/Qwen2.5-7B-Instruct` API without requiring GPU hosting.
3. **Deterministic Botanical Rules Engine:** A built-in offline agronomic engine based on Royal Horticultural Society (RHS) and USDA extension guidelines. Works 100% out of the box with zero API keys and zero cost.

### 3. Google Services & Open Alternatives
- **Google Calendar Integration:** Instant 1-click export of watering tasks and planting reminders directly into Google Calendar via universal web URL and `.ics` download (0 OAuth friction, zero user passwords required).
- **Google Fonts:** Inter & Outfit for clean readability and accessible contrast.
- **Weather:** Real-time Open-Meteo API (100% free, no API key required, worldwide rainfall and temperature forecasts).
- **Mapping:** OpenStreetMap Leaflet integration for instant geocoding and visual garden coordinate confirmation.

## Why Does Open Innovation Matter?

Agriculture and gardening belong to the human commons. Food security, seed saving, and understanding local microclimates shouldn't be locked behind closed proprietary corporate paywalls or expensive recurring subscriptions.

By anchoring GrothMate AI on open innovation and open-weight models (like Google Gemma):
1. **Zero Financial Barriers:** Anyone—from a school greenhouse in Kenya to a college student with a single basil pot in New Delhi—can plan organic crops without needing a paid credit card.
2. **Resilience & Privacy:** Users own their data. Keys are never exposed in DOM or public repositories. Garden records can be exported in standard JSON at any time. The app functions seamlessly even without an external API key using verified deterministic rules.
3. **Decentralized Adaptation:** Open code allows local agricultural collectives to fork, translate, and tune crop matrices to their native bio-regions.

## Prize Categories

- **Hacktoberfest Open-Source AI Challenge: Week 1 — Touch Grass**
- **Google Gemma / Open-Weight AI Category**

---
*Grow More. Waste Less. Touch Grass.* 🌱
