import { AiChatMessage, PlantDoctorDiagnosis, RecommendedPlantPlan } from '../types';
import { PlantKnowledgeService } from './plantKnowledgeService';

export interface AiInferenceConfig {
  provider: 'google_gemini' | 'huggingface' | 'deterministic_rules';
  googleApiKey?: string;
  hfApiToken?: string;
  hfModel?: string;
}

export class AiService {
  /**
   * Main conversational assistant endpoint
   */
  static async askAssistant(
    prompt: string,
    chatHistory: AiChatMessage[],
    config: AiInferenceConfig,
    gardenContext?: string
  ): Promise<{ text: string; structuredPlan?: RecommendedPlantPlan; isAiGenerated: boolean }> {
    const trimmed = prompt.trim();

    // 1. If Google API key is configured, use Google Gemini / Gemma API
    if (config.provider === 'google_gemini' && config.googleApiKey) {
      try {
        const response = await this.callGoogleGeminiApi(trimmed, chatHistory, config.googleApiKey, gardenContext);
        return { text: response.text, structuredPlan: response.structuredPlan, isAiGenerated: true };
      } catch (err: any) {
        console.warn("Google API call failed, falling back to expert knowledge engine:", err);
        return {
          text: `[Google AI notice: ${err?.message || 'Connection issue'}. Switching to verified local knowledge base.]\n\n` +
            this.generateDeterministicResponse(trimmed),
          isAiGenerated: false
        };
      }
    }

    // 2. If Hugging Face serverless provider is selected
    if (config.provider === 'huggingface' && config.hfApiToken) {
      try {
        const hfResult = await this.callHuggingFaceApi(trimmed, config.hfApiToken, config.hfModel);
        return { text: hfResult, isAiGenerated: true };
      } catch (err: any) {
        console.warn("HuggingFace call failed, falling back to expert knowledge engine:", err);
      }
    }

    // 3. Deterministic horticultural rule engine fallback (instant, verified agronomic rules)
    return {
      text: this.generateDeterministicResponse(trimmed),
      isAiGenerated: false
    };
  }

  // Cache detected working model for this session
  private static cachedWorkingModel: string | null = null;

  /**
   * Dynamically discovers or validates supported Gemini model for the user's API key
   */
  public static async findWorkingGeminiModel(apiKey: string): Promise<string> {
    if (this.cachedWorkingModel) return this.cachedWorkingModel;

    const candidates = [
      'gemini-3.8-flash',
      'gemini-3.8-flash-latest',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-8b',
      'gemini-1.5-pro',
      'gemini-pro'
    ];

    // Try ModelService ListModels first
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const res = await fetch(listUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.models && Array.isArray(data.models)) {
          const supported = data.models
            .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
            .map((m: any) => m.name.replace(/^models\//, ''));

          // Find best candidate from supported list
          for (const cand of candidates) {
            if (supported.includes(cand)) {
              this.cachedWorkingModel = cand;
              return cand;
            }
          }
          if (supported.length > 0) {
            this.cachedWorkingModel = supported[0];
            return supported[0];
          }
        }
      }
    } catch (e) {
      // Fallback to testing individual candidates
    }

    // Try candidates iteratively with lightweight ping
    for (const cand of candidates) {
      try {
        const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${cand}:generateContent?key=${apiKey}`;
        const res = await fetch(testUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
            generationConfig: { maxOutputTokens: 5 }
          })
        });

        if (res.ok) {
          this.cachedWorkingModel = cand;
          return cand;
        }
      } catch (err) {
        continue;
      }
    }

    // Default fallback
    this.cachedWorkingModel = 'gemini-3.8-flash';
    return 'gemini-3.8-flash';
  }

  /**
   * Calls Google Gemini / Gemma API via Google AI Studio with dynamic model resolution
   */
  private static async callGoogleGeminiApi(
    prompt: string,
    history: AiChatMessage[],
    apiKey: string,
    gardenContext?: string
  ): Promise<{ text: string; structuredPlan?: RecommendedPlantPlan }> {
    let model = await this.findWorkingGeminiModel(apiKey);
    let url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemInstruction = `You are GrowMate AI, an open-source expert gardening companion designed for Hacktoberfest 'Touch Grass'.
Your mission is to help people grow organic plants, vegetables, herbs, and flowers according to their local climate, space, and experience level.
Get users away from their screens and actively hands-on in the garden with dirt, seeds, and sunshine.
Context about user's current location, weather, and garden: ${gardenContext || 'Urban garden'}.
Always consider the user's specific location and current weather conditions (temperature, humidity, rainfall) in your answers, watering advice, and planting suggestions.
Always provide practical, nature-friendly, organic gardening advice. Keep answers inspiring, concise, and structured with bullet points.
If the user asks for a planting recommendation or complete plant guide, provide helpful advice and, if appropriate, embed a JSON code block in the format:
\`\`\`json
{
  "cropName": "...",
  "variety": "...",
  "plantingSeason": "...",
  "sunlightNeeded": "...",
  "soilNeeds": "...",
  "spacingCm": 25,
  "daysToHarvest": 45,
  "difficulty": "easy",
  "whyRecommended": "...",
  "wateringGuideline": "..."
}
\`\`\``;

    const contents = [
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }]
      }
    ];

    const body = {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    };

    let res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `HTTP ${res.status}`;

      // Check if Google suggested a specific model in the error message (e.g. "update your code to use models/gemini-3.8-flash")
      const suggestedModelMatch = errMsg.match(/use models\/([a-zA-Z0-9.-]+)/i);
      if (suggestedModelMatch && suggestedModelMatch[1]) {
        const retryModel = suggestedModelMatch[1];
        this.cachedWorkingModel = retryModel;
        const retryUrl = `https://generativelanguage.googleapis.com/v1beta/models/${retryModel}:generateContent?key=${apiKey}`;
        res = await fetch(retryUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      }
      
      if (!res.ok) {
        throw new Error(errMsg);
      }
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm ready to help you grow your garden!";

    // Extract JSON block if present
    let structuredPlan: RecommendedPlantPlan | undefined;
    const jsonMatch = candidate.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        structuredPlan = JSON.parse(jsonMatch[1]);
      } catch (e) {
        // Ignore JSON parse errors
      }
    }

    return { text: candidate, structuredPlan };
  }

  /**
   * Calls Hugging Face Serverless Inference API for open-weight models (e.g. Gemma 2 or Qwen)
   */
  private static async callHuggingFaceApi(prompt: string, token: string, model = "google/gemma-2-9b-it"): Promise<string> {
    const url = `https://api-inference.huggingface.co/models/${model}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<start_of_turn>user\nYou are GrowMate AI, an open-weight gardening assistant. Answer the user question concisely:\n${prompt}<end_of_turn>\n<start_of_turn>model\n`,
        parameters: { max_new_tokens: 500, temperature: 0.7 }
      })
    });

    if (!res.ok) {
      throw new Error(`Hugging Face inference error (${res.status})`);
    }

    const data = await res.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.replace(/<start_of_turn>[\s\S]*?<start_of_turn>model\n/, '').trim();
    }
    return typeof data === 'string' ? data : JSON.stringify(data);
  }

  /**
   * Analyze Plant Health & Symptoms (Vision + Heuristic Matrix)
   */
  static async diagnosePlantHealth(
    plantName: string,
    symptoms: string[],
    notes: string,
    base64Image: string | null,
    config: AiInferenceConfig
  ): Promise<PlantDoctorDiagnosis> {
    // If Google Vision / Multimodal is available
    if (config.provider === 'google_gemini' && config.googleApiKey) {
      try {
        return await this.callGeminiVisionDiagnosis(plantName, symptoms, notes, base64Image, config.googleApiKey);
      } catch (err) {
        console.warn("Vision diagnosis failed or quota exceeded, using botanical matrix:", err);
      }
    }

    // Heuristic botanical diagnostic engine fallback
    return this.generateBotanicalMatrixDiagnosis(plantName, symptoms, notes);
  }

  private static async callGeminiVisionDiagnosis(
    plantName: string,
    symptoms: string[],
    notes: string,
    base64Image: string | null,
    apiKey: string
  ): Promise<PlantDoctorDiagnosis> {
    const model = await this.findWorkingGeminiModel(apiKey);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const promptText = `You are a certified master botanist and plant pathologist.
Analyze this plant issue:
Plant: ${plantName || 'Unknown Garden Plant'}
Selected Symptoms: ${symptoms.join(', ') || 'Not specified'}
User description: ${notes || 'None'}

Please respond strictly in valid JSON with this format:
{
  "plantName": "${plantName || 'Garden Plant'}",
  "suspectedIssue": "Primary diagnosed disease or pest",
  "confidenceScore": 85,
  "severity": "medium",
  "symptomsIdentified": ["symptom 1", "symptom 2"],
  "possibleCauses": ["cause 1", "cause 2"],
  "safeOrganicRemedies": ["remedy 1", "remedy 2"],
  "preventionAdvice": ["prevention 1", "prevention 2"],
  "disclaimer": "AI photo screening is an assistive assessment and not an absolute laboratory diagnosis. Always inspect stems and soil directly."
}`;

    const parts: any[] = [{ text: promptText }];

    if (base64Image) {
      const mimeMatch = base64Image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const cleanBase64 = base64Image.replace(/^data:[a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+;base64,/, '');
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: cleanBase64
        }
      });
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!res.ok) throw new Error(`Diagnosis API returned ${res.status}`);
    const data = await res.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawJson);

    return {
      plantName: parsed.plantName || plantName || 'Garden Plant',
      suspectedIssue: parsed.suspectedIssue || 'Environmental Stress',
      confidenceScore: parsed.confidenceScore || 80,
      isAiGenerated: true,
      severity: parsed.severity || 'medium',
      symptomsIdentified: parsed.symptomsIdentified || symptoms,
      possibleCauses: parsed.possibleCauses || ['Watering imbalance', 'Nutrient fluctuation'],
      safeOrganicRemedies: parsed.safeOrganicRemedies || ['Inspect soil moisture before watering', 'Apply mild organic neem oil spray'],
      preventionAdvice: parsed.preventionAdvice || ['Improve airflow', 'Ensure container has drainage holes'],
      disclaimer: "AI photo screening is an assistive recommendation and not a laboratory culture test. Inspect plant tissue directly before treatment."
    };
  }

  private static generateBotanicalMatrixDiagnosis(
    plantName: string,
    symptoms: string[],
    notes: string
  ): PlantDoctorDiagnosis {
    const sStr = (symptoms.join(' ') + ' ' + notes).toLowerCase();
    
    if (sStr.includes('yellow') && (sStr.includes('overwater') || sStr.includes('droop') || sStr.includes('soggy') || sStr.includes('soil'))) {
      return {
        plantName: plantName || 'Potted Plant',
        suspectedIssue: "Overwatering & Root Oxygen Deprivation (Edema)",
        confidenceScore: 88,
        isAiGenerated: false,
        severity: 'medium',
        symptomsIdentified: ["Yellowing lower leaves", "Soft, droopy stems", "Damp topsoil that won't dry"],
        possibleCauses: ["Frequent watering before top 1-2 inches dry out", "Poor pot drainage", "Compacted potting soil"],
        safeOrganicRemedies: [
          "Hold all watering immediately for 4-6 days until top 2 inches dry.",
          "Check drainage holes at bottom of pot to ensure water drains freely.",
          "Gently aerate top layer of soil with a fork to introduce oxygen to root zone."
        ],
        preventionAdvice: [
          "Adopt the 'Finger Check' test: only water when dry to first knuckle.",
          "Empty excess saucer water 15 minutes after watering."
        ],
        disclaimer: "Verified botanical diagnostic guideline. Not a substitute for physical soil inspection."
      };
    }

    if (sStr.includes('white') || sStr.includes('powder') || sStr.includes('mold') || sStr.includes('mildew')) {
      return {
        plantName: plantName || 'Garden Plant',
        suspectedIssue: "Powdery Mildew (Fungal Infection)",
        confidenceScore: 92,
        isAiGenerated: false,
        severity: 'medium',
        symptomsIdentified: ["White powdery dusting on leaf surfaces", "Curling foliage", "Dull leaf appearance"],
        possibleCauses: ["High ambient humidity with stagnant airflow", "Wetting leaves during late evening watering"],
        safeOrganicRemedies: [
          "Prune and discard severely infected leaves immediately (do not compost them).",
          "Spray leaves with organic baking soda solution: 1 tsp baking soda + 1/2 tsp gentle dish soap in 1 litre water.",
          "Alternatively apply dilute milk spray (40% milk, 60% water) in morning sunshine."
        ],
        preventionAdvice: [
          "Always water at the base of the plant, never over the foliage.",
          "Ensure adequate spacing between plants to permit gentle breeze circulation."
        ],
        disclaimer: "Organic horticultural recommendation verified by agricultural extensions."
      };
    }

    if (sStr.includes('bug') || sStr.includes('pest') || sStr.includes('aphid') || sStr.includes('sticky') || sStr.includes('web')) {
      return {
        plantName: plantName || 'Garden Plant',
        suspectedIssue: "Sucking Insect Infestation (Aphids or Spider Mites)",
        confidenceScore: 86,
        isAiGenerated: false,
        severity: 'medium',
        symptomsIdentified: ["Sticky residue (honeydew)", "Curled young leaf tips", "Tiny moving clusters under leaves"],
        possibleCauses: ["Hot, dry microclimates", "Excessive nitrogen fertilizer causing soft lush foliage"],
        safeOrganicRemedies: [
          "Dislodge pests using a firm spray of clean tap water under leaf undersides.",
          "Spray cold-pressed organic Neem Oil (5ml per litre with 2 drops soap) at sunset.",
          "Introduce friendly predator insects like ladybugs or lacewing larvae."
        ],
        preventionAdvice: [
          "Interplant companion flowers like French Marigolds and Alyssum to lure natural predators.",
          "Inspect leaf undersides once every week."
        ],
        disclaimer: "Verified integrated pest management (IPM) guideline."
      };
    }

    // Default gentle environmental diagnosis
    return {
      plantName: plantName || 'Garden Specimen',
      suspectedIssue: "Early Environmental & Moisture Stress",
      confidenceScore: 78,
      isAiGenerated: false,
      severity: 'low',
      symptomsIdentified: symptoms.length > 0 ? symptoms : ["Mild foliage stress"],
      possibleCauses: ["Fluctuating sunlight intensity", "Inconsistent watering cycle", "Root acclimatization"],
      safeOrganicRemedies: [
        "Position plant in bright indirect morning light avoiding harsh midday scorching rays.",
        "Check soil moisture with a wooden stick or finger before adding water.",
        "Apply a 1-inch mulch of dry leaves or coco peat to preserve soil temperature."
      ],
      preventionAdvice: [
        "Keep a steady watering routine aligned with local weather.",
        "Feed with mild compost tea once every 3 weeks during active growth."
      ],
      disclaimer: "Verified botanical diagnostic guideline. Observe response over 3-5 days."
    };
  }

  /**
   * Generates helpful agronomic responses based on verified knowledge
   */
  private static generateDeterministicResponse(query: string): string {
    const q = query.toLowerCase();

    if (q.includes('tomato')) {
      const p = PlantKnowledgeService.getPlantByName('Cherry Tomato');
      return `🍅 **Cherry Tomato Guide:**
- **Best Season:** Spring to Early Summer (thrives in warm sunny weather)
- **Sunlight:** Needs at least 6 to 8 hours of direct sunshine daily
- **Watering:** Water deeply 2-3 times a week at the root level; irregular watering causes blossom end rot and skin splitting.
- **Companion Plants:** Plant with Sweet Basil and Marigolds to ward off tomato hornworms!
- **Harvest:** Approx 60-70 days when fruits turn vibrant red and pull easily from the vine.`;
    }

    if (q.includes('basil')) {
      const p = PlantKnowledgeService.getPlantByName('Sweet Basil');
      return `🌿 **Sweet Basil Growing Advice:**
- **Ideal Spot:** Sunny windowsill or balcony receiving 5+ hours of sun.
- **Soil:** Rich, warm, loose potting soil with great drainage.
- **Watering:** Water in the morning when the top inch of soil is dry.
- **Pro Tip:** Pinch off the top flower buds as soon as they appear to encourage bushy leaf growth instead of woody stems!`;
    }

    if (q.includes('yellow') && q.includes('leaf')) {
      return `🍂 **Why Are Your Plant's Leaves Turning Yellow?**
1. **Most Common Culprit: Overwatering.** If lower leaves are yellow and feel soft or watery, the soil is holding excess water. Let it dry out!
2. **Underwatering:** If leaves are yellow, brittle, and crispy with drooping stems, give the plant a thorough deep soak.
3. **Nutrient Deficiency (Nitrogen):** If older leaves turn uniformly pale yellow while veins look normal, feed with well-rotted compost or seaweed fertilizer.
4. **Insufficient Sunlight:** Relocate to a brighter position with gentle morning light.`;
    }

    if (q.includes('beginner') || q.includes('start') || q.includes('easy')) {
      return `🌱 **Top 5 Beginner-Friendly Plants to Start Today:**
1. **Sweet Basil:** Grows quickly, delicious for cooking, easy in any pot.
2. **Cherry Belle Radish:** Ready to harvest in just 24 days! Immediate gratification.
3. **Spearmint:** Incredibly vigorous; keep in its own pot for refreshing mint tea.
4. **Butterhead Lettuce:** High yield in small balcony containers and shady spots.
5. **French Marigolds:** Cheerful bright blooms that naturally repel insect pests.`;
    }

    return `🌱 **GrowMate AI Agronomic Assistant**
I'm here to help you step away from screens and connect with living soil!

Here are quick actions you can try:
- Ask: *"How do I start a balcony herb garden?"*
- Ask: *"Why are my plant leaves curling?"*
- Ask: *"What can I plant this month in a small pot?"*
- Or use the **Garden Planner** tab to generate a custom planting schedule tailored to your city and sun exposure!`;
  }
}
