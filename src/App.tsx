import { useState, useMemo, useEffect } from "react";
import { useFetch } from "./hooks/useFetch";
import { CLUBS_POPULAIRES } from "./clubs";
import { normaliserTexte } from "./utils";
import {
  chargerJoueursLocaux,
  synchroniserClub,
  exporterJSON,
} from "./services/playerSync";
import type { SquadPlayer, GlobalPlayer, TeamDetailResponse } from "./types";
import "./App.css";

export function App() {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<(SquadPlayer | GlobalPlayer) | null>(null);
  const [recherche, setRecherche] = useState("");

  // 1. Initialisation instantanée depuis le JSON + localStorage
  const [tousLesJoueurs, setTousLesJoueurs] = useState<GlobalPlayer[]>(() =>
    chargerJoueursLocaux()
  );
  const [notification, setNotification] = useState<string | null>(null);

  // 2. Appel ciblé de l'API pour le club ouvert uniquement (1 seule requête)
  const { donnees: teamData, chargement } = useFetch<TeamDetailResponse>(
    selectedTeamId ? `teams/${selectedTeamId}` : ""
  );

  // 3. Dès que l'API renvoie les données du club, on détecte les joueurs manquants
  useEffect(() => {
    if (teamData) {
      const { nouveauxJoueurs, listeMiseAJour } = synchroniserClub(
        teamData,
        tousLesJoueurs
      );
      if (nouveauxJoueurs.length > 0) {
        setTousLesJoueurs(listeMiseAJour);
        setNotification(
          `✨ ${nouveauxJoueurs.length} nouveau(x) joueur(s) synchronisé(s) pour ${teamData.shortName || teamData.name} !`
        );
        setTimeout(() => setNotification(null), 4000);
      }
    }
  }, [teamData]);

  // 4. Filtrages sans accent
  const clubsFiltres = useMemo(() => {
    const q = normaliserTexte(recherche);
    if (!q) return CLUBS_POPULAIRES;
    return CLUBS_POPULAIRES.filter(
      (c) =>
        normaliserTexte(c.name).includes(q) ||
        normaliserTexte(c.shortName).includes(q) ||
        normaliserTexte(c.country).includes(q)
    );
  }, [recherche]);

  const joueursGlobauxFiltres = useMemo(() => {
    const q = normaliserTexte(recherche);
    if (!q) return [];
    return tousLesJoueurs.filter(
      (p) =>
        normaliserTexte(p.name).includes(q) ||
        normaliserTexte(p.nationality).includes(q) ||
        (p.position && normaliserTexte(p.position).includes(q))
    );
  }, [tousLesJoueurs, recherche]);

  const clubActif = CLUBS_POPULAIRES.find((c) => c.id === selectedTeamId);
  const joueursDuClubActif = useMemo(() => {
    if (!selectedTeamId) return [];
    return tousLesJoueurs.filter((p) => p.teamId === selectedTeamId);
  }, [tousLesJoueurs, selectedTeamId]);

  const squadClubFiltre = useMemo(() => {
    const q = normaliserTexte(recherche);
    if (!q) return joueursDuClubActif;
    return joueursDuClubActif.filter(
      (p) =>
        normaliserTexte(p.name).includes(q) ||
        (p.position && normaliserTexte(p.position).includes(q)) ||
        normaliserTexte(p.nationality).includes(q)
    );
  }, [joueursDuClubActif, recherche]);

  function handleSelectClub(id: number) {
    setSelectedTeamId(id);
    setSelectedPlayer(null);
    setRecherche("");
  }

  function handleBack() {
    setSelectedTeamId(null);
    setSelectedPlayer(null);
    setRecherche("");
  }

  return (
    <div className="container">
      {/* Barre de notification de synchro */}
      {notification && (
        <div style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          background: "#0284c7",
          color: "#fff",
          padding: "0.8rem 1.2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 1000
        }}>
          {notification}
        </div>
      )}

      {/* VUE 1 : ACCUEIL */}
      {!selectedTeamId ? (
        <main>
          <header className="main-header">
            <h1>Football Explorer</h1>
            <p>
              {tousLesJoueurs.length} joueurs indexés (données locales synchronisées avec l'API)
            </p>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Rechercher un joueur, un club ou une nationalité..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
              {recherche && <button type="button" onClick={() => setRecherche("")}>✕</button>}
            </div>

            {/* Bouton pour récupérer le fichier mis à jour */}
            <button
              type="button"
              className="btn-back"
              style={{ marginTop: "1rem", fontSize: "0.85rem" }}
              onClick={() => exporterJSON(tousLesJoueurs)}
            >
              📥 Exporter le joueurs.json complet mis à jour
            </button>
          </header>

          {/* Fiche joueur depuis la recherche */}
          {selectedPlayer && "teamName" in selectedPlayer && (
            <div className="card" style={{ maxWidth: "500px", margin: "0 auto 2rem auto", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <h2 style={{ margin: 0 }}>Fiche Joueur</h2>
                <button type="button" onClick={() => setSelectedPlayer(null)}>Fermer ✕</button>
              </div>
              <hr style={{ width: "100%", borderColor: "#334155", margin: "1rem 0" }} />
              <img src={(selectedPlayer as GlobalPlayer).teamCrest} alt="" style={{ width: "50px", height: "50px" }} />
              <h3>
                {selectedPlayer.name}{" "}
                {(selectedPlayer as GlobalPlayer).shirtNumber ? `#${(selectedPlayer as GlobalPlayer).shirtNumber}` : ""}
              </h3>
              <p style={{ color: "#38bdf8", margin: "0.2rem 0" }}>Club : {(selectedPlayer as GlobalPlayer).teamName}</p>
              <p style={{ margin: "0.2rem 0" }}><strong>Poste :</strong> {selectedPlayer.position || "Non spécifié"}</p>
              <p style={{ margin: "0.2rem 0" }}><strong>Nationalité :</strong> {selectedPlayer.nationality}</p>
              <p style={{ margin: "0.2rem 0" }}><strong>Date de naissance :</strong> {selectedPlayer.dateOfBirth || "N/A"}</p>
            </div>
          )}

          {/* Joueurs trouvés */}
          {joueursGlobauxFiltres.length > 0 && (
            <section style={{ marginBottom: "2.5rem" }}>
              <h2>Joueurs trouvés ({joueursGlobauxFiltres.length})</h2>
              <div className="grid-cards">
                {joueursGlobauxFiltres.map((player) => (
                  <div
                    key={`${player.teamId}-${player.id}`}
                    className="card"
                    onClick={() => setSelectedPlayer(player)}
                    role="button"
                    tabIndex={0}
                  >
                    <img src={player.teamCrest} alt={player.teamName} className="club-logo" />
                    <div className="card-body">
                      <h3>{player.name}</h3>
                      <p className="player-role">{player.position || "Staff"} • {player.teamName}</p>
                      <span className="tag-badge">🌍 {player.nationality}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Clubs */}
          <section>
            <h2>Clubs ({clubsFiltres.length})</h2>
            <div className="grid-cards">
              {clubsFiltres.map((club) => (
                <div
                  key={club.id}
                  className="card"
                  onClick={() => handleSelectClub(club.id)}
                  role="button"
                  tabIndex={0}
                >
                  <img src={club.crest} alt={club.name} className="club-logo" />
                  <div className="card-body">
                    <h3>{club.name}</h3>
                    <span className="tag-badge">🌍 {club.country}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      ) : (
        /* VUE 2 : CLUB SÉLECTIONNÉ */
        <main>
          <button type="button" className="btn-back" onClick={handleBack}>
            ← Retour aux clubs
          </button>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Filtrer dans cet effectif..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
            {recherche && <button type="button" onClick={() => setRecherche("")}>✕</button>}
          </div>

          <div className="layout-content">
            <section className="grid-section">
              <h2>
                {clubActif?.name} ({squadClubFiltre.length} joueurs)
                {chargement && <span style={{ fontSize: "0.85rem", color: "#38bdf8", marginLeft: "1rem" }}>🔄 Synchronisation API...</span>}
              </h2>

              <div className="grid-cards">
                {squadClubFiltre.map((player) => {
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
                        <span className="tag-badge">🌍 {player.nationality}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="detail-panel">
              <h2>Fiche Joueur</h2>
              {!selectedPlayer ? (
                <div className="placeholder-box">
                  👈 Cliquez sur un joueur pour afficher son profil.
                </div>
              ) : (
                <div>
                  <h3>{selectedPlayer.name}</h3>
                  <p style={{ color: "#38bdf8" }}>Club : {clubActif?.name}</p>
                  <hr style={{ borderColor: "#334155", margin: "1rem 0" }} />
                  <p><strong>Poste :</strong> {selectedPlayer.position || "Non spécifié"}</p>
                  <p><strong>Nationalité :</strong> {selectedPlayer.nationality}</p>
                  <p><strong>Date de naissance :</strong> {selectedPlayer.dateOfBirth || "N/A"}</p>
                </div>
              )}
            </aside>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;