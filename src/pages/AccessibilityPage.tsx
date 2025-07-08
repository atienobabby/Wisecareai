import React, { useState, useEffect } from 'react'; // Add useEffect here
import { Settings, Moon, Sun, Eye, Type, RotateCcw, Palette, Plus, Minus, Volume2, VolumeX, Monitor } from 'lucide-react';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { FONT_SIZES } from '../utils/accessibility'; // Ensure this path is correct

export const AccessibilityPage: React.FC = () => {
  const { settings, updateSettings, resetSettings: storeResetSettings } = useAccessibilityStore(); // Renamed resetSettings to avoid conflict

  // Determine if TTS should be active based on accessibility store settings
  const ttsEnabled = settings.speechEnabled && !settings.globalMute;

  // Pass the determined 'enabled' state to the useTextToSpeech hook
  const { speak, stop, isSpeaking, voices, isSupported } = useTextToSpeech(ttsEnabled);

  // Local state for voice specific settings
  const [selectedVoice, setSelectedVoice] = useState<string>(settings.selectedVoice || ''); // Initialize with store or default
  const [voiceRate, setVoiceRate] = useState(settings.voiceRate || 1);     // Initialize with store or default
  const [voicePitch, setVoicePitch] = useState(settings.voicePitch || 1);   // Initialize with store or default

  // Update local states when store settings change (e.g., from reset)
  useEffect(() => {
    setSelectedVoice(settings.selectedVoice || '');
    setVoiceRate(settings.voiceRate || 1);
    setVoicePitch(settings.voicePitch || 1);
  }, [settings.selectedVoice, settings.voiceRate, settings.voicePitch]);

  // Handlers for visual settings
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

  // NEW: Handler for global speech toggle
  const toggleSpeechEnabled = () => {
    if (isSpeaking) {
      stop(); // Stop any ongoing speech immediately
    }
    updateSettings({ speechEnabled: !settings.speechEnabled });
  };

  // NEW: Handler for global mute toggle
  const toggleGlobalMute = () => {
    if (isSpeaking) {
      stop(); // Stop any ongoing speech immediately
    }
    updateSettings({ globalMute: !settings.globalMute });
  };

  // Override resetSettings to also handle speech-related settings
  const handleResetSettings = () => {
    if (isSpeaking) {
      stop(); // Stop any ongoing speech before reset
    }
    storeResetSettings(); // Call the actual reset from the store
    // Reset local states to their defaults
    setSelectedVoice('');
    setVoiceRate(1);
    setVoicePitch(1);
  };

  // Test voice handler
  const testVoice = () => {
    const testText = "This is a test of the voice settings. You can adjust the voice, speed, and pitch to your preference.";
    const voice = voices.find(v => v.name === selectedVoice) || null;

    if (isSpeaking) {
      stop();
    } else {
      // Pass the voice, rate, and pitch to the speak function
      speak(testText, {
        voice,
        rate: voiceRate,
        pitch: voicePitch
      });
    }
  };

  // Use a useEffect to save selected voice, rate, and pitch to Zustand store when they change
  useEffect(() => {
    updateSettings({ selectedVoice, voiceRate, voicePitch });
  }, [selectedVoice, voiceRate, voicePitch, updateSettings]);


  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" aria-hidden="true" />
            <h1 className={`${FONT_SIZES[settings.fontSize]} font-bold text-gray-900 dark:text-white`}>
              Accessibility Settings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Customize your CareWise AI experience to meet your accessibility needs.
            All settings are saved automatically and work offline.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visual Settings */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Palette className="w-5 h-5 mr-2" aria-hidden="true" />
                Visual Settings
              </h2>
              <button
                onClick={handleResetSettings} // Use the new handler that stops speech
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label="Reset all settings to default"
                title="Reset all settings"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Theme Mode */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Theme Mode</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateSettings({ darkMode: false })}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                      !settings.darkMode
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                    }`}
                    aria-pressed={!settings.darkMode}
                  >
                    <Sun className="w-4 h-4" aria-hidden="true" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => updateSettings({ darkMode: true })}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                      settings.darkMode
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                    }`}
                    aria-pressed={settings.darkMode}
                  >
                    <Moon className="w-4 h-4" aria-hidden="true" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">High Contrast</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Increases contrast for better visibility</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('highContrast')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
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

              {/* Font Size */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <Type className="w-5 h-5 mr-2" aria-hidden="true" />
                  Text Size: {settings.fontSize}
                </h3>

                <div className="flex items-center justify-between mb-4">
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

                <div className="grid grid-cols-2 gap-2">
                  {(['small', 'medium', 'large', 'xl'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFontSizeChange(size)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                        settings.fontSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                      aria-pressed={settings.fontSize === size}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduce Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">Reduce Motion</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Minimizes animations and transitions</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('reduceMotion')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.reduceMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
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
            </div>
          </section>

          {/* Voice Settings */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Volume2 className="w-5 h-5 mr-2" aria-hidden="true" />
              Voice Settings
            </h2>

            {/* NEW: Global Enable/Disable Speech Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900 dark:text-white">Enable Speech:</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Turn on/off text-to-speech functionality</p>
              </div>
              <button
                onClick={toggleSpeechEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.speechEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                role="switch"
                aria-checked={settings.speechEnabled}
                aria-label="Toggle speech synthesis"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.speechEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* NEW: Mute All Speaker Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900 dark:text-white">Mute All Speakers:</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Globally mute all spoken output</p>
              </div>
              <button
                onClick={toggleGlobalMute}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.globalMute ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                role="switch"
                aria-checked={settings.globalMute}
                aria-label="Toggle global mute"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.globalMute ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Conditional rendering for detailed voice settings based on support, enabled, and not muted */}
            {isSupported && settings.speechEnabled && !settings.globalMute ? (
              <div className="space-y-6">
                {/* Voice Selection */}
                <div>
                  <label htmlFor="voice-select" className="block font-medium text-gray-900 dark:text-white mb-2">
                    Voice
                  </label>
                  <select
                    id="voice-select"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Default Voice</option>
                    {voices.map((voice, index) => (
                      <option key={voice.name + index} value={voice.name}> {/* Use voice.name as key for uniqueness, plus index fallback */}
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Speech Rate */}
                <div>
                  <label htmlFor="voice-rate" className="block font-medium text-gray-900 dark:text-white mb-2">
                    Speech Rate: {voiceRate.toFixed(1)}x
                  </label>
                  <input
                    id="voice-rate"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceRate}
                    onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Slow (0.5x)</span>
                    <span>Normal (1x)</span>
                    <span>Fast (2x)</span>
                  </div>
                </div>

                {/* Speech Pitch */}
                <div>
                  <label htmlFor="voice-pitch" className="block font-medium text-gray-900 dark:text-white mb-2">
                    Speech Pitch: {voicePitch.toFixed(1)}
                  </label>
                  <input
                    id="voice-pitch"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Low (0.5)</span>
                    <span>Normal (1)</span>
                    <span>High (2)</span>
                  </div>
                </div>

                {/* Test Voice */}
                <button
                  onClick={testVoice}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" aria-hidden="true" />
                      <span>Stop Test</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" aria-hidden="true" />
                      <span>Test Voice</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Conditional messages when voice features are not fully available
              <div className="text-center py-8">
                {settings.globalMute ? (
                  <>
                    <VolumeX className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" aria-hidden="true" />
                    <p className="text-gray-500 dark:text-gray-400">Speakers are globally muted.</p>
                  </>
                ) : !settings.speechEnabled ? (
                  <>
                    <VolumeX className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" aria-hidden="true" />
                    <p className="text-gray-500 dark:text-gray-400">Enable speech above to access voice settings.</p>
                  </>
                ) : ( // This means isSupported is false
                  <>
                    <VolumeX className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" aria-hidden="true" />
                    <p className="text-gray-500 dark:text-gray-400">Voice features are not supported in this browser.</p>
                  </>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Preview Section */}
        <section className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Live Preview
          </h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className={`${FONT_SIZES[settings.fontSize]} font-semibold text-gray-900 dark:text-white mb-2`}>
              Sample Health Tip
            </h3>
            <p className={`${FONT_SIZES[settings.fontSize]} text-gray-700 dark:text-gray-300 leading-relaxed`}>
              Drinking enough water is essential for your health. Aim for 8-10 glasses per day,
              and increase your intake during exercise or hot weather. Your body needs water to
              regulate temperature, transport nutrients, and maintain proper organ function.
            </p>
          </div>
        </section>

        {/* Accessibility Information */}
        <section className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Accessibility Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div>
              <h3 className="font-medium mb-2">Keyboard Navigation</h3>
              <ul className="space-y-1">
                <li>• Tab: Navigate between elements</li>
                <li>• Enter/Space: Activate buttons</li>
                <li>• Esc: Close panels and dialogs</li>
                <li>• Arrow keys: Navigate options</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Screen Reader Support</h3>
              <ul className="space-y-1">
                <li>• ARIA labels and descriptions</li>
                <li>• Semantic HTML structure</li>
                <li>• Live region announcements</li>
                <li>• Focus management</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm text-blue-700 dark:text-blue-300">
            CareWise AI is designed to meet WCAG 2.1 AA accessibility standards.
            All settings are saved locally and work offline.
          </p>
        </section>
      </div>
    </main>
  );
};
