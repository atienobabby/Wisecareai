// src/components/MessageHistory.tsx
import React, { useRef, useEffect } from 'react';
import { User, Bot, Volume2, VolumeX } from 'lucide-react';
import { Message } from '../types';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface MessageHistoryProps {
  messages: Message[];
  fontSize: string;
}

export const MessageHistory: React.FC<MessageHistoryProps> = ({ messages, fontSize }) => {
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <Bot className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h3 className={`${fontSize} font-semibold mb-2`}>
          Welcome to HealthQuery AI
        </h3>
        <p className={`text-center text-sm text-gray-500 dark:text-gray-400`}>
          Ask me any general health question using text or voice input. I'm here to provide helpful information while maintaining your privacy.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start space-x-3 ${
            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          {/* Avatar (User or AI) */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            message.role === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}>
            {message.role === 'user' ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>

          {/* Message Content */}
          <div className={`flex-1 max-w-3xl ${
            message.role === 'user' ? 'text-right' : 'text-left'
          }`}>
            <div className={`inline-block p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
            }`}>
              <p className={`${fontSize} leading-relaxed whitespace-pre-wrap break-words`}>
                {message.content}
              </p>

              {/* Display Image if present */}
              {message.image && (
                <img
                  src={message.image}
                  alt="Uploaded"
                  className="mt-2 max-w-full h-auto rounded-md border border-gray-400"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
              )}

              {/* Voice indicator */}
              {message.isVoice && (
                <span className="text-xs opacity-75 mt-2 block">
                  🎤 Voice message
                </span>
              )}
            </div>

            {/* Message actions */}
            <div className={`flex items-center space-x-2 mt-2 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>

              {/* Text-to-speech for AI messages */}
              {message.role === 'assistant' && (
                <button
                  onClick={() => handleSpeak(message.content)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                  title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};