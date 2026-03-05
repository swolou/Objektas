import { useState, useCallback } from 'react';

const STORAGE_KEY = 'elektros_objektai';

export function useLocalStorage() {
  const [objects, setObjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const save = useCallback((newObjects) => {
    setObjects(newObjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newObjects));
  }, []);

  return [objects, save];
}
