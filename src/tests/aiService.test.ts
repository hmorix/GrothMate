import { AiService } from '../services/aiService';

describe('AiService - Fallback Resilience & Provider Abstraction', () => {
  test('Gracefully falls back to deterministic horticultural engine when no API key is provided', async () => {
    const response = await AiService.askAssistant(
      'How do I care for Sweet Basil?',
      [],
      { provider: 'deterministic_rules' }
    );

    expect(response).toBeDefined();
    expect(response.text.length).toBeGreaterThan(20);
    expect(response.isAiGenerated).toBe(false);
  });

  test('Diagnoses overwatering symptoms reliably using heuristic matrix', async () => {
    const diagnosis = await AiService.diagnosePlantHealth(
      'Cherry Tomato',
      ['Yellowing lower leaves', 'Drooping or limp stems despite watering'],
      'The soil feels very soggy and damp',
      null,
      { provider: 'deterministic_rules' }
    );

    expect(diagnosis.suspectedIssue).toContain('Overwatering');
    expect(diagnosis.safeOrganicRemedies.length).toBeGreaterThan(0);
    expect(diagnosis.disclaimer).toBeDefined();
  });
});
