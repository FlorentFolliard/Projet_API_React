import type { GlobalPlayer, TeamDetailResponse } from "../types";
import joueursInitiaux from "../data/joueurs.json";

const STORAGE_KEY = "football_explorer_merged_players";

/**
 * Charge les données initiales : fusionne le JSON de base avec
 * les ajouts déjà sauvegardés dans le navigateur.
 */
export function chargerJoueursLocaux(): GlobalPlayer[] {
  const base = joueursInitiaux as GlobalPlayer[];
  const sauvegarde = localStorage.getItem(STORAGE_KEY);

  if (!sauvegarde) {
    return base;
  }

  try {
    const ajouts: GlobalPlayer[] = JSON.parse(sauvegarde);
    // Fusion par ID unique pour éviter tout doublon
    const map = new Map<number, GlobalPlayer>();
    base.forEach((p) => map.set(p.id, p));
    ajouts.forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  } catch {
    return base;
  }
}

/**
 * Compare l'effectif de l'API avec nos données locales et
 * ajoute uniquement les joueurs qui manquaient.
 */
export function synchroniserClub(
  teamData: TeamDetailResponse,
  joueursActuels: GlobalPlayer[]
): { nouveauxJoueurs: GlobalPlayer[]; listeMiseAJour: GlobalPlayer[] } {
  if (!teamData.squad) {
    return { nouveauxJoueurs: [], listeMiseAJour: joueursActuels };
  }

  const map = new Map<number, GlobalPlayer>();
  joueursActuels.forEach((p) => map.set(p.id, p));

  const ajouts: GlobalPlayer[] = [];

  teamData.squad.forEach((squadP) => {
    if (!map.has(squadP.id)) {
      const nouveau: GlobalPlayer = {
        id: squadP.id,
        name: squadP.name,
        position: squadP.position || "Non spécifié",
        nationality: squadP.nationality,
        dateOfBirth: squadP.dateOfBirth || "N/A",
        shirtNumber: squadP.shirtNumber ?? null,
        teamId: teamData.id,
        teamName: teamData.name,
        teamCrest: teamData.crest,
      };
      map.set(nouveau.id, nouveau);
      ajouts.push(nouveau);
    }
  });

  const listeComplete = Array.from(map.values());

  if (ajouts.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listeComplete));
  }

  return { nouveauxJoueurs: ajouts, listeMiseAJour: listeComplete };
}

/**
 * Permet de télécharger le JSON complet prêt à remplacer src/data/joueurs.json
 */
export function exporterJSON(donnees: GlobalPlayer[]) {
  const blob = new Blob([JSON.stringify(donnees, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "joueurs.json";
  a.click();
  URL.revokeObjectURL(url);
}