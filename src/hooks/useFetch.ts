import { useState, useEffect } from "react";

export function useFetch<T>(endpoint: string) {
  const [donnees, setDonnees] = useState<T | null>(null);
  const [chargement, setChargement] = useState<boolean>(Boolean(endpoint));
  const [erreur, setErreur] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL || "/api/";
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    // Si aucun endpoint n'est fourni, on ne lance rien
    if (!endpoint) {
      return;
    }

    let annule = false;

    async function charger() {
      setChargement(true);
      setErreur(null);

      try {
        const url = `${baseUrl}${endpoint}`;
        const headers: Record<string, string> = {};
        if (apiKey) {
          headers["X-Auth-Token"] = apiKey;
        }

        const reponse = await fetch(url, { headers });

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

  // Si aucun endpoint n'est demandé, on expose un état vide sans forcer de setState
  if (!endpoint) {
    return { donnees: null, chargement: false, erreur: null };
  }

  return { donnees, chargement, erreur };
}