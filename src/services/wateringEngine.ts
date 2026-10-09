import { Plant, WeatherData } from '../types';

export interface WateringAdvice {
  plantId: string;
  plantName: string;
  shouldWaterToday: boolean;
  urgency: 'low' | 'moderate' | 'high' | 'skip_rain' | 'overwater_warning';
  recommendedAction: string;
  reasons: string[];
  soilCheckMethod: string;
  estimatedDaysUntilNextWater: number;
  nextRecommendedDate: string;
  isRainMitigated: boolean;
  rainForecastMm: number;
}

export class WateringEngine {
  /**
   * Evaluates watering necessity for a given plant considering:
   * - Plant water need & growth stage
   * - Days since last watered
   * - Recent & forecast precipitation
   * - Ambient temperature & humidity
   * - Container size
   */
  static evaluatePlantWatering(plant: Plant, weather: WeatherData): WateringAdvice {
    const reasons: string[] = [];
    let isRainMitigated = false;

    // Calculate days elapsed since last watering
    const lastWatered = new Date(plant.lastWateredDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastWatered.getTime());
    const daysSinceWatered = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    // Base interval adjustment based on plant requirement
    let effectiveInterval = plant.wateringIntervalDays || 3;
    if (plant.waterNeed === 'low') effectiveInterval += 3;
    if (plant.waterNeed === 'high') effectiveInterval = Math.max(1, effectiveInterval - 1);

    // Stage modifier: seedlings and flowering/fruiting require more consistent moisture
    if (plant.currentStage === 'seedling') {
      reasons.push("Seedling stage has shallow roots that dry out quickly.");
      effectiveInterval = Math.max(1, effectiveInterval - 1);
    } else if (plant.currentStage === 'fruiting') {
      reasons.push("Fruiting stage demands steady hydration to swell produce evenly.");
      effectiveInterval = Math.max(1, effectiveInterval - 1);
    }

    // Weather adjustments (temperature & heat)
    if (weather.temperatureC > 32) {
      effectiveInterval = Math.max(1, effectiveInterval - 1);
      reasons.push(`High temperature (${weather.temperatureC}°C) increases soil evapotranspiration.`);
    } else if (weather.temperatureC < 15) {
      effectiveInterval += 2;
      reasons.push(`Cool weather (${weather.temperatureC}°C) slows down water absorption.`);
    }

    // Rain factor: if rain > 4mm occurred or forecast > 5mm in next 24h
    const upcomingRain = weather.forecastRainNext24hMm || 0;
    const isOutdoor = plant.spaceType === 'backyard' || plant.spaceType === 'balcony' || plant.spaceType === 'terrace';

    if (isOutdoor && upcomingRain >= 4.0) {
      isRainMitigated = true;
      reasons.push(`Rain forecast: ~${upcomingRain.toFixed(1)}mm expected. Nature will hydrate your outdoor garden!`);
    }

    // Determine shouldWater
    let shouldWaterToday = false;
    let urgency: 'low' | 'moderate' | 'high' | 'skip_rain' | 'overwater_warning' = 'low';
    let recommendedAction = "Soil should still retain moisture. Let roots breathe.";

    if (daysSinceWatered === 0) {
      urgency = 'overwater_warning';
      shouldWaterToday = false;
      recommendedAction = "Plant was already watered today. Avoid adding more water to prevent root rot and suffocated soil.";
      reasons.push("Watered within last 24 hours. Roots require oxygen as much as moisture.");
    } else if (isRainMitigated) {
      urgency = 'skip_rain';
      shouldWaterToday = false;
      recommendedAction = "Skip watering! Approaching rain will moisten the soil naturally.";
    } else if (daysSinceWatered >= effectiveInterval) {
      shouldWaterToday = true;
      urgency = daysSinceWatered > effectiveInterval + 2 ? 'high' : 'moderate';
      recommendedAction = `Time to hydrate! Soil has had ${daysSinceWatered} days to dry down.`;
      reasons.push(`Days since last watering (${daysSinceWatered}) met target interval (${effectiveInterval} days).`);
    } else {
      urgency = 'low';
      shouldWaterToday = false;
      const daysLeft = effectiveInterval - daysSinceWatered;
      recommendedAction = `Estimated ${daysLeft} day(s) until next drink. Check topsoil with finger test.`;
    }

    // Next recommended date
    const daysUntilNext = Math.max(0, effectiveInterval - daysSinceWatered);
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (shouldWaterToday ? 0 : daysUntilNext));

    const soilCheckMethod = plant.waterNeed === 'low'
      ? "Insert finger 2 inches deep. If any dampness is detected, wait 2 more days."
      : "Touch top 1 inch of soil. If cool and slightly dry to the touch, water slowly at the base.";

    return {
      plantId: plant.id,
      plantName: plant.name,
      shouldWaterToday,
      urgency,
      recommendedAction,
      reasons,
      soilCheckMethod,
      estimatedDaysUntilNextWater: daysUntilNext,
      nextRecommendedDate: nextDate.toISOString().split('T')[0],
      isRainMitigated,
      rainForecastMm: upcomingRain
    };
  }
}
