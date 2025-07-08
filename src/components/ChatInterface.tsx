// src/components/ChatInterface.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Trash2, AlertCircle, Paperclip, X } from 'lucide-react';
import { Message } from '../types';
import { MessageHistory } from './MessageHistory';
import { VoiceInput } from './VoiceInput'; // Make sure path is correct
import { useChatStore } from '../store/chatStore';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { healthAI } from '../services/healthAI';
import { FONT_SIZES } from '../utils/accessibility';
import { v4 as uuidv4 } from 'uuid';

interface ChatInterfaceProps {
  fontSize: 'small' | 'medium' | 'large' | 'xl';
}

// Helper to convert File to Base64 Data URL (for image preview)
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const MAX_CHARACTERS = 10000; // Updated character limit to 10,000

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ fontSize }) => {
  const { messages, addMessage, setLoading, isLoading, clearMessages, updateMessage } = useChatStore();
  const [inputText, setInputText] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { saveMessage, clearMessages: clearDBMessages, error: dbError } = useIndexedDB();

  // Auto-scroll to bottom of chat history - Refined Logic
  useEffect(() => {
    const chatContainer = messagesEndRef.current?.parentElement;
    if (chatContainer) {
      // Check if user is near the bottom (within 100px of scroll height) or if it's a new chat
      const isScrolledToBottom = chatContainer.scrollHeight - chatContainer.clientHeight <= chatContainer.scrollTop + 100;
      if (isScrolledToBottom || messages.length === 1) { // Also scroll for the very first message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]); // Trigger scroll on new messages

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle image file selection
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      try {
        const previewUrl = await fileToBase64(file);
        setImagePreviewUrl(previewUrl);
      } catch (error) {
        console.error("Error reading file as Base64:", error);
        setImagePreviewUrl(null);
      }
    } else {
      setSelectedImage(null);
      setImagePreviewUrl(null);
      if (file) alert("Please select an image file (PNG, JPG, GIF).");
    }
  };

  // Remove selected image
  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = useCallback(async (text: string, isVoice = false) => {
    if ((!text.trim() && !selectedImage) || isLoading) {
      return;
    }

    setLoading(true);
    setShowDisclaimer(false);

    const userMessage: Message = {
      id: uuidv4(),
      content: text.trim(),
      role: 'user',
      timestamp: new Date(),
      isVoice: isVoice,
      image: imagePreviewUrl,
    };

    addMessage(userMessage);
    await saveMessage(userMessage);

    setInputText('');
    removeSelectedImage();

    const latestMessagesSnapshot = useChatStore.getState().messages;

    const ollamaContext = latestMessagesSnapshot.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    const assistantMessageId = uuidv4();
    let assistantPartialContent = '';

    const assistantPlaceholder: Message = {
      id: assistantMessageId,
      content: '...',
      role: 'assistant',
      timestamp: new Date(),
    };
    addMessage(assistantPlaceholder);


    try {
      const stream = healthAI.streamQueryHealth({
        query: text.trim(),
        context: ollamaContext,
        image: selectedImage,
      });

      for await (const chunk of stream) {
        assistantPartialContent += chunk;
        updateMessage(assistantMessageId, assistantPartialContent);
      }
      const finalAiMessage: Message = {
        id: assistantMessageId,
        content: assistantPartialContent,
        role: 'assistant',
        timestamp: new Date(),
      };
      await saveMessage(finalAiMessage);

    } catch (error: any) {
      console.error('Error streaming health query:', error);
      const errorMessageContent = "I'm sorry, I'm having trouble responding right now. Please try again in a moment, or consult with a healthcare professional for medical concerns.";
      updateMessage(assistantMessageId, errorMessageContent);
      const errorMessage: Message = {
        id: assistantMessageId,
        content: errorMessageContent,
        role: 'assistant',
        timestamp: new Date(),
      };
      await saveMessage(errorMessage);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [addMessage, updateMessage, messages, isLoading, selectedImage, imagePreviewUrl, saveMessage, setLoading, setShowDisclaimer]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  // Only set the input text with the transcript, do not send automatically
  const handleVoiceTranscript = useCallback((text: string) => {
    setInputText(text);
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      await clearDBMessages();
      clearMessages();
      setShowDisclaimer(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e); // Call handleSubmit for Enter key press
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`${FONT_SIZES[fontSize]} font-bold text-gray-900 dark:text-white`}>
              Ask AI
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your privacy-focused health assistant
            </p>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Chat</span>
            </button>
          )}
        </div>

        {/* Medical Disclaimer */}
        {showDisclaimer && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Medical Disclaimer:</strong> This AI provides general health information for educational purposes only. Always consult qualified healthcare professionals for medical advice, diagnosis, or treatment.
                </p>
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="text-xs text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message History Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         <MessageHistory messages={messages} fontSize={FONT_SIZES[fontSize]} />
         <div ref={messagesEndRef} />
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex-shrink-0 p-4">
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
            <span className="text-sm">Thinking...</span>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        {dbError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              Storage error: {dbError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          {/* Image Preview and Remove Button */}
          {imagePreviewUrl && (
            <div className="relative w-24 h-24 mb-3 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0">
              <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeSelectedImage}
                className="absolute top-1 right-1 bg-gray-700 bg-opacity-75 text-white rounded-full p-0.5 hover:bg-opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          {/* Paperclip Button to trigger file input */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            title="Attach Image"
            aria-label="Attach Image"
            disabled={isLoading}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Voice Input Button */}
          <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />

          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about exercise, nutrition, sleep, or general health topics..."
              className={`w-full ${FONT_SIZES[fontSize]} px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors custom-scrollbar`}
              rows={2}
              maxLength={MAX_CHARACTERS} // Apply new max length: 10,000
              disabled={isLoading}
              aria-label="Chat input field"
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
              {inputText.length}/{MAX_CHARACTERS} characters
            </div>
          </div>

          <button
            type="submit"
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};