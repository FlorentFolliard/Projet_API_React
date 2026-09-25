import { useEffect, useMemo, useState } from "react";
import { useFetch } from "./hooks/useFetch";
import { CLUBS_POPULAIRES } from "./clubs";
import { normaliserTexte } from "./utils";
import { chargerJoueursLocaux, synchroniserClub, exporterJSON } from "./services/playerSync";
import type { GlobalPlayer, SquadPlayer, TeamDetailResponse } from "./types";
import "./App.css";

function getPlayerInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function App() {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<SquadPlayer | GlobalPlayer | null>(null);
  const [recherche, setRecherche] = useState("");
  const [tousLesJoueurs, setTousLesJoueurs] = useState<GlobalPlayer[]>(() => chargerJoueursLocaux());
  const [notification, setNotification] = useState<string | null>(null);
  const { donnees: teamData, chargement } = useFetch<TeamDetailResponse>(selectedTeamId ? `teams/${selectedTeamId}` : "");

  useEffect(() => {
    if (!teamData || teamData.id !== selectedTeamId) return;
    const { nouveauxJoueurs, listeMiseAJour } = synchroniserClub(teamData, tousLesJoueurs);
    if (nouveauxJoueurs.length > 0) {
      const timer = window.setTimeout(() => {
        setTousLesJoueurs(listeMiseAJour);
        setNotification(`✨ ${nouveauxJoueurs.length} nouveau(x) joueur(s) synchronisé(s) pour ${teamData.shortName || teamData.name} !`);
      }, 0);
      const notificationTimer = window.setTimeout(() => setNotification(null), 4000);
      return () => {
        window.clearTimeout(timer);
        window.clearTimeout(notificationTimer);
      };
    }
  }, [teamData, selectedTeamId, tousLesJoueurs]);

  const clubsFiltres = useMemo(() => {
    const query = normaliserTexte(recherche);
    if (!query) return CLUBS_POPULAIRES;
    return CLUBS_POPULAIRES.filter((club) => normaliserTexte(club.name).includes(query) || normaliserTexte(club.shortName).includes(query) || normaliserTexte(club.country).includes(query));
  }, [recherche]);

  const joueursGlobauxFiltres = useMemo(() => {
    const query = normaliserTexte(recherche);
    if (!query) return [];
    return tousLesJoueurs.filter((player) => normaliserTexte(player.name).includes(query) || normaliserTexte(player.nationality).includes(query) || (player.position && normaliserTexte(player.position).includes(query)));
  }, [tousLesJoueurs, recherche]);

  const clubActif = CLUBS_POPULAIRES.find((club) => club.id === selectedTeamId);
  const joueursDuClubActif = useMemo(() => selectedTeamId ? tousLesJoueurs.filter((player) => player.teamId === selectedTeamId) : [], [tousLesJoueurs, selectedTeamId]);
  const squadClubFiltre = useMemo(() => {
    const query = normaliserTexte(recherche);
    if (!query) return joueursDuClubActif;
    return joueursDuClubActif.filter((player) => normaliserTexte(player.name).includes(query) || (player.position && normaliserTexte(player.position).includes(query)) || normaliserTexte(player.nationality).includes(query));
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

  const selectedGlobalPlayer = selectedPlayer && "teamName" in selectedPlayer ? selectedPlayer : null;

  return (
    <div className="container">
      {notification && <div className="notification">{notification}</div>}
      {!selectedTeamId ? (
        <main>
          <header className="main-header">
            <h1>Football Explorer</h1>
            <p>{tousLesJoueurs.length} joueurs indexés, synchronisés avec l'API</p>
            <div className="search-bar">
              <input type="text" placeholder="Rechercher un joueur, un club ou une nationalité..." value={recherche} onChange={(event) => setRecherche(event.target.value)} />
              {recherche && <button type="button" onClick={() => setRecherche("")}>✕</button>}
            </div>
            <button type="button" className="btn-back" onClick={() => exporterJSON(tousLesJoueurs)}>📥 Exporter les joueurs</button>
          </header>
          {joueursGlobauxFiltres.length > 0 && (
            <section className="search-results">
              <h2>Joueurs trouvés ({joueursGlobauxFiltres.length})</h2>
              <div className="grid-cards">
                {joueursGlobauxFiltres.map((player) => (
                  <article key={`${player.teamId}-${player.id}`} className="card" onClick={() => setSelectedPlayer(player)} role="button" tabIndex={0}>
                    <img src={player.teamCrest} alt={player.teamName} className="club-logo" />
                    <div className="card-body"><h3>{player.name}</h3><p className="player-role">{player.position || "Staff"} • {player.teamName}</p><span className="tag-badge">🌍 {player.nationality}</span></div>
                  </article>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2>Clubs ({clubsFiltres.length})</h2>
            <div className="grid-cards">
              {clubsFiltres.map((club) => (
                <article key={club.id} className="card" onClick={() => handleSelectClub(club.id)} role="button" tabIndex={0}>
                  <img src={club.crest} alt={club.name} className="club-logo" />
                  <div className="card-body"><h3>{club.name}</h3><span className="tag-badge">🌍 {club.country}</span></div>
                </article>
              ))}
            </div>
          </section>
        </main>
      ) : (
        <main>
          <button type="button" className="btn-back" onClick={handleBack}>← Retour aux clubs</button>
          <div className="search-bar">
            <input type="text" placeholder="Filtrer dans cet effectif..." value={recherche} onChange={(event) => setRecherche(event.target.value)} />
            {recherche && <button type="button" onClick={() => setRecherche("")}>✕</button>}
          </div>
          <div className="layout-content">
            <section className="grid-section">
              <h2>{clubActif?.name} ({squadClubFiltre.length} joueurs) {chargement && <span className="sync-label">🔄 Synchronisation API...</span>}</h2>
              <div className="grid-cards">
                {squadClubFiltre.map((player) => {
                  const isSelected = selectedPlayer?.id === player.id;
                  return (
                    <article key={player.id} className={`card player-card ${isSelected ? "selected" : ""}`} onClick={() => setSelectedPlayer(player)} role="button" tabIndex={0}>
                      <div className="player-card-visual"><img src={player.teamCrest} alt="" className="player-card-crest" /><span className="player-initials">{getPlayerInitials(player.name)}</span><span className="player-number">{player.shirtNumber || "-"}</span></div>
                      <div className="card-body"><p className="player-card-label">Joueur</p><h3 title={player.name}>{player.name}</h3><p className="player-role">{player.position || "Staff / N/A"}</p><span className="tag-nationality">{player.nationality}</span></div>
                    </article>
                  );
                })}
              </div>
            </section>
            <aside className="detail-panel">
              <h2>Fiche Joueur</h2>
              {!selectedGlobalPlayer ? <div className="placeholder-box">👈 Cliquez sur un joueur pour afficher son profil.</div> : (
                <div className="player-card-detail">
                  <div className="detail-header"><img src={selectedGlobalPlayer.teamCrest} alt={selectedGlobalPlayer.teamName} className="detail-crest" /><div><h3>{selectedGlobalPlayer.name} {selectedGlobalPlayer.shirtNumber ? `#${selectedGlobalPlayer.shirtNumber}` : ""}</h3><p className="detail-club">Club : {selectedGlobalPlayer.teamName}</p></div></div>
                  <hr /><div className="detail-info"><p><strong>Poste :</strong> {selectedGlobalPlayer.position || "Non spécifié"}</p><p><strong>Nationalité :</strong> {selectedGlobalPlayer.nationality}</p><p><strong>Date de naissance :</strong> {selectedGlobalPlayer.dateOfBirth || "N/A"}</p></div>
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
