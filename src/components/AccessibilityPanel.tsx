import React from 'react';
import { Settings, Moon, Sun, Eye, Type, RotateCcw, Palette, Plus, Minus } from 'lucide-react';
import { useAccessibilityStore } from '../store/accessibilityStore';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onToggle
}) => {
  const { settings, updateSettings } = useAccessibilityStore();

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleFontSizeChange = (fontSize: typeof settings.fontSize) => {
    updateSettings({ fontSize });
  };

  const increaseFontSize = () => {
    const sizes: Array<typeof settings.fontSize> = ['small', 'medium', 'large', 'xl'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex < sizes.length - 1) {
      handleFontSizeChange(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes: Array<typeof settings.fontSize> = ['small', 'medium', 'large', 'xl'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex > 0) {
      handleFontSizeChange(sizes[currentIndex - 1]);
    }
  };

  const resetSettings = () => {
    updateSettings({
      darkMode: false,
      highContrast: false,
      fontSize: 'medium',
      reduceMotion: false
    });
  };

  return (
    <>
      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-labelledby="accessibility-title"
        aria-hidden={!isOpen}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 id="accessibility-title" className="text-xl font-semibold text-gray-900 dark:text-white">
              Accessibility Settings
            </h2>
            <button
              onClick={resetSettings}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              aria-label="Reset all accessibility settings to default"
              title="Reset settings"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Theme Controls */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" aria-hidden="true" />
                Theme
              </h3>
              
              {/* Dark Mode */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {settings.darkMode ? (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  )}
                  <span className="text-gray-900 dark:text-white">Dark Mode</span>
                </div>
                <button
                  onClick={() => handleToggle('darkMode')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={settings.darkMode}
                  aria-labelledby="dark-mode-label"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  <span className="text-gray-900 dark:text-white">High Contrast</span>
                </div>
                <button
                  onClick={() => handleToggle('highContrast')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.highContrast ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={settings.highContrast}
                  aria-labelledby="high-contrast-label"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* Font Size Controls */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2" aria-hidden="true" />
                Text Size
              </h3>
              
              {/* Font Size Buttons */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-900 dark:text-white">Current: {settings.fontSize}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={decreaseFontSize}
                    disabled={settings.fontSize === 'small'}
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    aria-label="Decrease font size"
                    title="Decrease font size"
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    onClick={increaseFontSize}
                    disabled={settings.fontSize === 'xl'}
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    aria-label="Increase font size"
                    title="Increase font size"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Font Size Grid */}
              <div className="grid grid-cols-2 gap-2">
                {(['small', 'medium', 'large', 'xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                      settings.fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                    aria-pressed={settings.fontSize === size}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </section>

            {/* Motion Controls */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Motion & Animation
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true">
                    <div className="w-full h-full border-2 border-current rounded" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Reduce Motion</span>
                </div>
                <button
                  onClick={() => handleToggle('reduceMotion')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.reduceMotion ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={settings.reduceMotion}
                  aria-labelledby="reduce-motion-label"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.reduceMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                These accessibility settings help make HealthQuery AI more usable for everyone. 
                Changes are saved automatically and will persist across sessions.
              </p>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Keyboard Shortcuts</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Tab: Navigate between elements</li>
                <li>• Enter/Space: Activate buttons</li>
                <li>• Esc: Close panels and dialogs</li>
                <li>• Arrow keys: Navigate options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
    </>
  );
};