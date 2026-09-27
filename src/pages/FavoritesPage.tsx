import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Grid } from '../components/Grid';

export const FavoritesPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const clubsFavoris = state.clubs.filter((club) =>
    state.clubFavorisIds.includes(club.id)
  );

  return (
    <div>
      <header className="hero-section">
        <h1>Mes Clubs Favoris</h1>
        <p>Retrouvez rapidement vos clubs enregistrés</p>
      </header>

      {clubsFavoris.length === 0 ? (
        <div className="not-found-box">
          <p>Vous n'avez aucun club en favori pour le moment.</p>
          <button onClick={() => navigate('/')}>← Découvrir les clubs</button>
        </div>
      ) : (
        <Grid>
          {clubsFavoris.map((club) => (
            <Card key={club.id}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-star active"
                  title="Retirer des favoris"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'TOGGLE_CLUB_FAVORI', payload: club.id });
                  }}
                >
                  ★
                </button>
              </div>
              <img src={club.crest} alt={club.name} className="crest-medium" />
              <h3>{club.name}</h3>
              <p className="sub-text">🌍 {club.country}</p>
              <button
                className="btn-details"
                onClick={() => navigate(`/club/${club.id}`)}
              >
                Voir l'effectif →
              </button>
            </Card>
          ))}
        </Grid>
      )}
    </div>
  );
};