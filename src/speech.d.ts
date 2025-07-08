// src/types/speech.d.ts

// First: Grammar types
declare class SpeechGrammar {
  src: string;
  weight: number;
}

declare class SpeechGrammarList {
  constructor();
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
  [index: number]: SpeechGrammar;
  readonly length: number;
}

// Then: RecognitionError, Result, Alternative, etc.
declare class SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare class SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  readonly length: number;
  isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
}

declare class SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
}

type SpeechRecognitionErrorCode =
  | "no-speech"
  | "aborted"
  | "audio-capture"
  | "network"
  | "not-allowed"
  | "service-not-allowed"
  | "bad-grammar"
  | "language-not-supported";

declare class SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}

declare class SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}


declare class SpeechRecognition extends EventTarget {
  constructor();
  continuous: boolean;
  grammars: SpeechGrammarList;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;

  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstop: ((this: SpeechRecognition, ev: Event) => any) | null;

  abort(): void;
  start(): void;
  stop(): void;
}

// Lastly: Add to global window
interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
  SpeechRecognitionEvent: typeof SpeechRecognitionEvent;
  webkitSpeechRecognitionEvent: typeof SpeechRecognitionEvent;
}