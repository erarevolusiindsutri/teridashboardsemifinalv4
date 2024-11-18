import React, { useEffect } from 'react';
import { Scene } from './components/Scene';
import { FinanceOverlay } from './components/visualizations/FinanceOverlay';
import { SalesOverlay } from './components/visualizations/SalesOverlay';
import { ProductOverlay } from './components/visualizations/ProductOverlay';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { ProfileMenu } from './components/ProfileMenu';
import { UserGreeting } from './components/UserGreeting';
import { AuthModal } from './components/auth/AuthModal';
import { useAuth } from './lib/auth';
import { useDataStore } from './lib/dataManager';

export default function App() {
  const { user, loading, initialize } = useAuth();
  const initializeData = useDataStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      initializeData();
    }
  }, [user, initializeData]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#4488ff] animate-pulse" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen bg-black">
        <AuthModal isOpen={true} onClose={() => {}} />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black">
      <Scene />
      <FinanceOverlay />
      <SalesOverlay />
      <ProductOverlay />
      <PerformanceMonitor />
      <ProfileMenu />
      <UserGreeting />
    </div>
  );
}