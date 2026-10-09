import React from 'react';
import { useGarden } from '../context/GardenContext';
import { WateringEngine, WateringAdvice } from '../services/wateringEngine';
import { CalendarService } from '../services/calendarService';
import { 
  Droplets, 
  CloudRain, 
  Sun, 
  AlertTriangle, 
  Calendar, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw,
  Info,
  Thermometer,
  Wind
} from 'lucide-react';

export const WeatherWateringPage: React.FC = () => {
  const { plants, weather, isWeatherLoading, refreshWeather, waterPlant, settings } = useGarden();

  // Evaluate watering recommendations for all plants
  const evaluations: { plant: any; advice: WateringAdvice }[] = weather 
    ? plants.map(p => ({ plant: p, advice: WateringEngine.evaluatePlantWatering(p, weather) }))
    : [];

  const handleExportGoogleCalendar = (plantName: string, advice: WateringAdvice) => {
    const nextDate = new Date(advice.nextRecommendedDate);
    nextDate.setHours(8, 0, 0, 0); // Morning 8:00 AM watering session

    const url = CalendarService.generateGoogleCalendarUrl({
      title: `🌱 Water ${plantName} - GrowMate AI`,
      description: `Recommended watering session for ${plantName}.\n\nSoil Check Advice: ${advice.soilCheckMethod}\n\nWeather: ${weather?.weatherDescription || 'Fair'}. Always verify soil moisture with finger test before watering.`,
      location: `${settings.selectedCity} Garden`,
      startDate: nextDate,
      durationMinutes: 15
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = (plantName: string, advice: WateringAdvice) => {
    const nextDate = new Date(advice.nextRecommendedDate);
    nextDate.setHours(8, 0, 0, 0);

    CalendarService.downloadIcsFile({
      title: `Water ${plantName} - GrowMate AI`,
      description: `Recommended watering session for ${plantName}. Soil check: ${advice.soilCheckMethod}`,
      location: `${settings.selectedCity} Garden`,
      startDate: nextDate,
      durationMinutes: 15
    });
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-sky-600" />
            <span>Weather & Smart Hydration Assistant</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dynamic, rain-aware watering algorithm that prevents root rot and adapts to local precipitation.
          </p>
        </div>

        <button
          onClick={() => refreshWeather()}
          disabled={isWeatherLoading}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isWeatherLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Weather</span>
        </button>
      </div>

      {/* Live Weather Forecast Dashboard */}
      {weather && (
        <div className="bg-gradient-to-br from-sky-50 via-slate-50 to-emerald-50/40 p-6 rounded-3xl border border-sky-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-display font-extrabold text-slate-900">
                  {weather.temperatureC}°C
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                  {weather.city} {weather.country ? `• ${weather.country}` : ''}
                </span>
              </div>
              <p className="text-xs text-slate-600 capitalize mt-1 font-medium">
                {weather.weatherDescription}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-2xs">
                <Droplets className="w-4 h-4 text-sky-500" />
                <span>Humidity: <strong>{weather.humidity}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-2xs">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span>24h Rain: <strong>{weather.forecastRainNext24hMm.toFixed(1)} mm</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-2xs">
                <Wind className="w-4 h-4 text-slate-500" />
                <span>Wind: <strong>{weather.windSpeedKmh} km/h</strong></span>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Micro-Cards */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              7-Day Precipitation & Temperature Forecast (Open-Meteo):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {weather.forecastDays.map((day, idx) => (
                <div key={idx} className="bg-white/90 p-3 rounded-2xl border border-slate-200 text-center space-y-1 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 block truncate">
                    {idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : day.date.slice(5)}
                  </span>
                  <div className="text-xs font-bold text-slate-900">
                    {day.tempMax}° / <span className="text-slate-500 font-normal">{day.tempMin}°</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-sky-600 font-semibold">
                    <CloudRain className="w-3 h-3" />
                    <span>{day.precipitationMm > 0 ? `${day.precipitationMm}mm` : `${day.rainProbability}%`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Horticultural Disclaimer Banner */}
      <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Recommendation Advisory Notice</p>
          <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
            All watering alerts provided are agronomic algorithmic estimates computed from plant growth stage, ambient temperature, and forecast rainfall. They are <strong>never physical sensor measurements</strong>. Always perform the 2-inch physical finger moisture test before watering.
          </p>
        </div>
      </div>

      {/* Plants Hydration Evaluation Table / Cards */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-lg text-slate-900">
          Plant-by-Plant Hydration Schedule ({evaluations.length})
        </h2>

        {evaluations.length === 0 ? (
          <p className="text-xs text-slate-500 bg-white p-8 rounded-2xl border border-slate-200 text-center">
            No crops registered in your garden yet. Add plants to activate smart watering recommendations!
          </p>
        ) : (
          <div className="space-y-3">
            {evaluations.map(({ plant, advice }) => (
              <div 
                key={plant.id} 
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-slate-900">{plant.name}</h3>
                    <span className="text-xs text-slate-500 italic">({plant.spaceType})</span>
                    
                    {/* Status Pill */}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      advice.shouldWaterToday
                        ? 'bg-sky-100 text-sky-800 border border-sky-200'
                        : advice.urgency === 'skip_rain'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : advice.urgency === 'overwater_warning'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {advice.shouldWaterToday 
                        ? 'Watering Recommended' 
                        : advice.urgency === 'skip_rain' 
                        ? 'Skip: Rain Forecast' 
                        : advice.urgency === 'overwater_warning'
                        ? 'Overwater Warning'
                        : 'Moisture Healthy'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {advice.recommendedAction}
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                    <p>• <strong>Soil check method:</strong> {advice.soilCheckMethod}</p>
                    <p>• <strong>Next estimated drink:</strong> {advice.nextRecommendedDate}</p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => waterPlant(plant.id)}
                    className="px-4 py-2 rounded-xl bg-nature-600 hover:bg-nature-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Mark Watered</span>
                  </button>

                  <button
                    onClick={() => handleExportGoogleCalendar(plant.name, advice)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
                    title="Export task to Google Calendar"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Google Cal</span>
                  </button>

                  <button
                    onClick={() => handleDownloadIcs(plant.name, advice)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors"
                    title="Download .ics Calendar file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
