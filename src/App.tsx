import { useState } from "react";
import { useFetch } from "./hooks/useFetch";
import { CLUBS_POPULAIRES } from "./clubs";
import type { TeamDetailResponse, SquadPlayer } from "./types";
import "./App.css";

export function App() {
  // Navigation interne sans rechargement de page
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<SquadPlayer | null>(null);

  // Un seul appel par club sélectionné (et mis en cache mémoire grâce au hook useFetch)
  const {
    donnees: teamData,
    chargement,
    erreur,
  } = useFetch<TeamDetailResponse>(selectedTeamId ? `teams/${selectedTeamId}` : "");

  function handleSelectClub(id: number) {
    setSelectedTeamId(id);
    setSelectedPlayer(null);
  }

  function handleBackToClubs() {
    setSelectedTeamId(null);
    setSelectedPlayer(null);
  }

  return (
    <div className="container">
      {/* VUE 1 : GRILLE D'ACCUEIL DES CLUBS */}
      {!selectedTeamId ? (
        <main>
          <header className="main-header">
            <h1>Football Explorer</h1>
            <p>Sélectionnez un club pour découvrir ses joueurs et son effectif</p>
          </header>

          <div className="grid">
            {CLUBS_POPULAIRES.map((club) => (
              <div
                key={club.id}
                className="card club-card"
                onClick={() => handleSelectClub(club.id)}
                role="button"
                tabIndex={0}
              >
                <img src={club.crest} alt={club.name} className="club-logo" />
                <div className="card-body">
                  <h3>{club.name}</h3>
                  <span className="tag-nationality">🌍 {club.country}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        /* VUE 2 : EFFECTIF ET JOUEURS DU CLUB */
        <main>
          <button type="button" className="btn-back" onClick={handleBackToClubs}>
            ← Retour à la sélection des clubs
          </button>

          {chargement && <p className="status">⏳ Chargement de l'effectif...</p>}
          {erreur && <div className="status error">❌ {erreur}</div>}

          {!chargement && teamData && (
            <>
              <header className="header">
                <img src={teamData.crest} alt={teamData.name} className="team-crest" />
                <div>
                  <h1>{teamData.name}</h1>
                  <p>
                    {teamData.venue ? `🏟️ Stade : ${teamData.venue} • ` : ""}
                    Fondé en {teamData.founded || "N/C"}
                  </p>
                </div>
              </header>

              <div className="layout-content">
                {/* Grille des joueurs du club */}
                <section className="grid-section">
                  <h2>Effectif ({teamData.squad?.length || 0} joueurs)</h2>
                  <div className="grid">
                    {teamData.squad?.map((player) => {
                      const isSelected = selectedPlayer?.id === player.id;
                      return (
                        <div
                          key={player.id}
                          className={`card ${isSelected ? "selected" : ""}`}
                          onClick={() => setSelectedPlayer(player)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="card-body">
                            <h3>{player.name}</h3>
                            <p className="player-role">{player.position || "Staff / N/A"}</p>
                            <span className="tag-nationality">🌍 {player.nationality}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Panneau latéral de détails du joueur (instantané et gratuit en requêtes) */}
                <aside className="detail-panel">
                  <h2>Fiche Joueur</h2>

                  {!selectedPlayer ? (
                    <div className="placeholder-box">
                      👈 Cliquez sur un joueur de la grille pour afficher son profil détaillé.
                    </div>
                  ) : (
                    <div className="player-card-detail">
                      <div className="detail-header">
                        <img src={teamData.crest} alt={teamData.name} className="detail-crest" />
                        <div>
                          <h3>
                            {selectedPlayer.name}{" "}
                            {selectedPlayer.shirtNumber ? `#${selectedPlayer.shirtNumber}` : ""}
                          </h3>
                          <p className="detail-club">{teamData.name}</p>
                        </div>
                      </div>

                      <hr />

                      <div className="detail-info">
                        <p><strong>Poste :</strong> {selectedPlayer.position || "Non spécifié"}</p>
                        <p><strong>Nationalité :</strong> {selectedPlayer.nationality}</p>
                        <p><strong>Date de naissance :</strong> {selectedPlayer.dateOfBirth || "N/A"}</p>
                        <p><strong>Identifiant officiel :</strong> #{selectedPlayer.id}</p>
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
}

export default App;