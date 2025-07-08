// src/hooks/useTextToSpeech.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAccessibilityStore } from '../store/accessibilityStore'; // <-- IMPORT YOUR ZUSTAND STORE

interface UseTextToSpeechOptions {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number; // Though SpeechSynthesisUtterance typically only supports rate, pitch, volume (0-1)
}

export const useTextToSpeech = () => { // <-- REMOVED THE 'enabled' PROP HERE
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);

  // <-- NEW: Get speech settings directly from the global store
  const { speechEnabled, globalMute, selectedVoice, voiceRate, voicePitch } = useAccessibilityStore(
    (state) => state.settings
  );

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null); // Corrected type: SpeechSynthesisUtterance

  const getVoices = useCallback(() => {
    // A small delay can sometimes help ensure voices are populated, especially on first load
    // However, the 'voiceschanged' event is the most reliable way.
    // If window.speechSynthesis is not defined yet, this will fail.
    if ('speechSynthesis' in window) {
      setVoices(window.speechSynthesis.getVoices());
    }
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      // Immediately get voices if they are already available
      if (window.speechSynthesis.getVoices().length > 0) {
        getVoices();
      }
      // Listen for when voices become available or change
      window.speechSynthesis.addEventListener('voiceschanged', getVoices);
    } else {
      setIsSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', getVoices);
        window.speechSynthesis.cancel(); // Ensure speech is stopped on unmount
      }
    };
  }, [getVoices]); // getVoices is a dependency because it's used inside useEffect

  const stop = useCallback(() => {
    if (window.speechSynthesis.speaking) { // Check if speech is currently active
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingText(null);
    }
  }, []); // No dependencies needed if not using state from outside `stop` itself

  const speak = useCallback((text: string, options?: UseTextToSpeechOptions) => {
    // <-- MODIFIED: Use speechEnabled and globalMute from the store
    // Speech should only work if supported, speech features are enabled, AND it's not globally muted.
    if (!isSupported || !speechEnabled || globalMute) {
      console.warn("Text-to-speech not supported or currently disabled/muted by accessibility settings.");
      // Optional: Add more specific reasons for debugging if needed:
      if (!isSupported) console.warn("Reason: Not Supported by browser.");
      if (!speechEnabled) console.warn("Reason: Speech features disabled in settings.");
      if (globalMute) console.warn("Reason: Global Mute is ON in settings.");
      return;
    }

    stop(); // Stop any ongoing speech before starting new one

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Apply voice, rate, pitch, volume from store, allowing options to override
    const voicesList = window.speechSynthesis.getVoices();
    if (options?.voice) {
      utterance.voice = options.voice;
    } else if (selectedVoice) {
      const foundVoice = voicesList.find(v => v.voiceURI === selectedVoice || v.name === selectedVoice);
      if (foundVoice) {
        utterance.voice = foundVoice;
      } else {
        console.warn(`Stored voice "${selectedVoice}" not found. Using default.`);
      }
    }
    utterance.rate = options?.rate ?? voiceRate; // Use stored rate as default
    utterance.pitch = options?.pitch ?? voicePitch; // Use stored pitch as default
    utterance.volume = options?.volume ?? 1; // Volume is not stored in your A11yStore yet, defaults to 1

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingText(null);
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      setIsSpeaking(false);
      setCurrentSpeakingText(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [
    isSupported,
    speechEnabled, // <-- IMPORTANT: Added to dependencies
    globalMute,    // <-- IMPORTANT: Added to dependencies
    selectedVoice, // <-- IMPORTANT: Added to dependencies
    voiceRate,     // <-- IMPORTANT: Added to dependencies
    voicePitch,    // <-- IMPORTANT: Added to dependencies
    stop,
    voices // Added as it's used to find the selectedVoice
  ]);

  // This effect ensures speech stops if speechEnabled becomes false or globalMute becomes true while speaking
  useEffect(() => {
    if ((!speechEnabled || globalMute) && isSpeaking) { // <-- MODIFIED: Check store values here
      stop();
    }
  }, [speechEnabled, globalMute, isSpeaking, stop]); // <-- MODIFIED dependencies

  return { speak, stop, isSpeaking, currentSpeakingText, voices, isSupported };
};