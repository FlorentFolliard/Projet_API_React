import { useState, useEffect } from "react";

// Cache mémoire partagé typé avec unknown pour satisfaire ESLint
const cacheMemoire = new Map<string, unknown>();

export function useFetch<T>(endpoint: string) {
  const [etat, setEtat] = useState<{
    endpoint: string;
    donnees: T | null;
    chargement: boolean;
    erreur: string | null;
  }>(() => {
    const donneesInitiales = endpoint
      ? (cacheMemoire.get(endpoint) as T | undefined)
      : undefined;

    return {
      endpoint,
      donnees: donneesInitiales ?? null,
      chargement: Boolean(endpoint && !donneesInitiales),
      erreur: null,
    };
  });

  const baseUrl = import.meta.env.VITE_API_URL || "/api/";

  useEffect(() => {
    if (!endpoint) {
      return;
    }

    const donneesEnCache = cacheMemoire.get(endpoint) as T | undefined;
    if (donneesEnCache) {
      return;
    }

    let annule = false;

    async function charger() {
      try {
        const url = `${baseUrl}${endpoint}`;
        const reponse = await fetch(url);

        if (reponse.status === 429) {
          throw new Error("Limite de requêtes atteinte (10/min). Réessayez dans 1 minute.");
        }

        if (!reponse.ok) {
          throw new Error(`Erreur API (${reponse.status}) : ${reponse.statusText}`);
        }

        const resultat: T = await reponse.json();

        // Sauvegarde dans le cache
        cacheMemoire.set(endpoint, resultat);

        if (!annule) {
          setEtat({ endpoint, donnees: resultat, chargement: false, erreur: null });
        }
      } catch (err) {
        if (!annule) {
          setEtat({
            endpoint,
            donnees: null,
            chargement: false,
            erreur: err instanceof Error ? err.message : "Erreur inconnue",
          });
        }
      }
    }

    charger();

    return () => {
      annule = true;
    };
  }, [endpoint, baseUrl]);

  const donneesEnCache = endpoint ? (cacheMemoire.get(endpoint) as T | undefined) : undefined;
  const endpointEstActuel = etat.endpoint === endpoint;

  return {
    donnees: donneesEnCache ?? (endpointEstActuel ? etat.donnees : null),
    chargement: Boolean(endpoint) && !donneesEnCache && (!endpointEstActuel || etat.chargement),
    erreur: endpointEstActuel ? etat.erreur : null,
  };
}