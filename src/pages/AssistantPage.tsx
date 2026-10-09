import React, { useState, useRef, useEffect } from 'react';
import { useGarden } from '../context/GardenContext';
import { AiService } from '../services/aiService';
import { AiChatMessage, RecommendedPlantPlan } from '../types';
import { Bot, User, Send, Sparkles, Sprout, CornerDownLeft, ShieldCheck, Key } from 'lucide-react';
import { AiBadge } from '../components/common/AiBadge';

const PROMPT_CHIPS = [
  "What can I plant on a shady balcony right now?",
  "How do I prevent root rot in potted tomatoes?",
  "Generate a weekly gardening schedule for herbs",
  "Top 5 pest-repelling companion flowers",
  "How do I start a clean balcony compost bin?"
];

export const AssistantPage: React.FC<{ setCurrentTab: (t: string) => void }> = ({ setCurrentTab }) => {
  const { settings, profile, plants, weather } = useGarden();

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: `Hello! I'm your GrowMate AI companion 🌱\n\nI can help you select varieties, formulate weekly schedules, troubleshoot curling leaves, and plan companion crops tailored to ${settings.selectedCity}.\n\nAsk me anything, or pick one of the quick topics below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAiGenerated: false
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const weatherText = weather 
        ? `Live Weather in ${settings.selectedCity}: ${weather.temperatureC}°C, ${weather.weatherDescription}, Humidity: ${weather.humidity}%, 24h Rain: ${weather.forecastRainNext24hMm.toFixed(1)}mm.` 
        : `Location: ${settings.selectedCity}, ${settings.selectedCountry}.`;
      const gardenSummary = `User garden: ${plants.length} crops (${plants.map(p => p.name).join(', ')}). Location: ${settings.selectedCity}, ${settings.selectedCountry}. Setup: ${profile.gardenType}. Sunlight: ${profile.sunlight.replace('_', ' ')}. Experience: ${profile.experience}. ${weatherText}`;
      
      const response = await AiService.askAssistant(
        trimmed,
        messages,
        {
          provider: settings.aiProvider,
          googleApiKey: settings.googleApiKey,
          hfApiToken: settings.huggingFaceApiKey,
          hfModel: settings.huggingFaceModel
        },
        gardenSummary
      );

      const assistantMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiGenerated: response.isAiGenerated,
        structuredPlan: response.structuredPlan
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: `I encountered an unexpected issue connecting to the AI inference provider. Please check your API key in Settings, or continue using our verified botanical engine.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAiGenerated: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      
      {/* Top Assistant Header & Engine Status */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-nature-700 to-nature-500 text-white flex items-center justify-center shadow-md shadow-nature-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-slate-900">
              AI Gardening Assistant
            </h1>
            <p className="text-xs text-slate-500">
              Powered by {settings.googleApiKey ? 'Google Gemini 1.5 Flash' : 'Deterministic Botanical Engine'}
            </p>
          </div>
        </div>

        {/* Engine switcher pill */}
        <button
          onClick={() => setCurrentTab('settings')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors"
        >
          <Key className="w-3.5 h-3.5 text-nature-600" />
          <span>{settings.googleApiKey ? 'Configure Models' : 'Add Google API Key'}</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 min-h-[450px] max-h-[600px] overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                isUser 
                  ? 'bg-nature-600 text-white shadow-xs' 
                  : 'bg-emerald-100 text-nature-800'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                isUser
                  ? 'bg-nature-700 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <div className="flex items-center justify-between gap-3 text-[10px] opacity-75">
                  <span className="font-semibold">{isUser ? 'You' : 'GrowMate AI'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans text-xs">
                  {msg.content}
                </div>

                {!isUser && (
                  <div className="pt-1 flex items-center justify-between">
                    <AiBadge isAiGenerated={msg.isAiGenerated} />
                  </div>
                )}

                {/* Structured Plan Embed Card if present */}
                {msg.structuredPlan && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-slate-900 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-nature-800">🌱 {msg.structuredPlan.cropName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-nature-100 text-nature-800 font-semibold">
                        {msg.structuredPlan.daysToHarvest} days
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">{msg.structuredPlan.whyRecommended}</p>
                    <div className="text-[10px] text-slate-500 grid grid-cols-2 gap-1 pt-1 border-t border-slate-100">
                      <span>Spacing: {msg.structuredPlan.spacingCm}cm</span>
                      <span>Season: {msg.structuredPlan.plantingSeason}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-nature-800 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-nature-600 animate-spin" />
              <span>Analyzing botanical database and climate context...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Suggested Questions:</p>
        <div className="flex flex-wrap gap-1.5">
          {PROMPT_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1 text-xs rounded-xl bg-white hover:bg-nature-50 border border-slate-200 text-slate-700 hover:text-nature-900 transition-colors shadow-2xs text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputPrompt);
        }}
        className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask GrowMate anything (e.g. Can I grow cherry tomatoes in a 5L pot?)..."
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-xl outline-hidden text-slate-800 placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="px-4 py-2 rounded-xl bg-nature-600 hover:bg-nature-700 text-white font-semibold text-xs transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
