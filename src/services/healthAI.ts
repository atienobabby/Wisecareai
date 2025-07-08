// src/services/HealthAIService.ts

import { HealthQueryRequest, HealthQueryResponse, OllamaChatMessage } from '../types';

// Define the Ollama API endpoint and model name
const OLLAMA_CHAT_API_URL = 'http://localhost:11434/api/chat'; // Standard Ollama chat endpoint
const GEMMA_MODEL_NAME = 'gemma3n:e4b'; // The model you pulled with Ollama and want to use

// Mock responses (can be kept for fallback or development without Ollama running)
const mockResponses: HealthQueryResponse[] = [
    {
        answer: "Regular exercise is crucial for maintaining good health. Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, combined with muscle-strengthening activities twice a week.",
        confidence: 0.95,
        sources: ["WHO Physical Activity Guidelines", "American Heart Association"],
        disclaimer: "This information is for educational purposes only and should not replace professional medical advice."
    },
    {
        answer: "A balanced diet should include a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, added sugars, and excessive sodium intake.",
        confidence: 0.92,
        sources: ["Dietary Guidelines for Americans", "Harvard School of Public Health"],
        disclaimer: "Individual dietary needs may vary. Consult with a registered dietitian for personalized advice."
    },
    {
        answer: "Adults typically need 7-9 hours of quality sleep per night. Good sleep hygiene includes maintaining a consistent sleep schedule, creating a comfortable sleep environment, and avoiding caffeine late in the day.",
        confidence: 0.88,
        sources: ["National Sleep Foundation", "CDC Sleep Guidelines"],
        disclaimer: "If you have persistent sleep problems, consult with a healthcare provider."
    }
];

export class HealthAIService {
    private static instance: HealthAIService;
    private apiEndpoint: string = OLLAMA_CHAT_API_URL; // Default to Ollama endpoint
    private modelName: string = GEMMA_MODEL_NAME; // Default to Gemma 3n

    private constructor() {
        // Private constructor for singleton pattern
    }

    static getInstance(): HealthAIService {
        if (!HealthAIService.instance) {
            HealthAIService.instance = new HealthAIService();
        }
        return HealthAIService.instance;
    }

    /**
     * Configures the API endpoint and model name. Useful if you want to switch
     * between local Ollama, a remote Ollama, or another AI provider.
     * @param endpoint The API URL (e.g., 'http://localhost:11434/api/chat')
     * @param model The model name (e.g., 'gemma3n:e4b')
     */
    configure(endpoint: string, model: string) {
        this.apiEndpoint = endpoint;
        this.modelName = model;
    }

    /**
     * Helper to convert a File object (image) to a Base64 string suitable for Ollama.
     * Ollama expects images in the 'images' array of a message to be base64 strings
     * WITHOUT the "data:image/jpeg;base64," prefix.
     */
    private async fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Remove the "data:image/...;base64," prefix for Ollama
                const base64String = result.split(',')[1];
                if (base64String) {
                    resolve(base64String);
                } else {
                    reject(new Error("Failed to extract base64 string from Data URL."));
                }
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file); // Read as Data URL to get base64
        });
    }

    /**
     * Sends a health query to Gemma 3N via Ollama, streaming the response.
     *
     * @param request The HealthQueryRequest containing the query, conversation context, and optional image.
     * @returns An AsyncGenerator yielding chunks of the AI's response.
     */
    public async *streamQueryHealth(request: HealthQueryRequest): AsyncGenerator<string, void, undefined> {
        try {
            // Convert HealthQueryRequest context to OllamaChatMessage format
            const messages: OllamaChatMessage[] = request.context || [];

            // Prepare the user's current message
            const userMessage: OllamaChatMessage = { role: 'user', content: request.query };

            // If an image is provided in the request, convert it to Base64 and add to the message
            if (request.image) {
                try {
                    const base64Image = await this.fileToBase64(request.image);
                    userMessage.images = [base64Image]; // Ollama expects an array of base64 strings
                } catch (imageError) {
                    console.error("Error converting image to Base64:", imageError);
                    // If image conversion fails, yield an error message and continue without the image,
                    // or you could choose to throw to stop the process.
                    // For now, we'll log and effectively proceed without the image if it fails.
                    yield "Error: Could not process image for AI query. Attempting to respond based on text only.";
                    // OPTIONAL: If you want to halt the process on image error, uncomment the line below:
                    // throw new Error("Failed to process image for AI query.");
                }
            }

            // Add the user's current message (with or without image) to the conversation history
            messages.push(userMessage);

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.modelName,
                    messages: messages, // Send the full conversation history including the new user message
                    stream: true, // Request a streaming response
                    options: {
                        temperature: 0.7, // Adjust creativity (0.0-1.0)
                        num_predict: -1,  // -1 to predict up to context window, or set max tokens
                    }
                }),
            });

            // Check if the HTTP response itself was successful
            if (!response.ok) {
                const errorData = await response.text(); // Get raw error response from server
                const detailedErrorMessage = `Ollama API returned non-OK status: ${response.status} - ${errorData || response.statusText}`;
                console.error(detailedErrorMessage);
                // Fallback to mock response for HTTP errors
                const mockResponse = await this.getMockResponse(request, detailedErrorMessage); // Pass error message
                yield mockResponse.answer;
                return; // Exit generator after yielding mock
            }

            if (!response.body) {
                const detailedErrorMessage = 'Response body is null. Streaming might not be supported or API error.';
                console.error(detailedErrorMessage);
                // Fallback to mock response if no response body
                const mockResponse = await this.getMockResponse(request, detailedErrorMessage); // Pass error message
                yield mockResponse.answer;
                return; // Exit generator after yielding mock
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let partialLine = ''; // To handle cases where a JSON object is split across chunks

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = (partialLine + chunk).split('\n');
                partialLine = lines.pop() || ''; // The last line might be incomplete

                for (const line of lines) {
                    if (line.trim() === '') continue;
                    try {
                        const parsed = JSON.parse(line);
                        // Ollama streaming for chat endpoint sends `message` field for chunks and `done: true` for final
                        if (parsed.message?.content) { // Check if 'message.content' exists for partial responses
                            yield parsed.message.content; // Yield the content piece
                        } else if (parsed.done === true) {
                            // This is the final message, usually empty content but might have metrics
                            // console.log("Ollama stream finished:", parsed);
                        }
                    } catch (parseError) {
                        // This can happen if a JSON object is split across chunks or malformed.
                        // console.warn('Failed to parse JSON chunk (may be partial):', line, parseError);
                    }
                }
            }
        } catch (error) {
            console.error('Caught error in streamQueryHealth:', error);
            let detailedErrorMessage: string; // Renamed to detailedErrorMessage for clarity
            if (error instanceof Error) {
                detailedErrorMessage = `Error connecting to AI: ${error.message}. Is Ollama running and model '${this.modelName}' pulled?`;
            } else {
                detailedErrorMessage = `An unexpected error occurred: ${String(error)}. Is Ollama running and model '${this.modelName}' pulled?`;
            }
            // Fallback to mock response for caught errors, including the detailed message
            const mockResponse = await this.getMockResponse(request, detailedErrorMessage);
            yield mockResponse.answer;
        }
    }


    /**
     * Fallback to mock response for demonstration or error handling.
     * This will NOT be used if streamQueryHealth connects successfully.
     * @param request The HealthQueryRequest.
     * @param specificErrorMsg Optional: A specific error message to include in the mock.
     * @returns A Promise resolving to a HealthQueryResponse.
     */
    private async getMockResponse(request: HealthQueryRequest, specificErrorMsg?: string): Promise<HealthQueryResponse> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        const baseAnswer = "Thank you for your health question. For specific medical concerns, it's always best to consult with a qualified healthcare professional who can provide personalized advice based on your individual health status and medical history.";

        // Simple keyword matching for demo purposes
        const query = request.query.toLowerCase();
        let chosenMock: HealthQueryResponse | null = null;

        if (query.includes('exercise') || query.includes('workout') || query.includes('fitness')) {
            chosenMock = mockResponses[0];
        } else if (query.includes('diet') || query.includes('nutrition') || query.includes('food') || query.includes('eat')) {
            chosenMock = mockResponses[1];
        } else if (query.includes('sleep') || query.includes('rest') || query.includes('tired')) {
            chosenMock = mockResponses[2];
        }

        const finalAnswer = chosenMock
            ? (specificErrorMsg ? `I'm currently experiencing technical difficulties. ${specificErrorMsg} Here's some related information: ${chosenMock.answer}` : chosenMock.answer)
            : (specificErrorMsg ? `I'm currently experiencing technical difficulties. ${specificErrorMsg} Here's some general information: ${baseAnswer}` : baseAnswer);

        return {
            answer: finalAnswer,
            confidence: chosenMock?.confidence || 0.8,
            sources: chosenMock?.sources || ["General Health Guidelines"],
            disclaimer: chosenMock?.disclaimer || "This information is for educational purposes only and should not replace professional medical advice."
        };
    }
}

// Export singleton instance
export const healthAI = HealthAIService.getInstance();