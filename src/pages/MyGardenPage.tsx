import React, { useState } from 'react';
import { useGarden } from '../context/GardenContext';
import { PlantCard } from '../components/garden/PlantCard';
import { AddPlantModal } from '../components/garden/AddPlantModal';
import { PlantTimeline } from '../components/garden/PlantTimeline';
import { Modal } from '../components/common/Modal';
import { Plant, GardenSpaceType, GrowthStage } from '../types';
import { Sprout, Plus, Filter, Search } from 'lucide-react';

export const MyGardenPage: React.FC = () => {
  const { 
    plants, 
    weather, 
    waterPlant, 
    addPlant, 
    updatePlant, 
    deletePlant, 
    addObservation, 
    addHarvest 
  } = useGarden();

  const [selectedSpace, setSelectedSpace] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const spaces: { id: string; label: string }[] = [
    { id: 'all', label: 'All Spaces' },
    { id: 'balcony', label: 'Balcony' },
    { id: 'pots', label: 'Pots & Containers' },
    { id: 'terrace', label: 'Terrace' },
    { id: 'backyard', label: 'Backyard' },
    { id: 'indoor', label: 'Indoor' },
  ];

  const stages: { id: string; label: string }[] = [
    { id: 'all', label: 'All Stages' },
    { id: 'seedling', label: 'Seedling' },
    { id: 'growing', label: 'Growing' },
    { id: 'flowering', label: 'Flowering' },
    { id: 'fruiting', label: 'Fruiting' },
    { id: 'harvested', label: 'Harvested' },
  ];

  const filteredPlants = plants.filter(plant => {
    const spaceMatch = selectedSpace === 'all' || plant.spaceType === selectedSpace;
    const stageMatch = selectedStage === 'all' || plant.currentStage === selectedStage;
    const queryMatch = !searchQuery.trim() || 
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      plant.variety.toLowerCase().includes(searchQuery.toLowerCase());
    return spaceMatch && stageMatch && queryMatch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-2">
            <span>My Garden</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-nature-100 text-nature-800 font-semibold">
              {plants.length} Active Crops
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track seed germination, vegetative growth, flowering, and fresh harvests.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-nature-600 hover:bg-nature-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plant</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search query input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by plant or variety name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-nature-500 outline-hidden"
            />
          </div>

          {/* Stage filter dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedStage}
              onChange={e => setSelectedStage(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 focus:border-nature-500 outline-hidden bg-white text-slate-700"
            >
              {stages.map(st => (
                <option key={st.id} value={st.id}>{st.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Space pill tabs */}
        <div className="flex space-x-1 overflow-x-auto pt-1 border-t border-slate-100 scrollbar-none">
          {spaces.map(sp => {
            const isSelected = selectedSpace === sp.id;
            return (
              <button
                key={sp.id}
                onClick={() => setSelectedSpace(sp.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-nature-700 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plants Grid */}
      {filteredPlants.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Sprout className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No crops found matching this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try choosing 'All Spaces' or clear your search query to see your other plants.
          </p>
          <button
            onClick={() => { setSelectedSpace('all'); setSelectedStage('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map(plant => (
            <PlantCard
              key={plant.id}
              plant={plant}
              weather={weather}
              onSelect={setSelectedPlant}
              onWater={waterPlant}
            />
          ))}
        </div>
      )}

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addPlant}
      />

      {/* Plant Detail & Timeline Modal */}
      {selectedPlant && (
        <Modal
          isOpen={!!selectedPlant}
          onClose={() => setSelectedPlant(null)}
          title={`Seed-to-Harvest: ${selectedPlant.name}`}
          maxWidth="max-w-2xl"
        >
          <PlantTimeline
            plant={selectedPlant}
            onClose={() => setSelectedPlant(null)}
            onUpdateStage={(st: GrowthStage) => {
              updatePlant(selectedPlant.id, { currentStage: st });
              setSelectedPlant(p => p ? { ...p, currentStage: st } : null);
            }}
            onAddObservation={(obs) => {
              addObservation(selectedPlant.id, obs);
              setSelectedPlant(p => p ? { ...p, observations: [{ id: `obs-${Date.now()}`, ...obs }, ...p.observations] } : null);
            }}
            onAddHarvest={(h) => {
              addHarvest(selectedPlant.id, h);
              setSelectedPlant(p => p ? { ...p, harvests: [{ id: `harvest-${Date.now()}`, ...h }, ...p.harvests] } : null);
            }}
            onDeletePlant={(id) => {
              deletePlant(id);
              setSelectedPlant(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};
