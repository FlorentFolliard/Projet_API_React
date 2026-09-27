import type { Match } from '../types';

export const MATCHS_SECOURS: Record<number, Match[]> = {
  86: [ // Real Madrid
    { id: 101, utcDate: '2026-03-10', competitionName: 'La Liga', homeTeam: { id: 86, name: 'Real Madrid' }, awayTeam: { id: 81, name: 'FC Barcelone' }, score: { winner: 'HOME_TEAM', fullTime: { home: 3, away: 1 } } },
    { id: 102, utcDate: '2026-03-03', competitionName: 'Ligue des Champions', homeTeam: { id: 65, name: 'Man City' }, awayTeam: { id: 86, name: 'Real Madrid' }, score: { winner: 'DRAW', fullTime: { home: 1, away: 1 } } },
    { id: 103, utcDate: '2026-02-24', competitionName: 'La Liga', homeTeam: { id: 86, name: 'Real Madrid' }, awayTeam: { id: 516, name: 'OM' }, score: { winner: 'HOME_TEAM', fullTime: { home: 2, away: 0 } } },
  ],
  81: [ // Barça
    { id: 201, utcDate: '2026-03-10', competitionName: 'La Liga', homeTeam: { id: 86, name: 'Real Madrid' }, awayTeam: { id: 81, name: 'FC Barcelone' }, score: { winner: 'HOME_TEAM', fullTime: { home: 3, away: 1 } } },
    { id: 202, utcDate: '2026-03-02', competitionName: 'La Liga', homeTeam: { id: 81, name: 'FC Barcelone' }, awayTeam: { id: 524, name: 'PSG' }, score: { winner: 'HOME_TEAM', fullTime: { home: 4, away: 2 } } },
  ],
  524: [ // PSG
    { id: 301, utcDate: '2026-03-12', competitionName: 'Ligue 1', homeTeam: { id: 524, name: 'PSG' }, awayTeam: { id: 516, name: 'OM' }, score: { winner: 'HOME_TEAM', fullTime: { home: 3, away: 0 } } },
    { id: 302, utcDate: '2026-03-02', competitionName: 'Ligue des Champions', homeTeam: { id: 81, name: 'FC Barcelone' }, awayTeam: { id: 524, name: 'PSG' }, score: { winner: 'HOME_TEAM', fullTime: { home: 4, away: 2 } } },
  ],
};