import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { normaliserEtFiltrer } from '../utils';
import { Card } from '../components/Card';
import { Grid } from '../components/Grid';
import { SearchBar } from '../components/SearchBar';
import { PlayerModal } from '../components/PlayerModel';
import type { Player } from '../types';

export const HomePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const clubsFiltres = normaliserEtFiltrer(state.clubs, state.recherche, (c) => `${c.name} ${c.country}`);
  const playersFiltres = normaliserEtFiltrer(state.players, state.recherche, (p) => `${p.name} ${p.nationality} ${p.position}`);

  return (
    <div>
      <section className="hero-section">
        <h1>Explorateur de Football Européen</h1>
        <p>Sélectionnez un club pour afficher son effectif ou effectuez une recherche globale.</p>
        <SearchBar
          value={state.recherche}
          onChange={(val) => dispatch({ type: 'SET_RECHERCHE', payload: val })}
          placeholder="Rechercher un club, un joueur, un pays..."
        />
      </section>

      {state.recherche && playersFiltres.length > 0 && (
        <section className="search-results-section">
          <h2>Joueurs trouvés ({playersFiltres.length})</h2>
          <Grid>
            {playersFiltres.slice(0, 12).map((player) => (
              <Card key={`${player.teamId}-${player.id}`} onClick={() => setSelectedPlayer(player)}>
                <img src={player.teamCrest} alt="" className="crest-small" />
                <h4>{player.name}</h4>
                <p className="sub-text">{player.position} • {player.teamName}</p>
                <span className="badge">🌍 {player.nationality}</span>
              </Card>
            ))}
          </Grid>
        </section>
      )}

      <section className="clubs-section">
        <h2>Clubs disponibles ({clubsFiltres.length})</h2>
        <Grid>
          {clubsFiltres.map((club) => (
            <Card key={club.id} onClick={() => navigate(`/club/${club.id}`)}>
              <img src={club.crest} alt={club.name} className="crest-medium" />
              <h3>{club.name}</h3>
              <p className="sub-text">🌍 {club.country}</p>
              <button className="btn-details">Voir l'effectif →</button>
            </Card>
          ))}
        </Grid>
      </section>

      <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  );
};