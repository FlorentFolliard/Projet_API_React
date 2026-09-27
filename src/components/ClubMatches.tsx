import React, { useMemo } from 'react';
import type { Match, MatchResult } from '../types';
import { useFetch } from '../hooks/useFetch';
import { MATCHS_SECOURS } from '../data/matchsSecours';

type ClubMatchesProps = {
  clubId: number;
};

type ApiMatchResponse = {
  matches: Array<{
    id: number;
    utcDate: string;
    competition: { name: string };
    homeTeam: { id: number; name: string };
    awayTeam: { id: number; name: string };
    score: {
      winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
      fullTime: { home: number | null; away: number | null };
    };
  }>;
};

export const ClubMatches: React.FC<ClubMatchesProps> = ({ clubId }) => {
  const { status, data, error } = useFetch<ApiMatchResponse>(
    `/api/teams/${clubId}/matches?status=FINISHED&limit=5`
  );

  const matchs = useMemo<Match[]>(() => {
    if (data?.matches && data.matches.length > 0) {
      return data.matches.map((m) => ({
        id: m.id,
        utcDate: m.utcDate.slice(0, 10),
        competitionName: m.competition.name,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        score: m.score,
      }));
    }
    // Données de repli en mode hors-ligne ou erreur d'API
    return MATCHS_SECOURS[clubId] || [
      {
        id: 999,
        utcDate: '2026-03-01',
        competitionName: 'Match amical',
        homeTeam: { id: clubId, name: 'Club actif' },
        awayTeam: { id: 0, name: 'Adversaire' },
        score: { winner: 'HOME_TEAM', fullTime: { home: 2, away: 1 } },
      },
    ];
  }, [data, clubId]);

  function getBadgeResult(match: Match): { label: string; type: MatchResult } {
    const isHome = match.homeTeam.id === clubId;
    if (match.score.winner === 'DRAW') return { label: 'N', type: 'DRAW' };
    const win = (isHome && match.score.winner === 'HOME_TEAM') || (!isHome && match.score.winner === 'AWAY_TEAM');
    return win ? { label: 'V', type: 'WIN' } : { label: 'D', type: 'LOSS' };
  }

  return (
    <section className="matches-section">
      <div className="matches-header">
        <h2>Derniers résultats & Historique</h2>
        {status === 'loading' && <span className="api-badge loading">Chargement des matchs...</span>}
        {status === 'error' && <span className="api-badge error">⚠️ Hors-ligne : {error}</span>}
        {status === 'success' && <span className="api-badge success">En direct de l'API</span>}
      </div>

      <div className="matches-list">
        {matchs.map((match) => {
          const badge = getBadgeResult(match);
          return (
            <div key={match.id} className="match-row">
              <span className={`match-badge ${badge.type}`}>{badge.label}</span>
              <div className="match-info">
                <span className="match-date">{match.utcDate} • {match.competitionName}</span>
                <div className="match-teams">
                  <span className={match.homeTeam.id === clubId ? 'highlight' : ''}>{match.homeTeam.name}</span>
                  <span className="match-score">
                    {match.score.fullTime.home ?? 0} - {match.score.fullTime.away ?? 0}
                  </span>
                  <span className={match.awayTeam.id === clubId ? 'highlight' : ''}>{match.awayTeam.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};