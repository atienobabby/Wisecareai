

import { useState, useRef, useCallback, useEffect } from 'react';


export const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>(''); 

 
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser.');
      setIsSupported(false);
    } else {
      setIsSupported(true);
      setError(null);
    }

    
    return () => {
      if (recognitionRef.current) {
       
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.warn("Recognition abort failed on unmount:", e);
        }
        recognitionRef.current = null;
      }
    };
  }, []); 

  
  const cleanupAndReset = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onaudiostart = null;
      recognition.onsoundstart = null;
      onspeechstart: null; 
      recognition.onspeechend = null;
      recognition.onsoundend = null;
      recognition.onstop = null;

      try {
        // Attempt to abort if still active to ensure immediate stop
        // NOTE: recognition.state is experimental and might not be present.
        // Consider removing if it causes issues. The try/catch for abort is generally enough.
        // if (['listening', 'starting'].includes(recognition.state)) {
             recognition.abort(); // Use abort for immediate cessation
        // }
      } catch (e) {
        console.warn("Recognition abort failed during cleanup:", e);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    finalTranscriptRef.current = '';
  }, []);

  const createRecognitionInstance = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();

    recognition.continuous = false; // Recognizes a single utterance then ends automatically
    recognition.interimResults = true; // Provides results while the user is speaking
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('🎤 Voice recognition started.');
      setIsListening(true); // Confirm listening state
      setError(null);
      setTranscript(''); // Clear previous transcript on start
      finalTranscriptRef.current = ''; // Clear final transcript buffer
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentInterimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript;
        } else {
          currentInterimTranscript += result[0].transcript;
        }
      }
      // Update the transcript state with either the full final transcript
      // or the current interim transcript for immediate feedback.
      setTranscript(finalTranscriptRef.current + currentInterimTranscript);
    };

    recognition.onend = () => {
      console.log('🛑 Voice recognition ended.');
      // When onend fires, the finalTranscriptRef.current should hold the complete result.
      // We set the final transcript to state here, ensuring it's available after the session.
      setTranscript(finalTranscriptRef.current); // Set the final accumulated transcript
      cleanupAndReset(); // Perform full cleanup
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('⚠️ Speech recognition error:', event);
      setError(`Speech recognition error: ${event.error}.`);
      cleanupAndReset(); // Cleanup on error
    };

    // onstop is rarely used with continuous=false, but good to have
    recognition.onstop = () => {
        console.log('⏹️ Speech recognition forcibly stopped by stop() call.');
        // This usually fires immediately before onend if stop() is called.
        // onend will handle the final state update.
    };

    return recognition;
  }, [cleanupAndReset]); // Dependencies for useCallback

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      console.warn('Already listening. Ignoring start.');
      return;
    }

    // Immediately attempt to stop any previous, lingering recognition instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        console.warn("Attempted to abort prior recognition, but failed:", e);
      }
      recognitionRef.current = null;
    }

    const recognition = createRecognitionInstance();
    recognitionRef.current = recognition;

    // Optimistically set listening true for immediate UI feedback
    setIsListening(true);
    setError(null);
    setTranscript('');
    finalTranscriptRef.current = '';

    try {
      recognition.start();
      console.log('⚡ Starting recognition...');
    } catch (e: any) {
      console.error('❌ Error starting recognition:', e);
      setError(`Failed to start: ${e.message}`);
      cleanupAndReset(); // Force cleanup if start fails
    }
  }, [isSupported, isListening, createRecognitionInstance, cleanupAndReset]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition && isListening) { // Ensure it's active and listening
      try {
        // Use abort for immediate cessation and quicker UI update
        console.log('🛑 Aborting recognition for immediate stop...');
        recognition.abort(); // This should trigger onend almost immediately
      } catch (e: any) {
        console.error('❌ Error aborting recognition:', e);
        setError(`Failed to stop: ${e.message}`);
        cleanupAndReset(); // Force cleanup if abort fails
      }
    } else {
        console.log('Not currently listening or no recognition instance to stop.');
        cleanupAndReset(); // Ensure state is reset even if stop was called unexpectedly
    }
  }, [isListening, cleanupAndReset]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    finalTranscriptRef.current = '';
  }, []);

  const resetRecognition = useCallback(() => {
    cleanupAndReset();
    clearTranscript();
    setError(null);
  }, [cleanupAndReset, clearTranscript]);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
    resetRecognition,
  };
};