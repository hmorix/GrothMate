import React, { useState } from 'react';
import { useGarden } from '../context/GardenContext';
import { AiService } from '../services/aiService';
import { PlantDoctorDiagnosis } from '../types';
import { Stethoscope, Upload, AlertCircle, ShieldAlert, CheckCircle2, Sparkles, RefreshCw, Camera } from 'lucide-react';
import { AiBadge } from '../components/common/AiBadge';

const COMMON_SYMPTOMS = [
  "Yellowing lower leaves",
  "White powdery spots on leaves",
  "Curled or warped leaf tips",
  "Drooping or limp stems despite watering",
  "Brown dry crispy leaf margins",
  "Tiny webs or sticky honeydew residue",
  "Holes or chewed notches in leaves",
  "Stunted new growth"
];

export const PlantHealthPage: React.FC = () => {
  const { settings, plants } = useGarden();

  const [selectedPlantName, setSelectedPlantName] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<PlantDoctorDiagnosis | null>(null);

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0 && !notes.trim() && !imagePreview) {
      alert("Please select at least one symptom or describe what you see.");
      return;
    }

    setIsDiagnosing(true);
    setDiagnosis(null);

    try {
      const result = await AiService.diagnosePlantHealth(
        selectedPlantName || 'Garden Plant',
        selectedSymptoms,
        notes,
        imagePreview,
        {
          provider: settings.aiProvider,
          googleApiKey: settings.googleApiKey,
          hfApiToken: settings.huggingFaceApiKey,
          hfModel: settings.huggingFaceModel
        }
      );
      setDiagnosis(result);
    } catch (err) {
      console.warn("Diagnosis failed:", err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-rose-500" />
            <span>Plant Health Assistant & Disease Doctor</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Multimodal visual symptom screening backed by verified integrated pest management (IPM) rules.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          {settings.googleApiKey ? 'Multimodal Vision Active' : 'Botanical Matrix Fallback'}
        </span>
      </div>

      {/* Diagnosis Intake Form */}
      <form onSubmit={handleDiagnose} className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        
        {/* Plant selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Select Your Plant (or type name)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Sweet Basil, Cherry Tomato, Spinach..."
              value={selectedPlantName}
              onChange={e => setSelectedPlantName(e.target.value)}
              className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 focus:border-rose-400 outline-hidden"
            />
            {plants.length > 0 && (
              <select
                onChange={e => setSelectedPlantName(e.target.value)}
                className="p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              >
                <option value="">Quick Pick from Garden...</option>
                {plants.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Symptoms checklist */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Visible Symptoms (Check all that apply):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMMON_SYMPTOMS.map((sym, idx) => {
              const isChecked = selectedSymptoms.includes(sym);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => toggleSymptom(sym)}
                  className={`p-3 text-xs rounded-xl border text-left flex items-center justify-between transition-all ${
                    isChecked
                      ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{sym}</span>
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Upload or Capture */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Upload Plant Photo for Multimodal Visual Screening (Optional)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
              <Camera className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-700">Click to upload leaf or stem photo</span>
              <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP (Processed locally / Google API)</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {imagePreview && (
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                <img src={imagePreview} alt="Plant Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-[10px]"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Written Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Additional Observations (e.g. When did it start? How often do you water?)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Started 3 days ago after heavy rain; bottom leaves are floppy..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-rose-400 outline-hidden"
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isDiagnosing}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDiagnosing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Screening Symptoms & Pathogens...</span>
              </>
            ) : (
              <>
                <Stethoscope className="w-4 h-4" />
                <span>Analyze Plant Health</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Diagnosis Results Card */}
      {diagnosis && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Diagnosis Result</span>
                <AiBadge isAiGenerated={diagnosis.isAiGenerated} />
              </div>
              <h2 className="font-display font-extrabold text-2xl text-slate-900 mt-1">
                {diagnosis.suspectedIssue}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                diagnosis.severity === 'high' 
                  ? 'bg-rose-100 text-rose-800' 
                  : diagnosis.severity === 'medium' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                Severity: {diagnosis.severity}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                Confidence: {diagnosis.confidenceScore}%
              </span>
            </div>
          </div>

          {/* Causes & Remedies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Probable Causes */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Probable Root Causes:</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {diagnosis.possibleCauses.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safe Organic Remedies */}
            <div className="space-y-3 bg-nature-50/60 p-4 rounded-2xl border border-nature-200/60">
              <h3 className="text-xs font-bold text-nature-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-nature-600" />
                <span>Safe Organic Remedies & Next Steps:</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-800">
                {diagnosis.safeOrganicRemedies.map((remedy, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-nature-600 font-bold">✓</span>
                    <span>{remedy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Prevention Advice */}
          <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 text-xs text-sky-950 space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-sky-800">
              Long-Term Botanical Prevention
            </h4>
            <div className="space-y-1">
              {diagnosis.preventionAdvice.map((adv, idx) => (
                <p key={idx} className="leading-relaxed">• {adv}</p>
              ))}
            </div>
          </div>

          {/* Responsible AI Disclaimer */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-snug">{diagnosis.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
