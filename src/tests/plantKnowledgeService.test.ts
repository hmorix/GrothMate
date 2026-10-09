import { PlantKnowledgeService, VERIFIED_PLANT_DATABASE } from '../services/plantKnowledgeService';

describe('PlantKnowledgeService - Agronomic Planning Rules', () => {
  test('Returns suitable crops for small pots and containers', () => {
    const plans = PlantKnowledgeService.getRecommendedPlans({
      spaceType: 'pots',
      sunlight: 'partial_shade',
      experience: 'beginner'
    });

    expect(plans.length).toBeGreaterThan(0);
    expect(plans.every(p => p.spacingCm > 0)).toBe(true);
    expect(plans.every(p => p.daysToHarvest > 0)).toBe(true);
  });

  test('Finds verified plant by exact or partial name', () => {
    const basil = PlantKnowledgeService.getPlantByName('Sweet Basil');
    expect(basil).toBeDefined();
    expect(basil?.scientificName).toBe('Ocimum basilicum');
    expect(basil?.companionPlants).toContain('Tomato');
  });

  test('Verified database contains essential urban categories', () => {
    const categories = new Set(VERIFIED_PLANT_DATABASE.map(p => p.category));
    expect(categories.has('herb')).toBe(true);
    expect(categories.has('vegetable')).toBe(true);
    expect(categories.has('greens')).toBe(true);
    expect(categories.has('flower')).toBe(true);
  });
});
