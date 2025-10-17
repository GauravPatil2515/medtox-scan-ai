import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import EnhancedPredictions from './pages/EnhancedPredictions';
import BatchProcessing from './pages/BatchProcessing';
import Chat from './pages/Chat';
import { NotificationProvider } from './components/NotificationSystem';
import { OnboardingTutorial, QuickHelp } from './components/OnboardingTutorial';
import ChemBioBot from './components/ChemBioBot';

// Placeholder components for pages not yet created
const Settings = () => <div className="text-2xl font-bold">Settings</div>;
const Help = () => <div className="text-2xl font-bold">Help & Documentation</div>;
const Contact = () => <div className="text-2xl font-bold">Contact Support</div>;

function App() {
  return (
    <NotificationProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="predictions" element={<EnhancedPredictions />} />
            <Route path="batch" element={<BatchProcessing />} />
            <Route path="chat" element={<Chat />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
        
        {/* Global Components */}
        <OnboardingTutorial />
        <QuickHelp />
        <ChemBioBot />
      </div>
    </NotificationProvider>
  );
}

export default App;