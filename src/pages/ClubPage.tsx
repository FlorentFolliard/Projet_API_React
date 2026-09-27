import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useFetch } from '../hooks/useFetch';
import { Card } from '../components/Card';
import { Grid } from '../components/Grid';
import { TeamStats } from '../components/TeamStats';
import { ClubMatches } from '../components/ClubMatches';
import { PlayerModal } from '../components/PlayerModel';
import type { Player } from '../types';

export const ClubPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const club = state.clubs.find((c) => c.id === Number(clubId));

  // Appel API conforme traitant loading, error, success avec signal d'abandon[cite: 6]
  const apiState = useFetch<{ name: string; venue?: string }>(
    club ? `/api/teams/${club.id}` : ''
  );

  if (!club) {
    return (
      <div className="not-found-box">
        <h2>Club introuvable</h2>
        <button onClick={() => navigate('/')}>← Revenir à l'accueil</button>
      </div>
    );
  }

  const squad = state.players.filter((p) => p.teamId === club.id);

  return (
    <div>
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Retour aux clubs
      </button>

      <header className="club-header">
        <img src={club.crest} alt={club.name} className="club-logo-large" />
        <div>
          <h1>{club.name}</h1>
          <p>
            {club.venue ? `🏟️ ${club.venue} • ` : ''}
            {club.founded ? `Fondé en ${club.founded} • ` : ''}
            🌍 {club.country}
          </p>
          {apiState.status === 'loading' && (
            <span className="api-badge loading">🔄 Synchro API en cours...</span>
          )}
          {apiState.status === 'error' && (
            <span className="api-badge error">⚠️ API hors-ligne (mode local actif)</span>
          )}
          {apiState.status === 'success' && (
            <span className="api-badge success">✅ API synchronisée</span>
          )}
        </div>
      </header>

      {/* Statistiques par poste */}
      <TeamStats players={squad} />

      {/* Historique et derniers résultats des matchs */}
      <ClubMatches clubId={club.id} />

      {/* Effectif complet du club */}
      <section>
        <h2>Effectif ({squad.length} joueurs)</h2>
        <Grid>
          {squad.map((player) => (
            <Card key={player.id} onClick={() => setSelectedPlayer(player)}>
              <h4>
                {player.name} {player.shirtNumber ? `#${player.shirtNumber}` : ''}
              </h4>
              <p className="sub-text">{player.position}</p>
              <span className="badge">🌍 {player.nationality}</span>
            </Card>
          ))}
        </Grid>
      </section>

      {/* Modale d'informations détaillées au clic sur un joueur */}
      <PlayerModal
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </div>
  );
};