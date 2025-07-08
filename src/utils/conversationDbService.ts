// src/utils/conversationDbService.ts
import { Message } from '../types';

const DB_NAME = 'HealthQueryDB'; // Re-using your existing database name
const DB_VERSION = 2; // Re-using your existing database version
const CONVERSATION_MESSAGES_STORE = 'conversationMessagesData'; // ***NEW Object Store Name***

let conversationDbInstance: IDBDatabase | null = null; // Use a distinct variable name

const openConversationMessagesDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (conversationDbInstance) {
      resolve(conversationDbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      // Create the new object store for conversation-specific messages
      if (!db.objectStoreNames.contains(CONVERSATION_MESSAGES_STORE)) {
        // The key path for this store is 'conversationId', as we store messages per conversation
        db.createObjectStore(CONVERSATION_MESSAGES_STORE, { keyPath: 'conversationId' });
      }
      // Note: Your original 'messages' store (from useIndexedDB.ts) will be handled by its own onupgradeneeded logic.
      // This file only concerns itself with 'conversationMessagesData'.
    };

    request.onsuccess = (event) => {
      conversationDbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(conversationDbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB (Conversation Messages) open error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

/**
 * Saves the entire array of messages for a specific conversation to IndexedDB.
 * This overwrites any existing messages for that conversationId.
 */
// ADD export HERE
export const saveConversationMessages = async (conversationId: string, messages: Message[]): Promise<void> => {
  const db = await openConversationMessagesDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATION_MESSAGES_STORE], 'readwrite');
    const store = transaction.objectStore(CONVERSATION_MESSAGES_STORE);

    // Store an object where 'conversationId' is the key and 'messages' is the value
    const dataToStore = { conversationId, messages };
    const request = store.put(dataToStore); // 'put' will add or update the record

    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error(`Error saving messages for conversation ${conversationId}:`, (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
};

/**
 * Loads the array of messages for a specific conversation from IndexedDB.
 */
// ADD export HERE
export const loadConversationMessages = async (conversationId: string): Promise<Message[]> => {
  const db = await openConversationMessagesDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATION_MESSAGES_STORE], 'readonly');
    const store = transaction.objectStore(CONVERSATION_MESSAGES_STORE);
    const request = store.get(conversationId);

    request.onsuccess = () => {
      const result = request.result;
      // If found, return the messages array, otherwise an empty array
      resolve(result ? result.messages : []);
    };
    request.onerror = (event) => {
      console.error(`Error loading messages for conversation ${conversationId}:`, (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
};

/**
 * Deletes all messages for a specific conversation from IndexedDB.
 */
// ADD export HERE
export const deleteConversationMessages = async (conversationId: string): Promise<void> => {
  const db = await openConversationMessagesDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATION_MESSAGES_STORE], 'readwrite');
    const store = transaction.objectStore(CONVERSATION_MESSAGES_STORE);
    const request = store.delete(conversationId);

    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error(`Error deleting messages for conversation ${conversationId}:`, (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
};

/**
 * Clears all data from the conversation messages object store. (Useful for development/reset)
 */
// ADD export HERE
export const clearAllConversationMessages = async (): Promise<void> => {
  const db = await openConversationMessagesDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATION_MESSAGES_STORE], 'readwrite');
    const store = transaction.objectStore(CONVERSATION_MESSAGES_STORE);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error('Error clearing all conversational messages from IndexedDB:', (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
};