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

export type GlobalPlayer = SquadPlayer & {
  teamId: number;
  teamName: string;
  teamCrest: string;
};