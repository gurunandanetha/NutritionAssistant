import { useEffect, useRef, useState } from 'react';

interface SpeechRecognitionOptions {
  onResult: (text: string) => void;
  onError: (error: string) => void;
  language?: string;
}

interface SpeechRecognitionHook {
  startListening: () => void;
  stopListening: () => void;
  isListening: boolean;
  transcript: string;
}

// Type definitions for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onaudiostart?: () => void;
  onspeechstart?: () => void;
  onspeechend?: () => void;
  onnomatch?: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// Set up a global variable for the SpeechRecognition constructor
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useSpeechRecognition({
  onResult,
  onError,
  language = 'en-US'
}: SpeechRecognitionOptions): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      onError('Speech recognition not supported in this browser.');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Get the most recent result
      const latest = event.results[event.results.length - 1];
      
      // Get the most confident alternative
      let bestTranscript = '';
      let bestConfidence = 0;
      
      for (let i = 0; i < latest.length; i++) {
        if (latest[i].confidence > bestConfidence) {
          bestConfidence = latest[i].confidence;
          bestTranscript = latest[i].transcript;
        }
      }
      
      setTranscript(bestTranscript);
      
      if (latest.isFinal) {
        // Clean up the transcript - remove extra spaces and capitalize first letter
        const cleanTranscript = bestTranscript.trim();
        const formattedTranscript = cleanTranscript.charAt(0).toUpperCase() + cleanTranscript.slice(1);
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        onResult(formattedTranscript);
        stopListening();
      } else if (bestTranscript.length > 0) {
        // Auto-stop listening after a period of silence with some content
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          if (bestTranscript.length > 0) {
            // Clean up the transcript - remove extra spaces and capitalize first letter
            const cleanTranscript = bestTranscript.trim();
            const formattedTranscript = cleanTranscript.charAt(0).toUpperCase() + cleanTranscript.slice(1);
            
            onResult(formattedTranscript);
            stopListening();
          }
        }, 2000); // Auto-stop after 2 seconds of silence
      }
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Don't treat "no-speech" as an error to show the user
      if (event.error !== 'no-speech') {
        onError(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    // Additional event handlers for better UX
    recognition.onaudiostart = () => {
      // Audio capture has started
      console.log('Audio capture started');
    };
    
    recognition.onspeechstart = () => {
      // Speech has been detected
      console.log('Speech detected');
    };
    
    recognition.onspeechend = () => {
      // Speech has stopped being detected
      console.log('Speech ended');
    };
    
    recognition.onnomatch = () => {
      // No speech was recognized
      onError('Could not recognize what you said. Please try again.');
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onResult, onError]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript('');
        
        // Set a maximum listening time of 15 seconds
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          if (isListening && transcript.length > 0) {
            onResult(transcript);
          }
          stopListening();
        }, 15000);
        
      } catch (error) {
        onError(`Could not start speech recognition: ${error}`);
      }
    } else {
      onError('Speech recognition not available');
    }
  };

  const stopListening = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Handle the case where stop is called when not listening
      }
      setIsListening(false);
    }
  };

  return {
    startListening,
    stopListening,
    isListening,
    transcript
  };
}
