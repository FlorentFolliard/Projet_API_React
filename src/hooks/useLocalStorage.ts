import { useState, useEffect } from 'react';

export function useLocalStorage<T>(cle: string, valeurInitiale: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [valeur, setValeur] = useState<T>(() => {
    try {
      const item = localStorage.getItem(cle);
      return item ? (JSON.parse(item) as T) : valeurInitiale;
    } catch {
      return valeurInitiale;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(cle, JSON.stringify(valeur));
    } catch (e) {
      console.error(e);
    }
  }, [cle, valeur]);

  return [valeur, setValeur];
}