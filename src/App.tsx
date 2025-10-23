import React, { useState, useEffect } from 'react';
import { AppLayout } from './components/AppLayout';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/pages/LandingPage';
import { Dashboard } from './components/pages/Dashboard';
import { PlanningPage } from './components/pages/PlanningPage';
import { InteractiveMapPage } from './components/pages/InteractiveMapPage';
import { SmartScenariosPage } from './components/pages/SmartScenariosPage';
import { OrdersPage } from './components/pages/OrdersPage';
import { FarmsPage } from './components/pages/FarmsPage';
import { FleetPage } from './components/pages/FleetPage';
import { ScenariosPage } from './components/pages/ScenariosPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { RoutesPage } from './components/pages/RoutesPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');

  // Add Leaflet CSS dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onEnter={() => setCurrentPage('dashboard')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'planning':
        return <PlanningPage />;
      case 'interactiveMap':
        return <InteractiveMapPage />;
      case 'map':
        return <RoutesPage />;
      case 'smartScenarios':
        return <SmartScenariosPage />;
      case 'orders':
        return <OrdersPage />;
      case 'farms':
        return <FarmsPage />;
      case 'fleet':
        return <FleetPage />;
      case 'scenarios':
        return <ScenariosPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage onEnter={() => setCurrentPage('dashboard')} />
        <Toaster />
      </>
    );
  }

  return (
    <AppLayout children={(
      <div>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}
        <Toaster />
      </div>
    )} />
  );
}