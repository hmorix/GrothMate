import { WateringEngine } from '../services/wateringEngine';
import { Plant, WeatherData } from '../types';

describe('WateringEngine - Dynamic Rain and Climate-Aware Logic', () => {
  const mockWeatherDry: WeatherData = {
    city: 'New Delhi',
    country: 'India',
    temperatureC: 28,
    humidity: 45,
    weatherCode: 1,
    weatherDescription: 'Sunny skies',
    precipitationMm: 0,
    forecastRainNext24hMm: 0,
    uvIndex: 7,
    windSpeedKmh: 10,
    forecastDays: []
  };

  const mockWeatherRainy: WeatherData = {
    ...mockWeatherDry,
    forecastRainNext24hMm: 12.5,
    precipitationMm: 8.0,
    weatherDescription: 'Heavy rain shower'
  };

  const mockTomatoPlant: Plant = {
    id: 'test-p1',
    name: 'Cherry Tomato',
    variety: 'Sweet 100',
    spaceType: 'balcony',
    sunlight: 'full_sun',
    plantedDate: '2026-09-01',
    currentStage: 'fruiting',
    targetHarvestDays: 65,
    expectedHarvestDate: '2026-11-05',
    waterNeed: 'moderate',
    lastWateredDate: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], // 4 days ago
    wateringIntervalDays: 3,
    observations: [],
    harvests: [],
    imageUrl: ''
  };

  test('Recommends watering when days elapsed exceed target interval', () => {
    const advice = WateringEngine.evaluatePlantWatering(mockTomatoPlant, mockWeatherDry);
    expect(advice.shouldWaterToday).toBe(true);
    expect(advice.urgency).toBe('high');
  });

  test('Mitigates watering and advises skip when outdoor rain is approaching', () => {
    const advice = WateringEngine.evaluatePlantWatering(mockTomatoPlant, mockWeatherRainy);
    expect(advice.shouldWaterToday).toBe(false);
    expect(advice.isRainMitigated).toBe(true);
    expect(advice.urgency).toBe('skip_rain');
  });

  test('Issues overwater warning if plant was already watered today', () => {
    const plantWateredToday: Plant = {
      ...mockTomatoPlant,
      lastWateredDate: new Date().toISOString().split('T')[0]
    };
    const advice = WateringEngine.evaluatePlantWatering(plantWateredToday, mockWeatherDry);
    expect(advice.shouldWaterToday).toBe(false);
    expect(advice.urgency).toBe('overwater_warning');
  });
});
