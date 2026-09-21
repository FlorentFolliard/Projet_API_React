import { CLUBS_POPULAIRES } from "../clubs";
import type { GlobalPlayer, TeamDetailResponse } from "../types";

const CACHE_KEY = "football_explorer_all_players_v1";

function attendre(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function chargerTousLesJoueurs(
  onProgression: (termine: number, total: number, message: string) => void
): Promise<GlobalPlayer[]> {
  let joueursExistants: GlobalPlayer[] = [];

  const sauvegarde = localStorage.getItem(CACHE_KEY);
  if (sauvegarde) {
    try {
      joueursExistants = JSON.parse(sauvegarde) as GlobalPlayer[];
    } catch {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  // Filtrer les clubs qui ne sont pas encore chargés
  const clubsAChoisir = CLUBS_POPULAIRES.filter(
    (club) => !joueursExistants.some((j) => j.teamId === club.id)
  );

  if (clubsAChoisir.length === 0) {
    return joueursExistants;
  }

  const total = clubsAChoisir.length;
  const joueursNouveaux: GlobalPlayer[] = [];

  for (let i = 0; i < total; i++) {
    const club = clubsAChoisir[i];
    onProgression(i + 1, total, `Téléchargement de ${club.name}...`);

    try {
      const res = await fetch(`/api/teams/${club.id}`);

      if (res.status === 429) {
        onProgression(i + 1, total, `Limite atteinte, pause de 60s pour ${club.name}...`);
        await attendre(61000);
        const retryRes = await fetch(`/api/teams/${club.id}`);
        if (!retryRes.ok) throw new Error(`Échec retry ${club.name}`);
        const retryData: TeamDetailResponse = await retryRes.json();
        if (retryData.squad) {
          retryData.squad.forEach((player) => {
            joueursNouveaux.push({
              ...player,
              teamId: club.id,
              teamName: club.name,
              teamCrest: club.crest,
            });
          });
        }
      } else if (res.ok) {
        const data: TeamDetailResponse = await res.json();
        if (data.squad) {
          data.squad.forEach((player) => {
            joueursNouveaux.push({
              ...player,
              teamId: club.id,
              teamName: club.name,
              teamCrest: club.crest,
            });
          });
        }
      }
    } catch (e) {
      console.warn(`Erreur sur le club ${club.name} :`, e);
    }

    // Pause de 6,5 secondes entre chaque club pour respecter le quota des 10 requêtes/minute
    if (i < total - 1) {
      await attendre(6500);
    }
  }

  const listeComplete = [...joueursExistants, ...joueursNouveaux];
  if (listeComplete.length > 0) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(listeComplete));
  }

  return listeComplete;
}