import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import TemplatesPage from './pages/TemplatesPage';
import AIToolsPage from './pages/AIToolsPage';
import CoverLetterPage from './pages/CoverLetterPage';
import BiodataPage from './pages/BiodataPage';
import CareerCoachPage from './pages/CareerCoachPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Toast from './components/common/Toast';
import ConfirmationModal from './components/common/ConfirmationModal';
import { useResumeStore } from './features/resume/resumeStore';

export default function App() {
  const { init, theme } = useResumeStore();

  useEffect(() => {
    init();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [init, theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<OnboardingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resume/:id" element={<ResumeBuilderPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/ai-tools" element={<AIToolsPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
          <Route path="/biodata" element={<BiodataPage />} />
          <Route path="/career-coach" element={<CareerCoachPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Floating Modals & Toasts */}
        <Toast />
        <ConfirmationModal />
      </div>
    </BrowserRouter>
  );
}
