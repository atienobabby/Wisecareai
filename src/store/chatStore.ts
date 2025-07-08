// src/store/chatStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Message, Conversation } from '../types';

// NEW: Import the functions from the new conversation-specific IndexedDB service
import {
  saveConversationMessages,
  loadConversationMessages,
  deleteConversationMessages,
  clearAllConversationMessages // Optional: for full reset of conversation messages
} from '../utils/conversationDbService'; // <<< IMPORTANT: Updated import path!


interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Message[]; // This array holds messages for the *currently displayed* conversation (from IndexedDB)
  inputText: string;
  isLoading: boolean;
  isDisclaimerVisible: boolean;

  addMessage: (message: Message) => void;
  updateMessage: (id: string, newContent: string) => void;
  setInputText: (text: string) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  setDisclaimerVisible: (visible: boolean) => void;
  // setAllMessages: This action now also needs to trigger IndexedDB save
  setAllMessages: (messages: Message[]) => void;

  startNewConversation: () => void;
  loadConversation: (id: string) => Promise<void>; // Make it return a Promise for clarity
  deleteConversation: (id: string) => Promise<void>; // Make it return a Promise for clarity
  updateConversationTitle: (id: string, newTitle: string) => void;
  // Internal helpers, will now interact with IndexedDB
  addMessageToCurrentConversation: (message: Message) => Promise<void>;
  updateMessageInCurrentConversation: (id: string, newContent: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // EXISTING INITIAL STATE
      messages: [],
      inputText: '',
      isLoading: false,
      isDisclaimerVisible: true,

      // NEW INITIAL STATE PROPERTIES
      conversations: [],
      currentConversationId: null,

      // --- ACTION IMPLEMENTATIONS ---

      // addMessage: This updates the `messages` array for the current DISPLAY.
      // It also triggers adding the message to the persistent conversation history in IndexedDB.
      addMessage: (message) => {
        set((state) => ({ messages: [...state.messages, message] }));
        get().addMessageToCurrentConversation(message); // Call async helper
      },

      // updateMessage: This updates the `messages` array for current DISPLAY.
      // It also triggers updating the message in the persistent conversation history in IndexedDB.
      updateMessage: (id, newContent) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, content: newContent } : msg
          ),
        }));
        get().updateMessageInCurrentConversation(id, newContent); // Call async helper
      },

      setInputText: (text) => set({ inputText: text }),
      setLoading: (loading) => set({ isLoading: loading }),

      clearMessages: () => {
        get().startNewConversation();
      },

      setDisclaimerVisible: (visible) => set({ isDisclaimerVisible: visible }),

      // setAllMessages: This replaces all messages for current display,
      // and ALSO updates the current conversation's history in IndexedDB.
      setAllMessages: async (messages) => {
        const currentConversationId = get().currentConversationId;
        if (!currentConversationId) {
            console.warn("setAllMessages: No current conversation ID, cannot set messages.");
            set({ messages: [] }); // Clear displayed messages if no conv ID
            return;
        }

        // Update the conversations metadata in localStorage (just timestamp)
        set(state => ({
            conversations: state.conversations.map(conv =>
                conv.id === currentConversationId
                    ? { ...conv, lastUpdated: Date.now() } // Update timestamp only for localStorage
                    : conv
            ),
            messages: messages, // Update displayed messages
        }));

        // Crucial: Save the entire updated messages array to IndexedDB
        try {
            await saveConversationMessages(currentConversationId, messages);
            console.log(`Set and saved ${messages.length} messages for conversation ${currentConversationId} to IndexedDB.`);
        } catch (error) {
            console.error(`Failed to save all messages for conversation ${currentConversationId} to IndexedDB:`, error);
        }
      },

      // NEW CONVERSATION MANAGEMENT ACTION IMPLEMENTATIONS
      startNewConversation: () => {
        const newConversation: Conversation = {
          id: uuidv4(),
          title: 'New Chat',
          messages: [], // messages here are just an empty placeholder for the conversation object in localStorage
          createdAt: Date.now(),
          lastUpdated: Date.now(),
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations], // Add to the beginning of the list
          currentConversationId: newConversation.id,
          messages: [], // Clear displayed messages for the new chat
          inputText: '',
          isLoading: false,
          isDisclaimerVisible: true,
        }));
        // No need to save to IndexedDB immediately, as there are no messages yet.
        // It will be saved when the first message is added.
      },

      // loadConversation now fetches messages from IndexedDB
      loadConversation: async (id: string) => {
        const state = get();
        const conversationToLoad = state.conversations.find((conv) => conv.id === id);
        if (conversationToLoad) {
          // Immediately set current conversation ID and clear messages for quick UI update
          set({
            currentConversationId: id,
            messages: [], // Clear old messages while new ones load
            inputText: '',
            isLoading: false,
          });

          try {
            // Load actual messages from IndexedDB
            const loadedMessages = await loadConversationMessages(id);
            set({ messages: loadedMessages }); // Update displayed messages with loaded data
            console.log(`Loaded ${loadedMessages.length} messages for conversation ${id} from IndexedDB.`);
          } catch (error) {
            console.error(`Error loading messages for conversation ${id} from IndexedDB:`, error);
            set({ messages: [] }); // Fallback to empty if load fails
          }
        } else {
            console.warn(`Conversation with ID ${id} not found in localStorage metadata.`);
            // Optionally, switch to a new conversation if the requested one doesn't exist
            // get().startNewConversation();
        }
      },

      // deleteConversation now also deletes messages from IndexedDB
      deleteConversation: async (id: string) => {
        set((state) => {
          const updatedConversations = state.conversations.filter((conv) => conv.id !== id);
          let newCurrentConversationId = state.currentConversationId;
          let newMessages: Message[] = [];

          // If the deleted conversation was the current one
          if (state.currentConversationId === id) {
            if (updatedConversations.length > 0) {
              // Switch to the most recent conversation if available
              const mostRecentConv = updatedConversations.sort((a, b) => b.lastUpdated - a.lastUpdated)[0];
              newCurrentConversationId = mostRecentConv.id;
              // Messages for this new current conversation will be loaded by loadConversation due to currentConversationId change
            } else {
              // If no conversations left, prepare for a new one
              newCurrentConversationId = null; // Will trigger startNewConversation on rehydration or ChatHistory useEffect
              newMessages = [];
            }
          }

          // Asynchronously delete messages from IndexedDB for the deleted conversation
          deleteConversationMessages(id)
            .catch(error => console.error(`Failed to delete messages for conversation ${id} from IndexedDB:`, error));

          return {
            conversations: updatedConversations,
            currentConversationId: newCurrentConversationId,
            messages: newMessages, // Messages will be refreshed by loadConversation for the new current chat
          };
        });
      },

      updateConversationTitle: (id: string, newTitle: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title: newTitle } : conv
          ),
        }));
      },

      // addMessageToCurrentConversation: This updates the `conversations` array (in-memory, for localStorage metadata).
      // It also triggers the save to IndexedDB for the current conversation's messages.
      addMessageToCurrentConversation: async (message: Message) => {
        const currentConversationId = get().currentConversationId;
        if (!currentConversationId) {
          console.warn("No current conversation ID, cannot add message to history.");
          return;
        }

        // Get the current list of messages for this conversation *from the currently displayed messages*
        // This is safe because `addMessage` (which calls this) updates `get().messages` first.
        let currentMessagesForConversation = [...get().messages];
        if (!currentMessagesForConversation.some(m => m.id === message.id)) {
            // Ensure message is only added if not already present (e.g., in case of double call)
            currentMessagesForConversation.push(message);
        }

        set((state) => {
          const updatedConversations = state.conversations.map((conv) => {
            if (conv.id === currentConversationId) {
              let newTitle = conv.title;
              // Only update title if it's the initial 'New Chat' title and it's the first user message
              if (conv.title === 'New Chat' && message.role === 'user' && currentMessagesForConversation.length === 1) {
                newTitle = message.content.substring(0, 30);
                if (message.content.length > 30) newTitle += '...';
              }
              // For localStorage metadata, we don't store the messages array here.
              // We just update the lastUpdated and title.
              return {
                ...conv,
                // messages: updatedMessages, // DO NOT store messages here for localStorage
                lastUpdated: Date.now(),
                title: newTitle,
              };
            }
            return conv;
          });
          return { conversations: updatedConversations };
        });

        // Crucial: Save the entire updated messages array to IndexedDB
        try {
            await saveConversationMessages(currentConversationId, currentMessagesForConversation);
            console.log(`Added message and saved all ${currentMessagesForConversation.length} messages for conversation ${currentConversationId} to IndexedDB.`);
        } catch (error) {
            console.error(`Failed to save messages after adding for conversation ${currentConversationId} to IndexedDB:`, error);
        }
      },

      // updateMessageInCurrentConversation: Updates a message in the `conversations` array (in-memory metadata)
      // and triggers saving the updated message array to IndexedDB.
      updateMessageInCurrentConversation: async (id: string, newContent: string) => {
        const currentConversationId = get().currentConversationId;
        if (!currentConversationId) {
          console.warn("No current conversation ID, cannot update message in history.");
          return;
        }

        // Get the current list of messages from the displayed state and update the specific message
        const currentMessagesForConversation = get().messages.map(msg =>
            msg.id === id ? { ...msg, content: newContent } : msg
        );

        set((state) => {
          const updatedConversations = state.conversations.map(conv => {
            if (conv.id === currentConversationId) {
              // For localStorage metadata, we don't store the messages array here.
              // We just update the lastUpdated.
              return {
                ...conv,
                // messages: updatedMessages, // DO NOT store messages here for localStorage
                lastUpdated: Date.now()
              };
            }
            return conv;
          });
          return { conversations: updatedConversations };
        });

        // Crucial: Save the entire updated messages array to IndexedDB
        try {
            await saveConversationMessages(currentConversationId, currentMessagesForConversation);
            console.log(`Updated message and saved all ${currentMessagesForConversation.length} messages for conversation ${currentConversationId} to IndexedDB.`);
        } catch (error) {
            console.error(`Failed to save messages after updating for conversation ${currentConversationId} to IndexedDB:`, error);
        }
      },
    }),
    {
      name: 'chat-storage', // The name for localStorage
      storage: createJSONStorage(() => localStorage),
      // --- CRITICAL MODIFICATION FOR PERSISTENCE ---
      // This partialize function now *ONLY* saves conversation metadata to localStorage.
      // Message content (especially image data) is explicitly EXCLUDED here, as it's now in IndexedDB.
      partialize: (state) => ({
        conversations: state.conversations.map((conv) => ({
          id: conv.id,
          title: conv.title,
          createdAt: conv.createdAt,
          lastUpdated: conv.lastUpdated,
          // IMPORTANT: DO NOT include 'messages' here. They are stored in IndexedDB.
          // If your `Conversation` type requires `messages: Message[]`, then provide an empty array
          // or a simplified version to prevent large data in localStorage.
          messages: [], // Explicitly empty for localStorage.
        })),
        inputText: state.inputText,
        isDisclaimerVisible: state.isDisclaimerVisible,
        currentConversationId: state.currentConversationId,
        // The root `messages` state (`state.messages`) is not persisted by partialize.
        // It's ephemeral for display and loaded from IndexedDB.
        // `isLoading` is also not persisted.
      }),
      // --- END CRITICAL MODIFICATION ---

      onRehydrateStorage: (_state) => {
        console.log('Rehydrating chat store...');
        return (storedState) => {
          if (storedState) {
            storedState.conversations = storedState.conversations || [];

            let initialConversationId = storedState.currentConversationId;

            // If no current ID, or current ID is invalid, try to pick the most recent conversation
            if (!initialConversationId || !storedState.conversations.find(c => c.id === initialConversationId)) {
                if (storedState.conversations.length > 0) {
                    const mostRecentConv = storedState.conversations.sort((a, b) => b.lastUpdated - a.lastUpdated)[0];
                    initialConversationId = mostRecentConv.id;
                } else {
                    initialConversationId = null; // No conversations at all
                }
            }

            // Set the state based on rehydrated localStorage data (metadata only)
            useChatStore.setState({
                conversations: storedState.conversations,
                currentConversationId: initialConversationId,
                inputText: storedState.inputText,
                isDisclaimerVisible: storedState.isDisclaimerVisible,
                messages: [], // Always start with empty messages, they will be loaded from IndexedDB
                isLoading: false, // Reset loading state
            });

            // If an initial conversation ID was determined, load its messages from IndexedDB asynchronously
            if (initialConversationId) {
                // Call loadConversation directly as it handles setting messages in the store
                useChatStore.getState().loadConversation(initialConversationId)
                    .then(() => console.log(`Initial conversation (${initialConversationId}) messages loaded from IndexedDB during rehydration.`))
                    .catch(err => console.error("Error loading initial conversation messages on rehydration:", err));
            } else {
                // If no conversations found or selected, ensure messages are empty
                useChatStore.setState({ messages: [] });
            }
          }
          console.log('Storage rehydrated successfully.');
        };
      },
    }
  )
);

// INITIALIZATION LOGIC (outside `create` for initial setup)
// This ensures that if the store initializes with no currentConversationId
// (e.g., after a hard clear or first load), a new chat session is started.
// This is critical to ensure `currentConversationId` is never null on first load.
// We must ensure this runs AFTER onRehydrateStorage completes its initial sync.
// A common pattern is to let ChatHistory's useEffect handle the initial `startNewConversation`
// or `loadConversation` if `currentConversationId` is null.
// Let's remove this global initializer to avoid potential race conditions with onRehydrateStorage.
/*
if (useChatStore.getState().currentConversationId === null && useChatStore.getState().conversations.length === 0) {
    console.log("ChatStore initialized with no current conversation and no existing conversations. Starting new chat.");
    useChatStore.getState().startNewConversation();
}
*/