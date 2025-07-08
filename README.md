# CareWise AI: Your Offline, Private, Accessible Health Companion

**Empowering health access for everyone, everywhere, with on-device Gemma 3n intelligence.**

<img width="1920" height="1032" alt="Image" src="https://github.com/user-attachments/assets/268bf9a6-a835-418f-8d7c-378c0cc2971c" />


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

- Its offline capabilities
- Voice-driven "Ask AI" feature
- Inclusive design for users with diverse needs

**[Link to Your YouTube/X/TikTok Video Demo Here]**  
*(Replace with your video once uploaded)*

---

## 🌟 Impact & Accessibility

CareWise AI is engineered for tangible, positive impact:

* **Bridging Connectivity Gaps:** Empowers users in rural, underserved, or disaster-affected areas with zero-internet medical guidance.
* **Empowering the Visually Impaired:**
  * Fully voice-interactive “Ask AI” experience
  * Text outputs can be spoken aloud via browser-native speech synthesis
* **Supporting the Hearing Impaired:**
  * Clear, legible text responses
  * Customizable font size and contrast settings for easy reading
* **Ensuring Data Privacy:** All inference happens on-device using Ollama. Nothing is sent to external servers—no tracking, no leaks.

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

To run CareWise AI locally and experience the full power of Gemma 3n:

1.  **Prerequisites:**
    * Node.js (LTS version recommended) & npm (or yarn)
    * **Ollama:** Download and install Ollama from [ollama.ai](https://ollama.ai/). Ensure it's running in the background.

2.  **Pull Gemma 3n Model:**
    ```bash
    ollama pull gemma:4n
    ```
    *(You can use `gemma:2n` for lower memory usage if needed. Ensure your code config matches the model.)*

3.  **Clone the Repository:**
    ```bash
    git clone https://github.com/YourUsername/CareWiseAI.git  # Replace with your actual repo
    cd CareWiseAI
    ```

4.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

5.  **Run the Application:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Then visit `http://localhost:5173` in your browser.

---

## 💡 Usage

* **Symptom Checker:** Go to the “Symptom Checker” page. Use the body diagram or describe symptoms in text. Click “Check Symptoms” for instant feedback.
* **Ask AI:** Navigate to “Ask AI.” Click the microphone to speak your query or type it. The AI (Gemma 3n via Ollama) will respond with a local, intelligent answer.
* **Accessibility Settings:** Use the settings panel to change font size, theme (dark/light), contrast, and motion preference for improved usability.

---

## 📂 Project Structure Highlights

* `src/components/` – Reusable UI (e.g., `BodyDiagram.tsx`, `SymptomForm.tsx`)
* `src/components/SymptomCheckerPage.tsx` – Main rule-based symptom analysis page
* `src/components/AskAIPage.tsx` – Conversational AI interface powered by Gemma 3n
* `src/services/symptomChecker.ts` – Logic for rule-based symptom checking (non-AI)
* `src/services/healthAI.ts` – Ollama + Gemma 3n integration logic
* `src/hooks/useTextToSpeech.ts` – Text-to-Speech utility
* `src/hooks/useVoiceInput.ts` – Speech-to-Text utility
* `src/store/accessibilityStore.ts` – Zustand-based accessibility state
* `public/` – Static assets

---

## 🧠 Gemma 3n & Ollama Integration Details

The intelligence backbone of CareWise AI is defined in `src/services/healthAI.ts`. It connects to your **local Ollama instance** for AI chat functionality:

```ts
import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

export const streamQueryHealth = async (prompt: string) => {
  try {
    const response = await ollama.chat({
      model: 'gemma:4n',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });
    return response;
  } catch (error) {
    console.error('Error querying Gemma 3n via Ollama:', error);
    throw new Error('Ensure Ollama is running and gemma:4n is pulled.');
  }
};
