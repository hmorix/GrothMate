import React, { useState } from 'react';
import { GardenProvider, useGarden } from './context/GardenContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyGardenPage } from './pages/MyGardenPage';
import { GardenPlannerPage } from './pages/GardenPlannerPage';
import { AssistantPage } from './pages/AssistantPage';
import { WeatherWateringPage } from './pages/WeatherWateringPage';
import { MissionsPage } from './pages/MissionsPage';
import { PlantHealthPage } from './pages/PlantHealthPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { OnboardingPage } from './pages/OnboardingPage';

const AppContent: React.FC = () => {
  const { profile } = useGarden();
  const [currentTab, setCurrentTab] = useState<string>(() => {
    return profile.onboarded ? 'dashboard' : 'landing';
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf7] selection:bg-nature-200 selection:text-nature-900 font-sans">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'landing' && <LandingPage setCurrentTab={setCurrentTab} />}
        {currentTab === 'dashboard' && <DashboardPage setCurrentTab={setCurrentTab} />}
        {currentTab === 'garden' && <MyGardenPage />}
        {currentTab === 'planner' && <GardenPlannerPage />}
        {currentTab === 'assistant' && <AssistantPage setCurrentTab={setCurrentTab} />}
        {currentTab === 'weather-water' && <WeatherWateringPage />}
        {currentTab === 'missions' && <MissionsPage />}
        {currentTab === 'doctor' && <PlantHealthPage />}
        {currentTab === 'settings' && <SettingsPage />}
        {currentTab === 'about' && <AboutPage />}
        {currentTab === 'onboarding' && <OnboardingPage onComplete={() => setCurrentTab('dashboard')} />}
      </main>

      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GardenProvider>
      <AppContent />
    </GardenProvider>
  );
};

export default App;
