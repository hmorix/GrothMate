import React, { useState } from 'react';
import { useGarden } from '../context/GardenContext';
import { GardenSpaceType, SunlightExposure, ExperienceLevel } from '../types';
import { Sprout, ArrowRight, ArrowLeft, Check, Sun, Layers, MapPin, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingPage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { profile, updateProfile, settings, updateSettings } = useGarden();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile.name || 'Gardener');
  const [city, setCity] = useState(profile.city || 'New Delhi');
  const [gardenType, setGardenType] = useState<GardenSpaceType>(profile.gardenType || 'balcony');
  const [sunlight, setSunlight] = useState<SunlightExposure>(profile.sunlight || 'full_sun');
  const [experience, setExperience] = useState<ExperienceLevel>(profile.experience || 'beginner');

  const handleFinish = () => {
    updateProfile({
      name: name.trim() || 'Gardener',
      city: city.trim() || 'New Delhi',
      gardenType,
      sunlight,
      experience,
      onboarded: true
    });

    updateSettings({
      selectedCity: city.trim() || 'New Delhi'
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    onComplete();
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 space-y-6">
        
        {/* Step indicator */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Step {step} of 4</span>
          <span className="text-nature-700 font-bold">
            {step === 1 ? 'Location & Profile' : step === 2 ? 'Garden Setup' : step === 3 ? 'Sunlight' : 'Experience'}
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-nature-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-nature-100 text-nature-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900">
              Welcome to GrowMate AI 🌱
            </h2>
            <p className="text-xs text-slate-500">
              Tell us your name and hometown so we can tune your watering and planting calendar to your local climate.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-nature-500 outline-hidden"
                  placeholder="e.g. Maya"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your City / PIN Code</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-nature-500 outline-hidden"
                  placeholder="e.g. New Delhi, Austin, London..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900">
              Where will your plants grow?
            </h2>
            <p className="text-xs text-slate-500">
              Select your primary growing area. You can add more later.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[
                { id: 'balcony', label: 'Balcony Garden', icon: '🪴' },
                { id: 'pots', label: 'Pots & Planters', icon: '🏺' },
                { id: 'terrace', label: 'Rooftop Terrace', icon: '🏙️' },
                { id: 'backyard', label: 'Backyard Ground', icon: '🏡' },
                { id: 'indoor', label: 'Indoor Window', icon: '🪟' },
                { id: 'community', label: 'Community Plot', icon: '🌻' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setGardenType(item.id as GardenSpaceType)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    gardenType === item.id
                      ? 'bg-nature-600 text-white border-nature-600 font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900">
              How much direct sunshine does your spot get?
            </h2>
            <p className="text-xs text-slate-500">
              Sunlight dictates which herbs or vegetables will thrive without stretching.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'full_sun', label: 'Full Sun', desc: '6+ hours of hot, direct sunshine daily (Tomatoes, Peppers, Basil)' },
                { id: 'partial_shade', label: 'Partial Shade', desc: '3 to 5 hours of morning/gentle sun (Lettuce, Mint, Spinach)' },
                { id: 'deep_shade', label: 'Deep Shade', desc: 'Bright ambient daylight, very little direct sun (Herbs, Ferns)' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSunlight(item.id as SunlightExposure)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    sunlight === item.id
                      ? 'bg-nature-600 text-white border-nature-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{item.label}</p>
                  <p className={`text-[11px] mt-0.5 ${sunlight === item.id ? 'text-white/90' : 'text-slate-500'}`}>
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-nature-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900">
              What is your gardening experience?
            </h2>
            <p className="text-xs text-slate-500">
              We adjust difficulty ratings and advice depth according to your confidence.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'beginner', title: 'Beginner', desc: 'New to gardening. I want forgiving crops with fast harvest wins!' },
                { id: 'intermediate', title: 'Intermediate', desc: 'I have kept plants alive and know how to prune and water.' },
                { id: 'expert', title: 'Expert Greenthumb', desc: 'Experienced with soil microbiology, seeds, and pest management.' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setExperience(item.id as ExperienceLevel)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    experience === item.id
                      ? 'bg-nature-600 text-white border-nature-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{item.title}</p>
                  <p className={`text-[11px] mt-0.5 ${experience === item.id ? 'text-white/90' : 'text-slate-500'}`}>
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-nature-600 hover:bg-nature-700 text-white flex items-center gap-1.5 shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-nature-600 hover:bg-nature-700 text-white flex items-center gap-1.5 shadow-md"
            >
              <Sprout className="w-4 h-4" />
              <span>Enter My Garden</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
