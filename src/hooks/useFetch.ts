import { useState, useEffect } from "react";

// Cache mémoire partagé typé avec unknown pour satisfaire ESLint
const cacheMemoire = new Map<string, unknown>();

export function useFetch<T>(endpoint: string) {
  // 1. Initialisation directe depuis le cache (sans setState dans l'effet)
  const [donnees, setDonnees] = useState<T | null>(() => {
    return endpoint && cacheMemoire.has(endpoint)
      ? (cacheMemoire.get(endpoint) as T)
      : null;
  });

  const [chargement, setChargement] = useState<boolean>(
    Boolean(endpoint && !cacheMemoire.has(endpoint))
  );
  const [erreur, setErreur] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL || "/api/";

  useEffect(() => {
    // Si aucun endpoint ou donnée déjà disponible en cache, on ne déclenche aucun effet
    if (!endpoint || cacheMemoire.has(endpoint)) {
      return;
    }

    let annule = false;

    async function charger() {
      setChargement(true);
      setErreur(null);

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
  }, [endpoint, baseUrl]);

  // Si l'endpoint est vide, on renvoie l'état vide par défaut
  if (!endpoint) {
    return { donnees: null, chargement: false, erreur: null };
  }

  return { donnees, chargement, erreur };
}