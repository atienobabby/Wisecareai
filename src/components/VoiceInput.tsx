// src/components/VoiceInput.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react'; // Loader2 is not currently used, but good to have if you add processing indicators.

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null); // Reference to the SpeechRecognition object

  // Function to start speech recognition
  const startRecording = useCallback(() => {
    // Check for browser compatibility
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech Recognition not supported in this browser.');
      return;
    }

    // Get the SpeechRecognition API constructor (vendor-prefixed for wider compatibility)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true; // Keep listening until explicitly stopped
    recognition.interimResults = true; // Provide interim results as the user speaks
    recognition.lang = 'en-US'; // Set the language for recognition

    // Event handler for when recognition starts
    recognition.onstart = () => {
      setIsRecording(true); // Set recording state to true
      setTranscript(''); // Clear any previous transcript
      setError(null); // Clear any previous errors
      console.log('Voice recognition started');
    };

    // Event handler for when a result (final or interim) is received
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      // Loop through all results from the event
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript; // Accumulate final transcripts
        } else {
          interimTranscript += result[0].transcript; // Accumulate interim transcripts
        }
      }
      // Update the component's transcript state
      // Prioritize finalTranscript if available, otherwise use interim
      setTranscript(finalTranscript || interimTranscript);
    };

    // Event handler for errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}. Please check your microphone.`);
      setIsRecording(false); // Stop recording state on error
      if (recognitionRef.current) {
          recognitionRef.current.stop(); // Explicitly stop recognition service
      }
    };

    // Event handler for when recognition ends (either manually stopped or due to error/timeout)
    recognition.onend = () => {
      console.log('Voice recognition ended');
      setIsRecording(false); // Update recording state
      // IMPORTANT: onTranscript is NOT called here.
      // It will only be called when the user *manually* clicks the mic button to stop.
    };

    recognitionRef.current = recognition; // Store the recognition object in the ref
    recognition.start(); // Start the speech recognition service
  }, []); // useCallback dependencies: none, as it only uses internal state/refs

  // Function to stop speech recognition
  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop(); // Stop the speech recognition service
      setIsRecording(false); // Update local state
      
      // Only pass the transcript to the parent component (ChatInterface)
      // when the user explicitly stops recording and there's actual speech.
      if (transcript.trim()) {
        onTranscript(transcript.trim()); 
      }
      setTranscript(''); // Clear the internal transcript state after passing it
    }
  }, [isRecording, transcript, onTranscript]); // Dependencies: depends on current state and parent's callback

  // Toggle function for the microphone button
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording(); // If currently recording, stop it
    } else {
      startRecording(); // If not recording, start it
    }
  };

  // Cleanup effect: stop recording if component unmounts while recording
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]); // Dependency: isRecording state

  return (
    <div className="flex flex-col items-center">
      <button
        type="button" // Important for preventing default form submission
        onClick={toggleRecording}
        className={`p-3 rounded-lg transition-colors flex-shrink-0
          ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        aria-label={isRecording ? 'Stop recording voice input' : 'Start recording voice input'}
        disabled={disabled}
      >
        {isRecording ? (
          <MicOff className="w-5 h-5 animate-pulse" /> // Show MicOff and animate when recording
        ) : (
          <Mic className="w-5 h-5" /> // Show Mic when not recording
        )}
      </button>
      {/* Optional: You can display the current transcript here if you want real-time feedback within the mic button area */}
      {/* {isRecording && transcript && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Listening: "{transcript}"</p>
      )} */}
      {/* Display any speech recognition errors */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};