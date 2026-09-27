export type Position = 'Gardien' | 'Défenseur' | 'Milieu' | 'Attaquant';

export type ClubItem = {
  id: number;
  name: string;
  shortName: string;
  crest: string;
  country: string;
  venue?: string;
  founded?: number;
};

export type Player = {
  id: number;
  name: string;
  position: Position;
  nationality: string;
  dateOfBirth: string;
  shirtNumber: number | null;
  teamId: number;
  teamName: string;
  teamCrest: string;
};

export type AsyncState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: string };

export type PlayerFormData = {
  name: string;
  position: Position;
  nationality: string;
  dateOfBirth: string;
  shirtNumber: string;
  teamId: number;
};

export type MatchResult = 'WIN' | 'DRAW' | 'LOSS';

export type Match = {
  id: number;
  utcDate: string;
  competitionName: string;
  homeTeam: { id: number; name: string; crest?: string };
  awayTeam: { id: number; name: string; crest?: string };
  score: {
    winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
    fullTime: { home: number | null; away: number | null };
  };
};