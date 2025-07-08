# CareWise AI: Your Offline, Private, Accessible Health Companion

**Empowering health access for everyone, everywhere, with on-device Gemma 3n intelligence.**

<img width="1920" height="1032" alt="CareWise AI Project Screenshot" src="https://github.com/user-attachments/assets/268bf9a6-a835-418f-8d7c-378c0cc2971c" />



---

## 🚀 Introduction

In a world increasingly reliant on digital connectivity, access to vital health information remains a profound challenge for millions. Remote communities, individuals facing internet outages, and those with specific accessibility needs often find themselves isolated from critical guidance. Traditional online solutions compromise privacy and are unusable without a connection.

**CareWise AI** is a groundbreaking solution designed to bridge this gap. By harnessing the unparalleled on-device capabilities of **Google's Gemma 3n model** (accessed locally via Ollama), CareWise AI transforms your laptop into a personal, private, and powerful health companion. It offers immediate, intelligent health advice, anytime, anywhere – **completely offline and with user privacy at its core.**

> _“Access to care shouldn’t depend on connectivity. CareWise AI brings intelligence closer to the people who need it most – privately, offline, and accessibly.”_

This project directly addresses the hackathon's call to build for impact, focusing on **Health & Wellness** and significantly enhancing **Accessibility** for diverse user groups.

---

## ✨ Features

* **💻 100% Offline Functionality:** Get critical health advice without any internet connection. Perfect for remote areas, emergency zones, or private consultations.
* **🔐 Privacy-First Design:** All AI processing occurs directly on your device using Gemma 3n and Ollama. Your health data never leaves your machine.
* **💬 Intelligent "Ask AI" Assistant:** Powered by Gemma 3n, this conversational interface handles complex, nuanced health queries, providing detailed, personalized insights.
* **🩺 Intuitive Symptom Checker:** A rule-based system providing quick, structured suggestions for common symptoms with actionable steps.
* **🎙️ Multimodal Voice Interaction:** Gemma 3n enables voice input/output in “Ask AI”, allowing hands-free interaction—ideal for users with mobility or vision impairments.
* **♿ Enhanced Accessibility:** Designed with screen-reader compatibility, adjustable text sizes, high contrast themes, and motion reduction for inclusive usage.
* **🖼️ Interactive Body Diagram:** Visually select affected areas to streamline symptom input, enhancing clarity for all user types.

---

## 📺 Video Demo (Coming Soon!)

Witness CareWise AI in action! This video will demonstrate:

* Its offline capabilities
* Voice-driven "Ask AI" feature
* Inclusive design for users with diverse needs

**[Link to Your YouTube/X/TikTok Video Demo Here]**
*(Replace with your video once uploaded, ensuring it's publicly accessible!)*

---

## 🌟 Impact & Accessibility

CareWise AI is engineered for tangible, positive impact:

* **Bridging Connectivity Gaps:** Empowers users in rural, underserved, or disaster-affected areas with zero-internet medical guidance.
* **Empowering the Visually Impaired:**
    * Fully voice-interactive “Ask AI” experience allows users to speak complex medical questions and receive comprehensive spoken answers, significantly reducing reliance on visual interfaces.
    * Text outputs can be spoken aloud via browser-native speech synthesis, ensuring critical guidance is always audibly accessible.
* **Supporting the Hearing Impaired:**
    * Provides clear, legible text responses for all health suggestions and AI outputs.
    * Customizable font size and contrast settings are available for optimal reading.
* **Ensuring Data Privacy:** All AI inference happens entirely on-device using Ollama. No sensitive health information is sent to external servers, ensuring no tracking, no leaks, and fostering complete user trust.

CareWise AI is more than just an app—it's a step toward equitable, **trusted**, and **independent** digital healthcare for everyone.

---

## ⚙️ Technical Stack

* **Frontend:** React, TypeScript, Tailwind CSS
* **State Management:** Zustand
* **Local Storage:** IndexedDB
* **AI Framework:** [Ollama](https://ollama.ai/)
* **On-Device LLM:** [Google Gemma 3n](https://ai.google.dev/gemma/docs/gemma3n)
* **Voice Interaction:** Browser-native Speech-to-Text & Text-to-Speech APIs
* **Build Tool:** Vite

---

## 🚀 Installation & Local Setup

To run CareWise AI locally and experience the full power of Gemma 3n, please follow these steps carefully:

1.  **Prerequisites:**
    * Node.js (LTS version recommended) & npm (or yarn) installed on your system.
    * **Ollama:** Download and install the Ollama application for your operating system from [ollama.ai](https://ollama.ai/).

2.  **Pull Gemma 3n Model:**
    * Open your terminal or command prompt.
    * Execute the following command to pull the specific Gemma 3n model used in this project:
        ```bash
        ollama pull gemma3n:e4b
        ```
        *(Note: It is crucial that this model tag `gemma3n:e4b` exactly matches the model specified in `src/services/healthAI.ts` for the "Ask AI" feature to function correctly.)*

3.  **Start Ollama Service (if not already running):**
    * **Important:** Ollama runs as a background server that your CareWise AI application connects to.
    * **On Windows/macOS:** Ollama typically starts automatically after installation or when you launch the Oll Ollama application from your system (e.g., Start Menu on Windows, Applications folder on macOS). Please ensure the Ollama application is actively running (you can usually check for its icon in your system tray or menu bar).
    * **On Linux/manual setup:** You might need to explicitly start the Ollama server in a dedicated terminal window:
        ```bash
        ollama serve
        ```
        Keep this terminal window open while you are running and using CareWise AI.

4.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/YourUsername/CareWiseAI.git](https://github.com/YourUsername/CareWiseAI.git)  # Replace with your actual GitHub repository URL
    cd CareWiseAI
    ```

5.  **Install Dependencies:**
    * Navigate into the cloned `CareWiseAI` directory in your terminal.
    ```bash
    npm install
    # or
    yarn install
    ```

6.  **Run the Application:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This command will start the development server. CareWise AI should then open automatically in your default web browser, usually at `http://localhost:5173`.

---

## 💡 Usage

* **Symptom Checker:** Navigate to the “Symptom Checker” page. You can use the interactive body diagram to select affected areas or simply describe your symptoms in the text input field. Click “Check Symptoms” for instant, rule-based health feedback and actionable steps.
* **Ask AI:** Go to the “Ask AI” page for more complex and conversational queries. Click the microphone icon to speak your health question, or type it into the text box. The AI, powered by Gemma 3n locally on your device via Ollama, will respond with a detailed, intelligent answer. The response can also be listened to via the built-in speaker icon.
* **Accessibility Settings:** Access the dedicated settings panel (usually a cog or accessibility icon) to customize your user experience. You can adjust font size, switch between dark and light themes, set high contrast modes, and reduce motion for improved usability based on your preferences.

---

## 📂 Project Structure Highlights

* `src/components/` – Contains all reusable UI components (e.g., `BodyDiagram.tsx`, `SymptomForm.tsx`).
* `src/components/SymptomCheckerPage.tsx` – The main page component for the rule-based symptom analysis functionality.
* `src/components/AskAIPage.tsx` – The main page component for the conversational AI interface powered by Gemma 3n.
* `src/services/symptomChecker.ts` – Holds the independent, non-AI, rule-based logic for symptom checking.
* `src/services/healthAI.ts` – Manages the integration and communication logic with your local Ollama instance and the Gemma 3n model.
* `src/hooks/useTextToSpeech.ts` – A custom React hook for utilizing browser-native Text-to-Speech capabilities.
* `src/hooks/useVoiceInput.ts` – A custom React hook for handling browser-native Speech-to-Text input.
* `src/store/accessibilityStore.ts` – A Zustand-based store for managing global accessibility settings and preferences within the application.
* `public/` – Directory for static assets, like images or fonts, served directly by the web server.

---

## 🧠 Gemma 3n & Ollama Integration Details

The intelligence backbone of CareWise AI's "Ask AI" feature is defined in `src/services/healthAI.ts`. This file establishes the connection and interaction with your **local Ollama instance** to leverage Gemma 3n for AI chat functionality.

```typescript
// src/services/healthAI.ts (Simplified for README clarity)
import { Ollama } from 'ollama';

// Initialize Ollama client to connect to the local server
const ollama = new Ollama({ host: 'http://localhost:11434' });

/**
 * Streams a health-related query to the local Gemma 3n model via Ollama.
 * @param prompt The user's input query.
 * @returns An asynchronous iterator for streamed response chunks.
 */
export const streamQueryHealth = async (prompt: string) => {
    try {
        const response = await ollama.chat({
            model: 'gemma3n:e4b', // Ensure this model tag matches your pulled model
            messages: [{ role: 'user', content: prompt }],
            stream: true, // Enable streaming for real-time response generation
        });
        return response; // Returns an iterator that yields chunks of the response
    } catch (error) {
        console.error('Error querying Gemma 3n via Ollama:', error);
        // Provide user-friendly error message if Ollama is not running or model not found
        throw new Error('Failed to get AI response. Please ensure Ollama is running and the "gemma3n:e4b" model is pulled locally.');
    }
};

// IMPORTANT: The Symptom Checker functionality (in src/services/symptomChecker.ts)
// operates independently as a rule-based system and does NOT utilize Gemma 3n or any AI.
// This design ensures robust, foundational health advice even if AI components are not active.
