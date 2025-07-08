

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isVoice?: boolean;
  image?: string | null; 
}


export interface AccessibilitySettings {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  reduceMotion: boolean;
  speechEnabled: boolean; 
  globalMute: boolean;    
}


export interface VoiceSettings {
  enabled: boolean;        
  autoSpeak: boolean;      
  voice: SpeechSynthesisVoice | null; 
  rate: number;            
  pitch: number;           
}


export interface OllamaChatMessage {
  role: 'user' | 'assistant' | 'system'; 
  content: string;
  images?: string[]; 
}


export interface HealthQueryRequest {
  query: string;                 
  context?: OllamaChatMessage[]; 
  image?: File | null;           
}

// --- Health Query Response (from your custom AI service) ---
export interface HealthQueryResponse {
  answer: string;
  confidence: number;
  sources?: string[]; // Optional: List of sources for the answer
  disclaimer: string;
}


export interface Conversation {
  id: string;          
  title: string;       
  messages: Message[]; 
  createdAt: number;   
  lastUpdated: number; 
}


export interface SymptomData {
  bodyArea: string;
  description: string;
  painLevel: number; 
  duration: string;  
  additionalSymptoms: string[]; 
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  lastUpdated: number;
}