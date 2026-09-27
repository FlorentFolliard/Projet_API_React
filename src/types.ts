export type ClubItem = {
  id: number;
  name: string;
  shortName: string;
  crest: string;
  country: string;
};

export type SquadPlayer = {
  id: number;
  name: string;
  position: string | null;
  dateOfBirth?: string;
  nationality: string;
  shirtNumber?: number | null;
};

export type TeamDetailResponse = {
  id: number;
  name: string;
  shortName: string;
  crest: string;
  venue?: string;
  website?: string;
  founded?: number;
  squad: SquadPlayer[];
};

export type TeamMatch = {
  id: number;
  utcDate: string;
  status: string;
  competition: { name: string };
  homeTeam: { id: number; name: string; shortName?: string };
  awayTeam: { id: number; name: string; shortName?: string };
  score: { fullTime: { home: number | null; away: number | null } };
};

export type TeamMatchesResponse = {
  matches: TeamMatch[];
};

export type GlobalPlayer = SquadPlayer & {
  teamId: number;
  teamName: string;
  teamCrest: string;
};

export type Player = SquadPlayer & {
  currentTeam: {
    id: number;
    name: string;
    crest: string;
  };
};