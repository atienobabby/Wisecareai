import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { HomePage } from './pages/HomePage';
import { ChatInterface } from './components/ChatInterface';
// import { ChatHistory } from './components/ChatHistory'; // REMOVED: This was the chat display component, now it's the sidebar
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { AskDoctorPage } from './pages/AskDoctorPage';
import { LessonsPage } from './pages/LessonsPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { useAccessibilityStore } from './store/accessibilityStore';
import { applyAccessibilitySettings } from './utils/accessibility';
import ChatHistory from './components/ChatHistory'; // NEW: Import the ChatHistory component (which is now your sidebar)

function App() {
  const { settings, togglePanel, isPanelOpen } = useAccessibilityStore();

  // Apply accessibility settings whenever they change
  useEffect(() => {
    applyAccessibilitySettings(settings);
  }, [settings]);

  return (
    <Router>
      <div style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#1a1c20',
        color: '#f8f8f2',
        fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Oxygen\', \'Ubuntu\', \'Cantarell\', \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }} className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${
          settings.reduceMotion ? 'reduce-motion' : ''
        } ${
          settings.highContrast ? 'high-contrast' : ''
        }`}>
        {/* Skip Link for Screen Readers */}
        <a
          href="#main-content"
          className="skip-link"
          tabIndex={0}
        >
          Skip to main content
        </a>

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main id="main-content" className="pt-16 flex flex-col flex-1 h-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ask-ai" element={
              <div className="flex flex-1 h-full">
                {/* Chat History Component (now serving as the sidebar) */}
                <ChatHistory /> {/* UPDATED: Render the ChatHistory component here */}

                {/* Main Chat Interface */}
                <div className="flex-1 flex flex-col">
                  <ChatInterface fontSize={settings.fontSize} />
                </div>
              </div>
            } />
            <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
            <Route path="/ask-doctor" element={<AskDoctorPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
          </Routes>
        </main>

        {/* Accessibility Panel */}
        <AccessibilityPanel
          isOpen={isPanelOpen}
          onToggle={togglePanel}
        />
      </div>
    </Router>
  );
}

export default App;