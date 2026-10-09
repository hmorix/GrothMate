import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Plant, GardenSpaceType, SunlightExposure, GrowthStage, WaterNeedLevel } from '../../types';
import { VERIFIED_PLANT_DATABASE } from '../../services/plantKnowledgeService';
import { Sprout, Sparkles, BookOpen } from 'lucide-react';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plant: Omit<Plant, 'id' | 'observations' | 'harvests'>) => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [variety, setVariety] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [spaceType, setSpaceType] = useState<GardenSpaceType>('balcony');
  const [sunlight, setSunlight] = useState<SunlightExposure>('full_sun');
  const [currentStage, setCurrentStage] = useState<GrowthStage>('seedling');
  const [targetHarvestDays, setTargetHarvestDays] = useState(45);
  const [waterNeed, setWaterNeed] = useState<WaterNeedLevel>('moderate');
  const [containerSizeLitres, setContainerSizeLitres] = useState(5);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Auto-fill from verified database
  const handleSelectTemplate = (specName: string) => {
    const spec = VERIFIED_PLANT_DATABASE.find(p => p.name === specName);
    if (spec) {
      setName(spec.name);
      setVariety(spec.variety);
      setScientificName(spec.scientificName);
      setSunlight(spec.sunlight);
      setTargetHarvestDays(spec.daysToHarvest);
      setWaterNeed(spec.waterNeed);
      setImageUrl(spec.imageUrl);
      setNotes(spec.description);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const plantedDate = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + Number(targetHarvestDays));

    onAdd({
      name: name.trim(),
      variety: variety.trim() || 'Standard Variety',
      scientificName: scientificName.trim(),
      spaceType,
      sunlight,
      plantedDate,
      currentStage,
      targetHarvestDays: Number(targetHarvestDays),
      expectedHarvestDate: expDate.toISOString().split('T')[0],
      waterNeed,
      lastWateredDate: plantedDate,
      wateringIntervalDays: waterNeed === 'high' ? 2 : waterNeed === 'low' ? 5 : 3,
      containerSizeLitres: Number(containerSizeLitres),
      notes: notes.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
    });

    // Reset and close
    setName('');
    setVariety('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Crop to Your Garden" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Quick select template pill row */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-nature-600" />
            <span>Quick Pick from Verified Botanical Library:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100">
            {VERIFIED_PLANT_DATABASE.map(item => (
              <button
                type="button"
                key={item.name}
                onClick={() => handleSelectTemplate(item.name)}
                className="px-2.5 py-1 text-xs rounded-lg bg-white hover:bg-nature-50 border border-slate-200 text-slate-700 hover:text-nature-900 transition-colors"
              >
                🌱 {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Name & Variety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Plant / Crop Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Cherry Tomato"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-2 focus:ring-nature-200 outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Variety</label>
            <input
              type="text"
              placeholder="e.g. Sweet 100 / Genovese"
              value={variety}
              onChange={e => setVariety(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-2 focus:ring-nature-200 outline-hidden"
            />
          </div>
        </div>

        {/* Space & Sunlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Garden Space</label>
            <select
              value={spaceType}
              onChange={e => setSpaceType(e.target.value as GardenSpaceType)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-2 focus:ring-nature-200 outline-hidden bg-white capitalize"
            >
              <option value="pots">Pots / Containers</option>
              <option value="balcony">Balcony Garden</option>
              <option value="terrace">Terrace / Rooftop</option>
              <option value="backyard">Backyard Ground</option>
              <option value="indoor">Indoor Windowsill</option>
              <option value="community">Community Garden</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sunlight Exposure</label>
            <select
              value={sunlight}
              onChange={e => setSunlight(e.target.value as SunlightExposure)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-2 focus:ring-nature-200 outline-hidden bg-white"
            >
              <option value="full_sun">Full Sun (6+ hours)</option>
              <option value="partial_shade">Partial Shade (3-5h)</option>
              <option value="deep_shade">Deep Shade (Bright indirect)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Stage</label>
            <select
              value={currentStage}
              onChange={e => setCurrentStage(e.target.value as GrowthStage)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-2 focus:ring-nature-200 outline-hidden bg-white capitalize"
            >
              <option value="planned">Planned (Seeds on hand)</option>
              <option value="seedling">Seedling (Sprouted)</option>
              <option value="growing">Active Vegetative Growth</option>
              <option value="flowering">Flowering</option>
              <option value="fruiting">Fruiting</option>
            </select>
          </div>
        </div>

        {/* Harvest Days & Water Need */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Harvest (Days)</label>
            <input
              type="number"
              min="10"
              max="365"
              value={targetHarvestDays}
              onChange={e => setTargetHarvestDays(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-2 focus:ring-nature-200 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Watering Needs</label>
            <select
              value={waterNeed}
              onChange={e => setWaterNeed(e.target.value as WaterNeedLevel)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-2 focus:ring-nature-200 outline-hidden bg-white capitalize"
            >
              <option value="low">Low (Drought-tolerant, dry soil)</option>
              <option value="moderate">Moderate (Standard regular)</option>
              <option value="high">High (Evenly moist / thirsty)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pot Size (Litres)</label>
            <input
              type="number"
              min="1"
              max="200"
              value={containerSizeLitres}
              onChange={e => setContainerSizeLitres(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-2 focus:ring-nature-200 outline-hidden"
            />
          </div>
        </div>

        {/* Photo URL & Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Image URL</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-2 focus:ring-nature-200 outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Garden Notes & Soil Details</label>
          <textarea
            rows={2}
            placeholder="e.g. Mixed potting compost with perlite; placed near east-facing railing."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-2 focus:ring-nature-200 outline-hidden"
          />
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-nature-600 hover:bg-nature-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sprout className="w-4 h-4" />
            <span>Plant Now</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
