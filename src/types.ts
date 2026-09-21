// Joueur tel qu'il apparaît dans l'effectif d'une équipe
export type SquadPlayer = {
  id: number;
  name: string;
  position: string | null;
  nationality: string;
  dateOfBirth?: string;
};

// Réponse renvoyée par /teams/{id}
export type TeamResponse = {
  id: number;
  name: string;
  shortName: string;
  crest: string;
  squad: SquadPlayer[];
};

// Détail complet renvoyé par /persons/{id}
export type PlayerDetail = {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth: string;
  nationality: string;
  section?: string;
  position: string;
  shirtNumber: number | null;
  currentTeam: {
    id: number;
    name: string;
    crest: string;
    venue?: string;
    website?: string;
  } | null;
};