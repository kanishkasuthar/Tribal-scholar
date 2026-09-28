import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { VoiceAssistantDrawer } from '../ai/VoiceAssistantDrawer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-200">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <VoiceAssistantDrawer />
    </div>
  );
};
