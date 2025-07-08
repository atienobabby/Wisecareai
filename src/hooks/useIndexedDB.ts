import { useState, useEffect } from 'react';
import { Message } from '../types';

const DB_NAME = 'HealthQueryDB';
const DB_VERSION = 2;
const STORE_NAME = 'messages';

export const useIndexedDB = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
        }
      };
    });
  };

  const saveMessage = async (message: Message): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await store.add(message);
    } catch (err) {
      setError('Failed to save message');
      console.error('IndexedDB save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessages = async (): Promise<Message[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      
      return new Promise((resolve, reject) => {
        const request = index.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const messages = request.result.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          resolve(messages);
        };
      });
    } catch (err) {
      setError('Failed to load messages');
      console.error('IndexedDB load error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await store.clear();
    } catch (err) {
      setError('Failed to clear messages');
      console.error('IndexedDB clear error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveMessage,
    getMessages,
    clearMessages,
    isLoading,
    error
  };
};