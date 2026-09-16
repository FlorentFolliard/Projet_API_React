import { useState, useEffect } from "react";

export function useFetch<T>(endpoint: string) {
  const [donnees, setDonnees] = useState<T | null>(null);
  const [chargement, setChargement] = useState<boolean>(Boolean(endpoint));
  const [erreur, setErreur] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL || "/api/";
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!endpoint) return;

    let annule = false;

    async function charger() {
      setChargement(true);
      setErreur(null);

      try {
        const url = `${baseUrl}${endpoint}`;
        const reponse = await fetch(url, {
          headers: apiKey ? { "X-Auth-Token": apiKey } : {},
        });

        if (!reponse.ok) {
          throw new Error(`Erreur API (${reponse.status}) : ${reponse.statusText}`);
        }

        const resultat: T = await reponse.json();
        if (!annule) {
          setDonnees(resultat);
        }
      } catch (err) {
        if (!annule) {
          setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        }
      } finally {
        if (!annule) {
          setChargement(false);
        }
      }
    }

    charger();

    return () => {
      annule = true;
    };
  }, [endpoint, baseUrl, apiKey]);

  return { donnees, chargement, erreur };
}