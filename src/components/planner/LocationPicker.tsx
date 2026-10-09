import React, { useState } from 'react';
import { MapPin, Search, Globe, Check, Navigation } from 'lucide-react';
import { WeatherService } from '../../services/weatherService';

interface LocationPickerProps {
  currentCity: string;
  currentCountry: string;
  latitude: number;
  longitude: number;
  onLocationSelected: (city: string, country: string, lat: number, lon: number) => void;
}

const POPULAR_GARDEN_HUBS = [
  { city: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { city: 'San Francisco', country: 'USA', lat: 37.7749, lon: -122.4194 },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { city: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050 },
];

export const LocationPicker: React.FC<LocationPickerProps> = ({
  currentCity,
  currentCountry,
  latitude,
  longitude,
  onLocationSelected
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    const result = await WeatherService.geocodeCity(searchInput.trim());
    setIsSearching(false);

    if (result) {
      onLocationSelected(result.name, result.country, result.lat, result.lon);
      setSearchInput('');
    } else {
      setSearchError(`Could not find "${searchInput}". Try another nearby city or pick a preset hub below.`);
    }
  };

  const handleGeoLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationSelected(
          "My Current Location",
          "",
          Number(pos.coords.latitude.toFixed(4)),
          Number(pos.coords.longitude.toFixed(4))
        );
      },
      (err) => {
        alert("Location access was denied or timed out. Please enter your city manually.");
      }
    );
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-nature-100 flex items-center justify-center text-nature-700">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-800">Garden Climate Location</h3>
            <p className="text-xs text-slate-500">Determines local frost dates, sun hours & real-time weather</p>
          </div>
        </div>

        {/* Current Active Location Pill */}
        <div className="px-3 py-1 rounded-full bg-nature-50 border border-nature-200 text-xs font-semibold text-nature-800 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-nature-600" />
          <span>{currentCity} {currentCountry ? `(${currentCountry})` : ''}</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search city, PIN code, or region (e.g. Austin, Mumbai, Bristol)..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-nature-500 focus:ring-1 focus:ring-nature-200 outline-hidden"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-nature-600 hover:bg-nature-700 text-white transition-colors disabled:opacity-50"
        >
          {isSearching ? 'Locating...' : 'Search'}
        </button>
        <button
          type="button"
          onClick={handleGeoLocate}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-1"
          title="Use GPS Coordinates"
        >
          <Navigation className="w-3.5 h-3.5 text-nature-600" />
          <span className="hidden sm:inline">GPS</span>
        </button>
      </form>

      {searchError && (
        <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">{searchError}</p>
      )}

      {/* Preset Global Cities */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Popular Climate Presets:</p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_GARDEN_HUBS.map(hub => {
            const isSelected = hub.city.toLowerCase() === currentCity.toLowerCase();
            return (
              <button
                key={hub.city}
                type="button"
                onClick={() => onLocationSelected(hub.city, hub.country, hub.lat, hub.lon)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                  isSelected 
                    ? 'bg-nature-600 text-white border-nature-600 font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {hub.city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Map Canvas / OpenStreetMap Tile Preview */}
      <div className="relative h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
        {/* Clean Static OpenStreetMap Tile Layer embed */}
        <iframe
          title="OpenStreetMap Garden Area"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.08}%2C${latitude - 0.05}%2C${longitude + 0.08}%2C${latitude + 0.05}&layer=mapnik&marker=${latitude}%2C${longitude}`}
          className="opacity-80 pointer-events-none"
        />
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-slate-200 text-[10px] text-slate-600 font-mono">
          Coords: {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E (OpenStreetMap Free)
        </div>
      </div>
    </div>
  );
};
