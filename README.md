# CareWise AI - Your Accessible Health Companion

A comprehensive, offline-capable healthcare web application built with React, TypeScript, and Tailwind CSS. CareWise AI provides AI-powered health assistance, symptom checking, doctor consultations, and health education with a focus on accessibility and privacy.

## 🌟 Features Overview

### 🏠 **Home Page**
- **Welcome hub** with clear navigation to all tools
- **Accessibility-first design** with large buttons and high contrast
- **Offline-ready** with complete functionality without internet
- **Voice-readable content** for screen readers and text-to-speech

### 🧠 **Ask AI (Gemma 3n Integration)**
- **Interactive chat interface** with AI health assistant
- **Voice input/output** support for hands-free interaction
- **Chat history** stored locally with search functionality
- **Privacy-focused** - all data stays on your device

### 🩺 **Symptom Checker**
- **Text input** for describing symptoms (e.g., "I'm drinking water but still feel dizzy")
- **Visual body diagram** for selecting affected areas
- **Comprehensive responses** with immediate steps and when to seek help
- **Voice output** to read suggestions aloud
- **Download/copy** functionality for sharing with healthcare providers

### 📄 **Ask a Doctor**
- **Simple form** for submitting health questions
- **Contact preferences** (email/phone optional)
- **Local storage** of submissions for offline functionality
- **Professional disclaimer** and response expectations

### 📘 **Health Lessons**
- **6 comprehensive topics** with detailed information:
  - Why Staying Hydrated Matters
  - How to Use Sunlight for Better Sleep
  - Simple Breathing Exercises for Stress
  - Safe Medication Practices
  - Mental Health Tips for Daily Stress
  - Understanding Fever and When to Worry
- **Voice narration** for each lesson
- **Expandable content** with practical tips and key points
- **Offline-ready** static content

### ♿ **Accessibility Settings**
- **Font size controls** (Small, Medium, Large, XL)
- **Theme modes** (Light, Dark)
- **High contrast mode** for better visibility
- **Motion reduction** for vestibular disorders
- **Voice settings** with rate and pitch control
- **Live preview** of settings changes

## 🔧 Technical Implementation

### **Project Structure**
```
src/
├── components/           # Reusable UI components
│   ├── AccessibilityPanel.tsx    # Quick accessibility controls
│   ├── BodyDiagram.tsx          # Interactive symptom body map
│   ├── ChatInterface.tsx        # Main AI chat interface
│   ├── ChatHistory.tsx          # Chat history sidebar
│   ├── MessageHistory.tsx       # Message display component
│   ├── Navigation.tsx           # Main navigation bar
│   ├── SymptomForm.tsx         # Detailed symptom input
│   └── VoiceInput.tsx          # Voice recognition component
├── hooks/               # Custom React hooks
│   ├── useIndexedDB.ts         # Local database operations
│   ├── useTextToSpeech.ts      # Text-to-speech functionality
│   └── useVoiceInput.ts        # Speech recognition
├── pages/               # Main page components
│   ├── HomePage.tsx            # Welcome/landing page
│   ├── AccessibilityPage.tsx   # Full accessibility settings
│   ├── SymptomCheckerPage.tsx  # Symptom analysis tool
│   ├── AskDoctorPage.tsx       # Doctor consultation form
│   └── LessonsPage.tsx         # Health education content
├── services/            # API and business logic
│   ├── healthAI.ts             # Gemma 3n AI integration
│   └── symptomChecker.ts       # Enhanced symptom analysis
├── store/               # State management (Zustand)
│   ├── accessibilityStore.ts   # Accessibility settings
│   └── chatStore.ts            # Chat state management
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
    └── accessibility.ts        # Accessibility helpers
```

## 🤖 Gemma 3n AI Integration

### **Current Implementation**
The app is designed to seamlessly integrate with Google's Gemma 3n model while providing robust offline fallbacks.

### **Integration Points**

#### **1. Service Layer (`src/services/healthAI.ts`)**
```typescript
// Configure your Gemma 3n endpoint
healthAI.configureEndpoint('YOUR_GEMMA_3N_ENDPOINT');

// The service automatically handles:
// - API requests to Gemma 3n
// - Fallback to enhanced offline responses
// - Error handling and retries
```

#### **2. Components Using AI**
- **Ask AI Page** (`src/pages/HomePage.tsx` → `/ask-ai` route) - Main chat interface
- **Symptom Checker** (`src/pages/SymptomCheckerPage.tsx`) - Symptom analysis with fallback

### **How to Connect Gemma 3n**

#### **Option 1: Google AI Studio (Recommended)**
1. **Set up Google AI Studio**:
   ```bash
   # Visit https://aistudio.google.com/
   # Create project and get API key
   ```

2. **Configure the endpoint**:
   ```typescript
   // In your app initialization
   import { healthAI } from './services/healthAI';
   
   healthAI.configureEndpoint('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent');
   ```

3. **Update environment variables**:
   ```env
   VITE_HEALTH_AI_ENDPOINT=your_gemma_endpoint
   VITE_GOOGLE_AI_KEY=your_api_key
   ```

#### **Option 2: Local Backend**
1. **Create Flask/Node.js backend** (see `GEMMA_INTEGRATION.md` for detailed setup)
2. **Configure local endpoint**:
   ```typescript
   healthAI.configureEndpoint('http://localhost:5000/health/query');
   ```

#### **Option 3: Test with Enhanced Offline Responses**
The app includes intelligent offline responses that work out of the box:
```typescript
// Enhanced responses are automatically used when no endpoint is configured
// Located in src/services/healthAI.ts and src/services/symptomChecker.ts
```

### **Testing Gemma 3n Integration**

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test AI responses**:
   - Navigate to "Ask AI" page (`/ask-ai`)
   - Try sample questions:
     - "What are the benefits of regular exercise?"
     - "How much water should I drink daily?"
     - "What are the signs of dehydration?"

3. **Test Symptom Checker**:
   - Navigate to "Symptom Checker" (`/symptom-checker`)
   - Enter symptoms like "I'm drinking water but still feel dizzy"
   - Click "Check Symptoms"

## ♿ Accessibility Features (WCAG 2.1 AA Compliant)

### **Visual Accessibility**
- **High contrast mode** with enhanced color ratios
- **Font size controls** from small to extra-large
- **Dark/light themes** with system preference detection
- **Focus indicators** clearly visible in all modes
- **Color-blind friendly** design with sufficient contrast

### **Motor Accessibility**
- **Keyboard navigation** for all interactive elements
- **Large touch targets** (minimum 44px) for mobile
- **Reduced motion** option for vestibular disorders
- **Voice input** for hands-free interaction

### **Cognitive Accessibility**
- **Simple, clear language** in all content
- **Consistent navigation** and layout patterns
- **Progress indicators** for multi-step processes
- **Error prevention** and clear error messages
- **Content organization** with logical heading structure

### **Auditory Accessibility**
- **Text-to-speech** for all content
- **Voice input** alternative to typing
- **Visual indicators** for audio content
- **Captions** and transcripts where applicable

## 🔒 Privacy & Offline Features

### **Data Storage**
- **Local Only**: All data stored in browser's IndexedDB
- **No External Tracking**: No analytics or tracking scripts
- **Privacy First**: No personal data sent to external services
- **Offline Capable**: Core functionality works without internet

### **Offline Functionality**
- **Complete symptom checker** with comprehensive responses
- **Health lessons** with full content available offline
- **Accessibility settings** persist without internet
- **Voice features** work offline (browser-dependent)

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd carewise-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Build for Production**
```bash
npm run build
npm run preview
```

## 🧪 Testing Each Page

### **1. Home Page (`/`)**
- ✅ **Navigation works** - All buttons link to correct pages
- ✅ **Accessibility** - Tab through all elements
- ✅ **Responsive** - Test on mobile/tablet/desktop
- ✅ **Voice readable** - Test with screen reader

### **2. Ask AI (`/ask-ai`)**
- ✅ **Chat functionality** - Send messages and receive responses
- ✅ **Voice input** - Click microphone and speak
- ✅ **Chat history** - Messages persist between sessions
- ✅ **Gemma 3n** - Configure endpoint and test real AI responses

### **3. Symptom Checker (`/symptom-checker`)**
- ✅ **Text input** - Enter "I'm drinking water but still feel dizzy"
- ✅ **Body diagram** - Click on body areas
- ✅ **Voice output** - Click speaker icon to hear response
- ✅ **Download/Copy** - Test export functionality
- ✅ **Offline** - Disconnect internet and verify it still works

### **4. Ask a Doctor (`/ask-doctor`)**
- ✅ **Form submission** - Fill out and submit question
- ✅ **Validation** - Test required fields
- ✅ **Success page** - Verify confirmation message
- ✅ **Local storage** - Check browser dev tools for saved data

### **5. Health Lessons (`/lessons`)**
- ✅ **Lesson cards** - Click to expand each lesson
- ✅ **Voice narration** - Test speaker button on each lesson
- ✅ **Content depth** - Verify detailed information is present
- ✅ **Offline** - All content available without internet

### **6. Accessibility Settings (`/accessibility`)**
- ✅ **Font size** - Test all size options
- ✅ **Theme switching** - Light/dark mode toggle
- ✅ **High contrast** - Verify enhanced contrast
- ✅ **Voice settings** - Test different voices and speeds
- ✅ **Settings persistence** - Refresh page and verify settings saved

## 🔧 Customization Guide

### **Adding New Themes**
```typescript
// In src/utils/accessibility.ts
export const THEMES = {
  light: 'light-theme',
  dark: 'dark-theme',
  highContrast: 'high-contrast-theme',
  // Add new theme here
  newTheme: 'new-theme-class'
};
```

### **Updating Voice Logic**
```typescript
// In src/hooks/useTextToSpeech.ts
export const useTextToSpeech = () => {
  // Modify voice settings
  // Add new voice features
  // Customize speech parameters
};
```

### **Adding New Health Lessons**
```typescript
// In src/pages/LessonsPage.tsx
const healthLessons: HealthLesson[] = [
  // Add new lesson object
  {
    id: 'new-lesson',
    title: 'New Health Topic',
    description: 'Brief description',
    content: 'Detailed content',
    // ... other properties
  }
];
```

### **Customizing Symptom Responses**
```typescript
// In src/services/symptomChecker.ts
export const getSymptomAdvice = async (input: string) => {
  // Add new symptom patterns
  if (input.includes('new-symptom')) {
    return {
      answer: 'Custom response for new symptom',
      // ... other response properties
    };
  }
};
```

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Accessibility**: Screen readers (NVDA, JAWS, VoiceOver)
- **Voice Features**: Browsers with Web Speech API support

## 🤝 Contributing

1. Follow accessibility guidelines (WCAG 2.1 AA)
2. Maintain TypeScript strict mode
3. Add proper ARIA labels for new components
4. Test with keyboard navigation
5. Ensure mobile responsiveness
6. Test offline functionality

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### **Common Issues**
- **Voice not working**: Check browser permissions and Web Speech API support
- **Settings not saving**: Verify localStorage is enabled
- **Offline issues**: Check service worker registration
- **Accessibility problems**: Test with keyboard navigation and screen readers

### **For Issues With:**
- **Gemma 3n Integration**: Check `GEMMA_INTEGRATION.md` for detailed setup
- **Accessibility**: Ensure browser supports modern web standards
- **Voice Features**: Verify microphone permissions and browser support
- **Offline Functionality**: Check browser storage settings

## 🔮 Future Enhancements

- **Multi-language Support**: Internationalization (i18n)
- **Advanced AI Models**: Support for additional AI providers
- **Telemedicine**: Video consultation integration
- **Health Tracking**: Personal health metrics dashboard
- **Offline Sync**: Background sync when connection restored
- **Progressive Web App**: Full PWA capabilities with app installation

---

**CareWise AI** - Making healthcare accessible to everyone, everywhere, offline.