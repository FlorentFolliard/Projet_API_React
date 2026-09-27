import { useState, useEffect } from 'react';
import type { AsyncState } from '../types';

export function useFetch<T>(url: string): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    status: url ? 'loading' : 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!url) {
      return;
    }

    const controller = new AbortController();
    const apiKey = import.meta.env.VITE_API_KEY;

    async function fetchData() {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: apiKey ? { 'X-Auth-Token': apiKey } : {},
        });

        if (!response.ok) {
          throw new Error(`Erreur réseau (${response.status}) : ${response.statusText}`);
        }

        const data: T = await response.json();
        setState({ status: 'success', data, error: null });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setState({ status: 'error', data: null, error: err.message });
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  if (!url) {
    return { status: 'idle', data: null, error: null };
  }

  return state;
}