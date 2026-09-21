import { useState } from "react";
import { useFetch } from "./hooks/useFetch";
import type { TeamResponse, PlayerDetail } from "./types";
import "./App.css";

// 86 = Real Madrid (modifiable par 524 pour le PSG, 64 pour Liverpool, etc.)
const TEAM_ID = 86;

export function App() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  // 1. Récupération de l'effectif complet du club
  const {
    donnees: teamData,
    chargement: chargementEquipe,
    erreur: erreurEquipe,
  } = useFetch<TeamResponse>(`teams/${TEAM_ID}`);

  // 2. Récupération des détails du joueur sélectionné
  const {
    donnees: playerDetail,
    chargement: chargementJoueur,
    erreur: erreurJoueur,
  } = useFetch<PlayerDetail>(
    selectedPlayerId ? `persons/${selectedPlayerId}` : ""
  );

  return (
    <div className="container">
      {/* En-tête du club */}
      <header className="header">
        {teamData?.crest && (
          <img
            src={teamData.crest}
            alt={teamData.name}
            className="team-crest"
          />
        )}
        <div>
          <h1>{teamData?.name || "Effectif de football"}</h1>
          <p>Sélectionnez un joueur pour afficher sa fiche complète</p>
        </div>
      </header>

      {chargementEquipe && <p className="status">⏳ Chargement de l'effectif...</p>}
      {erreurEquipe && <div className="status error">❌ {erreurEquipe}</div>}

      <div className="layout-content">
        {/* GRILLE DES JOUEURS */}
        <section className="grid-section">
          <h2>Joueurs ({teamData?.squad?.length || 0})</h2>

          <div className="grid">
            {teamData?.squad?.map((player) => {
              const isSelected = player.id === selectedPlayerId;
              return (
                <div
                  key={player.id}
                  className={`card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedPlayerId(player.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-body">
                    <h3>{player.name}</h3>
                    <p className="player-role">
                      {player.position || "Non défini"}
                    </p>
                    <span className="tag-nationality">
                      🌍 {player.nationality}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PANNEAU DE DÉTAIL DU JOUEUR */}
        <aside className="detail-panel">
          <h2>Fiche Joueur</h2>

          {!selectedPlayerId && (
            <div className="placeholder-box">
              👈 Cliquez sur un joueur dans la grille pour voir ses détails.
            </div>
          )}

          {chargementJoueur && <p>⏳ Chargement du profil...</p>}
          {erreurJoueur && <div className="status error">❌ {erreurJoueur}</div>}

          {!chargementJoueur && playerDetail && (
            <div className="player-card-detail">
              <div className="detail-header">
                {playerDetail.currentTeam?.crest && (
                  <img
                    src={playerDetail.currentTeam.crest}
                    alt={playerDetail.currentTeam.name}
                    className="detail-crest"
                  />
                )}
                <div>
                  <h3>
                    {playerDetail.name}{" "}
                    {playerDetail.shirtNumber
                      ? `#${playerDetail.shirtNumber}`
                      : ""}
                  </h3>
                  <p className="detail-club">
                    Club : {playerDetail.currentTeam?.name || "N/A"}
                  </p>
                </div>
              </div>

              <hr />

              <div className="detail-info">
                <p>
                  <strong>Poste :</strong> {playerDetail.position || "Inconnu"}
                </p>
                <p>
                  <strong>Nationalité :</strong> {playerDetail.nationality}
                </p>
                <p>
                  <strong>Date de naissance :</strong>{" "}
                  {playerDetail.dateOfBirth}
                </p>
                {playerDetail.section && (
                  <p>
                    <strong>Section :</strong> {playerDetail.section}
                  </p>
                )}
                {playerDetail.currentTeam?.venue && (
                  <p>
                    <strong>Stade habituel :</strong>{" "}
                    {playerDetail.currentTeam.venue}
                  </p>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;