import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CLUBS_POPULAIRES } from "../clubs";
import { PlayerForm } from "../components/PlayerForm";
import { SectionCard } from "../components/SectionCard";
import { useAppState } from "../context/AppContext";
import { useFetch } from "../hooks/useFetch";
import type { TeamDetailResponse, TeamMatchesResponse } from "../types";
import { normaliserTexte } from "../utils";

const PLAYERS = [
  { id: 1, name: "Kylian Mbappé", position: "Attaquant", teamId: 86 },
  { id: 2, name: "Vinicius Jr", position: "Ailier", teamId: 86 },
  { id: 3, name: "Jules Koundé", position: "Défenseur", teamId: 81 },
  { id: 4, name: "Ousmane Dembélé", position: "Ailier", teamId: 81 },
  { id: 5, name: "Achraf Hakimi", position: "Défenseur", teamId: 524 },
];

export function ClubPage() {
  const { clubId } = useParams();
  const { state } = useAppState();
  const [players, setPlayers] = useState(PLAYERS);
  const { donnees, chargement, erreur } = useFetch<TeamDetailResponse>(clubId ? `teams/${clubId}` : "");
  const {
    donnees: donneesMatchs,
    chargement: chargementMatchs,
    erreur: erreurMatchs,
  } = useFetch<TeamMatchesResponse>(clubId ? `teams/${clubId}/matches?status=FINISHED&limit=5` : "");

  const currentClub = CLUBS_POPULAIRES.find((club) => String(club.id) === clubId);

  const filteredPlayers = useMemo(() => {
    const query = normaliserTexte(state.query);
    const clubPlayers = (donnees?.squad ?? players).filter((player) =>
      player.teamId === Number(clubId) || !("teamId" in player) || true
    );

    if (!query) return clubPlayers;

    return clubPlayers.filter((player) =>
      normaliserTexte(player.name).includes(query) || normaliserTexte(player.position ?? "").includes(query)
    );
  }, [clubId, donnees, players, state.query]);

  const derniersMatchs = (donneesMatchs?.matches ?? [])
    .slice()
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime());

  if (!currentClub) {
    return <div className="placeholder-box">Club introuvable.</div>;
  }

  function handleAddPlayer(player: { name: string; position: string }) {
    setPlayers((current) => [
      ...current,
      {
        id: Date.now(),
        name: player.name,
        position: player.position,
        teamId: Number(clubId),
      },
    ]);
  }

  return (
    <>
      <Link to="/" className="btn-back">← Retour</Link>
      <SectionCard title={currentClub.name} subtitle={chargement ? "Chargement des joueurs..." : `${filteredPlayers.length} joueurs`}>
        {chargement && <p className="helper-text">Chargement des données API…</p>}
        {erreur && <p className="helper-text error-text">Erreur : {erreur}</p>}

        {!chargement && !erreur && (
          <div className="grid-cards">
            {filteredPlayers.map((player) => (
              <article key={player.id} className="card player-card">
                <div className="player-visual">
                  <span className="player-initials">{player.name.split(' ').slice(0,2).map((part) => part[0]).join('').toUpperCase()}</span>
                  <span className="shirt-number">#{player.id}</span>
                </div>
                <div className="card-body">
                  <h3>{player.name}</h3>
                  <p className="player-role">{player.position ?? "Position non renseignée"}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Historique des matchs" subtitle="5 derniers matchs terminés">
        {chargementMatchs && <p className="helper-text">Chargement des résultats…</p>}
        {erreurMatchs && <p className="helper-text error-text">L’historique des matchs est indisponible pour le moment.</p>}
        {!chargementMatchs && !erreurMatchs && derniersMatchs.length === 0 && (
          <p className="helper-text">Aucun match terminé disponible pour cette équipe.</p>
        )}
        {!chargementMatchs && !erreurMatchs && derniersMatchs.length > 0 && (
          <ol className="match-list">
            {derniersMatchs.map((match) => {
              const scoreDomicile = match.score.fullTime.home;
              const scoreExterieur = match.score.fullTime.away;
              const resultat = scoreDomicile === null || scoreExterieur === null
                ? "inconnu"
                : scoreDomicile === scoreExterieur
                  ? "nul"
                  : (scoreDomicile > scoreExterieur) === (match.homeTeam.id === Number(clubId))
                    ? "victoire"
                    : "défaite";
              const nomDomicile = match.homeTeam.shortName ?? match.homeTeam.name;
              const nomExterieur = match.awayTeam.shortName ?? match.awayTeam.name;

              return (
                <li key={match.id} className={`match-row match-row--${resultat}`}>
                  <div className="match-meta">
                    <time dateTime={match.utcDate}>
                      {new Intl.DateTimeFormat("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(match.utcDate))}
                    </time>
                    <span>{match.competition.name}</span>
                  </div>
                  <div className="match-scoreline">
                    <span className="match-team-name">{nomDomicile}</span>
                    <strong className="match-score">
                      {scoreDomicile ?? "–"} - {scoreExterieur ?? "–"}
                    </strong>
                    <span className="match-team-name">{nomExterieur}</span>
                  </div>
                  <span className="match-result">
                    {resultat === "inconnu" ? "Terminé" : resultat}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </SectionCard>

      <SectionCard title="Ajouter un joueur">
        <PlayerForm onSubmit={handleAddPlayer} />
      </SectionCard>
    </>
  );
}
