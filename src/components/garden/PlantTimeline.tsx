import React, { useState } from 'react';
import { Plant, GrowthStage, PlantObservation, HarvestRecord } from '../../types';
import { 
  Calendar, 
  Clock, 
  Sprout, 
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  Droplets, 
  Sparkles,
  ArrowRight,
  Camera,
  Scissors
} from 'lucide-react';
import { AiBadge } from '../common/AiBadge';

interface PlantTimelineProps {
  plant: Plant;
  onClose: () => void;
  onUpdateStage: (stage: GrowthStage) => void;
  onAddObservation: (obs: Omit<PlantObservation, 'id'>) => void;
  onAddHarvest: (harvest: Omit<HarvestRecord, 'id'>) => void;
  onDeletePlant: (id: string) => void;
}

const STAGES: { key: GrowthStage; label: string; icon: string }[] = [
  { key: 'planned', label: 'Planned', icon: '📝' },
  { key: 'seedling', label: 'Seedling', icon: '🌱' },
  { key: 'growing', label: 'Growing', icon: '🌿' },
  { key: 'flowering', label: 'Flowering', icon: '🌸' },
  { key: 'fruiting', label: 'Fruiting', icon: '🍅' },
  { key: 'harvested', label: 'Harvested', icon: '🧺' },
];

export const PlantTimeline: React.FC<PlantTimelineProps> = ({
  plant,
  onClose,
  onUpdateStage,
  onAddObservation,
  onAddHarvest,
  onDeletePlant
}) => {
  const [obsNote, setObsNote] = useState('');
  const [obsHeight, setObsHeight] = useState<number | undefined>(undefined);
  const [harvestQty, setHarvestQty] = useState('');
  const [harvestNote, setHarvestNote] = useState('');
  const [showHarvestForm, setShowHarvestForm] = useState(false);

  const planted = new Date(plant.plantedDate);
  const now = new Date();
  const daysGrowing = Math.max(0, Math.floor((now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, Math.round((daysGrowing / plant.targetHarvestDays) * 100));

  const currentStageIndex = STAGES.findIndex(s => s.key === plant.currentStage);

  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsNote.trim()) return;

    onAddObservation({
      date: new Date().toISOString().split('T')[0],
      stage: plant.currentStage,
      note: obsNote.trim(),
      heightCm: obsHeight ? Number(obsHeight) : undefined
    });

    setObsNote('');
    setObsHeight(undefined);
  };

  const handleCreateHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!harvestQty.trim()) return;

    onAddHarvest({
      date: new Date().toISOString().split('T')[0],
      quantity: harvestQty.trim(),
      notes: harvestNote.trim()
    });

    setHarvestQty('');
    setHarvestNote('');
    setShowHarvestForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Card Summary */}
      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-4">
          <img 
            src={plant.imageUrl} 
            alt={plant.name}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-slate-900">{plant.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-nature-100 text-nature-800 capitalize">
                {plant.currentStage}
              </span>
            </div>
            <p className="text-xs text-slate-500 italic">{plant.variety} • {plant.spaceType}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-nature-600" />
                Planted: {plant.plantedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Target Harvest: ~{plant.expectedHarvestDate}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm(`Are you sure you want to remove ${plant.name}?`)) {
              onDeletePlant(plant.id);
              onClose();
            }
          }}
          className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 self-end sm:self-center"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove Crop</span>
        </button>
      </div>

      {/* Seed-to-Harvest Visual Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Seed-to-Harvest Trajectory: Day {daysGrowing} of {plant.targetHarvestDays}</span>
          <span className="font-bold text-nature-700">{progressPercent}% Window</span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-nature-500 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Interactive Growth Stage Switcher */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
          {STAGES.map((s, idx) => {
            const isPassed = idx <= currentStageIndex;
            const isCurrent = s.key === plant.currentStage;
            return (
              <button
                key={s.key}
                onClick={() => onUpdateStage(s.key)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-nature-600 text-white border-nature-600 shadow-xs font-bold scale-102'
                    : isPassed
                    ? 'bg-nature-50/70 text-nature-900 border-nature-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-base mb-1">{s.icon}</span>
                <span className="text-[11px] capitalize">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Log New Real-World Observation */}
      <div className="bg-nature-50/50 p-4 rounded-2xl border border-nature-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-nature-600" />
            <span>Real-World Growth Observation Log</span>
          </h4>
          <span className="text-[11px] text-nature-700">Touch real leaves, record truth</span>
        </div>

        <form onSubmit={handleCreateObservation} className="space-y-2">
          <textarea
            required
            rows={2}
            placeholder="What do you see today? (e.g. 4 new leaf stems unfurled, stem thickened, subtle floral aroma)"
            value={obsNote}
            onChange={e => setObsNote(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-1 focus:ring-nature-200 outline-hidden bg-white"
          />
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Height (cm, optional)"
              value={obsHeight || ''}
              onChange={e => setObsHeight(e.target.value ? Number(e.target.value) : undefined)}
              className="w-36 p-2 text-xs rounded-xl border border-slate-200 focus:border-nature-500 outline-hidden bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-nature-600 hover:bg-nature-700 text-white transition-colors flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Observation</span>
            </button>
          </div>
        </form>
      </div>

      {/* Harvest Action Trigger */}
      <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Harvested Your Produce?</h4>
            <p className="text-xs text-amber-800">Record fresh yield picked with your hands.</p>
          </div>
          <button
            onClick={() => setShowHarvestForm(!showHarvestForm)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors flex items-center gap-1"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Record Harvest</span>
          </button>
        </div>

        {showHarvestForm && (
          <form onSubmit={handleCreateHarvest} className="mt-3 pt-3 border-t border-amber-200 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                required
                type="text"
                placeholder="Quantity (e.g. 250g / 12 fruits / 1 cup leaves)"
                value={harvestQty}
                onChange={e => setHarvestQty(e.target.value)}
                className="p-2 text-xs rounded-xl border border-amber-300 focus:border-amber-500 outline-hidden bg-white"
              />
              <input
                type="text"
                placeholder="Tasting note (e.g. Super sweet & crisp!)"
                value={harvestNote}
                onChange={e => setHarvestNote(e.target.value)}
                className="p-2 text-xs rounded-xl border border-amber-300 focus:border-amber-500 outline-hidden bg-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-amber-700 hover:bg-amber-800 text-white transition-colors"
              >
                Save Harvest Yield
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Timeline Observation History */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Timeline Entries ({plant.observations.length})</h4>
        
        {plant.observations.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No notes recorded yet. Walk out and observe your plant!</p>
        ) : (
          <div className="relative border-l-2 border-nature-200 ml-3 space-y-4 py-1">
            {plant.observations.map((obs) => (
              <div key={obs.id} className="relative pl-6">
                <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-nature-500 border-2 border-white shadow-xs" />
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-nature-800 capitalize">Stage: {obs.stage}</span>
                    <span>{obs.date}</span>
                  </div>
                  <p className="text-xs text-slate-700">{obs.note}</p>
                  {obs.heightCm && (
                    <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Height: {obs.heightCm} cm
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Harvest Records if any */}
      {plant.harvests.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Harvest History ({plant.harvests.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {plant.harvests.map(h => (
              <div key={h.id} className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <div className="flex justify-between font-bold text-amber-900">
                  <span>{h.quantity}</span>
                  <span className="text-[10px] font-normal text-amber-700">{h.date}</span>
                </div>
                {h.notes && <p className="text-slate-600 mt-1 italic">{h.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Close */}
      <div className="flex justify-end pt-3 border-t border-slate-100">
        <button
          onClick={onClose}
          className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-white hover:bg-slate-900 transition-colors"
        >
          Close Timeline
        </button>
      </div>
    </div>
  );
};
