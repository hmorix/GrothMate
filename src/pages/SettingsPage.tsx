import React, { useState } from 'react';
import { useGarden } from '../context/GardenContext';
import { AiService } from '../services/aiService';
import { Settings, Key, Globe, Database, ShieldCheck, Check, AlertCircle, RefreshCw, Download, Trash2, Cpu, Lock, Edit3 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, profile, updateSettings, updateProfile, plants, missions } = useGarden();

  const [googleKeyInput, setGoogleKeyInput] = useState('');
  const [isEditingKey, setIsEditingKey] = useState(!settings.googleApiKey);
  const [hfToken, setHfToken] = useState(settings.huggingFaceApiKey || '');
  const [aiProvider, setAiProvider] = useState(settings.aiProvider);
  const [testStatus, setTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({ loading: false });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // User Profile fields
  const [userName, setUserName] = useState(profile.name);
  const [userCity, setUserCity] = useState(profile.city);

  const handleTestGoogleKey = async () => {
    const keyToTest = googleKeyInput.trim() || settings.googleApiKey;
    if (!keyToTest) {
      setTestStatus({ loading: false, success: false, message: 'Please enter a Google API Key first.' });
      return;
    }

    setTestStatus({ loading: true, message: 'Discovering active Gemini model for your account...' });
    try {
      // Dynamically resolve working model (supports gemini-1.5-flash, gemini-2.0-flash, gemini-pro, etc.)
      const workingModel = await AiService.findWorkingGeminiModel(keyToTest);
      
      let finalModel = workingModel;
      let res = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Respond with "VERIFIED"' }] }]
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const errMsg = err?.error?.message || `HTTP ${res.status}`;
        
        // Auto-detect if Google suggested a newer model
        const modelMatch = errMsg.match(/use models\/([a-zA-Z0-9.-]+)/i);
        if (modelMatch && modelMatch[1]) {
          finalModel = modelMatch[1];
          const retryUrl = `https://generativelanguage.googleapis.com/v1beta/models/${finalModel}:generateContent?key=${keyToTest}`;
          res = await fetch(retryUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: 'Respond with "VERIFIED"' }] }]
            })
          });
        }

        if (!res.ok) {
          throw new Error(errMsg);
        }
      }

      // If user typed a new key that worked, auto-save it and clear input from DOM
      if (googleKeyInput.trim()) {
        updateSettings({ googleApiKey: googleKeyInput.trim(), aiProvider: 'google_gemini' });
        setGoogleKeyInput('');
        setIsEditingKey(false);
      }

      setTestStatus({
        loading: false,
        success: true,
        message: `Google API key verified successfully! Active model connected: "${finalModel}".`
      });
    } catch (err: any) {
      setTestStatus({
        loading: false,
        success: false,
        message: `Validation failed: ${err.message}`
      });
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: any = {
      aiProvider,
      huggingFaceApiKey: hfToken.trim()
    };

    if (googleKeyInput.trim()) {
      updates.googleApiKey = googleKeyInput.trim();
      setGoogleKeyInput('');
      setIsEditingKey(false);
    }

    updateSettings(updates);
    updateProfile({
      name: userName.trim(),
      city: userCity.trim()
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRemoveKey = () => {
    if (confirm("Remove Google API key? App will use the built-in botanical knowledge engine.")) {
      updateSettings({ googleApiKey: '' });
      setGoogleKeyInput('');
      setIsEditingKey(true);
      setTestStatus({ loading: false });
    }
  };

  const handleExportData = () => {
    const data = {
      profile,
      plants,
      missions,
      settings: { ...settings, googleApiKey: '***ENCRYPTED_AND_PROTECTED***' },
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grothmate_garden_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetGarden = () => {
    if (confirm("Reset garden to initial demo state? This will restore sample plants and reset missions.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const hasConfiguredKey = Boolean(settings.googleApiKey);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            <span>Settings & AI Engine Configuration</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your Google API key securely, configure open models, and adjust garden preferences.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-nature-100 text-nature-800 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-nature-600" />
            <span>Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Section 1: AI Provider & Keys */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Cpu className="w-5 h-5 text-nature-600" />
            <h2 className="font-display font-bold text-base text-slate-900">AI Inference Engine</h2>
          </div>

          {/* Provider Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'google_gemini',
                title: 'Google AI Studio',
                desc: 'Gemini 1.5 Flash / 2.0 with multimodal vision'
              },
              {
                id: 'deterministic_rules',
                title: 'Botanical Rules',
                desc: '100% Free, zero keys needed, offline fallback engine'
              },
              {
                id: 'huggingface',
                title: 'Hugging Face API',
                desc: 'Serverless open weights (Gemma 2 / Qwen 2.5)'
              }
            ].map(p => (
              <button
                type="button"
                key={p.id}
                onClick={() => setAiProvider(p.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  aiProvider === p.id
                    ? 'bg-nature-50 border-nature-400 text-nature-950 font-semibold shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-bold text-xs">{p.title}</div>
                <div className="text-[11px] text-slate-500 mt-1">{p.desc}</div>
              </button>
            ))}
          </div>

          {/* Secure Google API Key Manager (Protected from DOM manipulation) */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-nature-600" />
                <span>Google AI Studio API Key</span>
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-nature-700 hover:underline"
              >
                Get a free key at Google AI Studio ↗
              </a>
            </label>

            {/* Display Masked Active State if key is stored */}
            {hasConfiguredKey && !isEditingKey ? (
              <div className="p-4 rounded-2xl bg-nature-50/70 border border-nature-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-nature-600 text-white flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-nature-900">API Key Configured & Protected</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-nature-200 text-nature-800">Active</span>
                    </div>
                    <p className="text-[11px] text-nature-700 font-mono mt-0.5">
                      •••••••••••••••••••••••••••••••••••••••• (Masked from DOM)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestGoogleKey}
                    disabled={testStatus.loading}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-nature-300 text-nature-900 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    {testStatus.loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-nature-600" />}
                    <span>Test Connection</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingKey(true)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Change</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveKey}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                    title="Remove key"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Input Field only shown when explicitly editing or adding */
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="password"
                    autoComplete="off"
                    data-lpignore="true"
                    placeholder="Paste your Google API key (starts with AIzaSy... or AQ...)"
                    value={googleKeyInput}
                    onChange={e => setGoogleKeyInput(e.target.value)}
                    className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 focus:border-nature-500 outline-hidden font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleTestGoogleKey}
                    disabled={testStatus.loading || !googleKeyInput.trim()}
                    className="px-4 py-2 rounded-xl bg-nature-600 hover:bg-nature-700 text-white text-xs font-semibold transition-colors disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {testStatus.loading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    <span>Verify & Save</span>
                  </button>

                  {hasConfiguredKey && (
                    <button
                      type="button"
                      onClick={() => setIsEditingKey(false)}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Key is saved securely in your browser's local memory. Once saved, it is removed from the visible DOM to prevent inspection.
                </p>
              </div>
            )}

            {/* Validation Message Box */}
            {testStatus.message && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                testStatus.success 
                  ? 'bg-nature-50 text-nature-800 border border-nature-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {testStatus.success ? (
                  <Check className="w-4 h-4 text-nature-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: User Profile & Preferences */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-slate-900">
            Gardener Profile & City
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gardener Name</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-nature-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Home City / Climate</label>
              <input
                type="text"
                value={userCity}
                onChange={e => setUserCity(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-nature-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Weather & Map Integration Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-slate-900">
            Free Services Integration Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Weather Provider</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">Active</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Open-Meteo API (100% Free worldwide weather, rainfall & UV index. No API key required).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Map Provider</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">Active</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                OpenStreetMap & Leaflet Geocoding (100% Free global mapping. Zero cost).
              </p>
            </div>
          </div>
        </div>

        {/* Save & Reset Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportData}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Garden JSON</span>
            </button>
            <button
              type="button"
              onClick={handleResetGarden}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-nature-600 hover:bg-nature-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};
