import React from 'react';
import { 
  Sprout, 
  LayoutDashboard, 
  Calendar, 
  Bot, 
  Droplets, 
  Compass, 
  Stethoscope, 
  Settings, 
  Info, 
  Flame,
  CloudSun,
  Key
} from 'lucide-react';
import { useGarden } from '../../context/GardenContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { weather, profile, settings } = useGarden();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'garden', label: 'My Garden', icon: Sprout },
    { id: 'planner', label: 'Garden Planner', icon: Compass },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'weather-water', label: 'Weather & Water', icon: Droplets },
    { id: 'missions', label: 'Weekly Missions', icon: Calendar, badge: 'Touch Grass' },
    { id: 'doctor', label: 'Plant Health', icon: Stethoscope },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-nature-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Vision Tagline */}
          <div 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-nature-700 to-nature-500 flex items-center justify-center text-white shadow-md shadow-nature-600/20 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6 animate-leaf-sway" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xl text-slate-900 tracking-tight">GrowMate</span>
                <span className="px-1.5 py-0.5 rounded-md bg-nature-100 text-nature-800 text-[10px] font-bold tracking-wider uppercase">AI</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">Grow More. Touch Grass.</p>
            </div>
          </div>

          {/* Quick Metrics Bar (Weather, Streak, Key status) */}
          <div className="flex items-center gap-3">
            {weather && (
              <div 
                onClick={() => setCurrentTab('weather-water')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-700 cursor-pointer transition-colors"
                title={`Live weather in ${weather.city}: ${weather.weatherDescription}`}
              >
                <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold">{weather.temperatureC}°C</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500 max-w-[100px] truncate">{weather.city}</span>
              </div>
            )}

            {/* Streak & XP */}
            <div 
              onClick={() => setCurrentTab('missions')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold cursor-pointer hover:bg-amber-100 transition-colors"
              title={`${profile.streakDays} Day Nature Streak! Click to view Weekly Missions`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{profile.streakDays}d Streak</span>
            </div>

            {/* API / Provider Status Indicator */}
            <div 
              onClick={() => setCurrentTab('settings')}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                settings.googleApiKey 
                  ? 'bg-nature-50 border border-nature-200 text-nature-700 hover:bg-nature-100'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
              title="Click to manage API keys or AI providers in Settings"
            >
              <Key className="w-3 h-3 text-nature-600" />
              <span>{settings.googleApiKey ? 'Google AI Active' : 'Offline Engine'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-nature-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-nature-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
