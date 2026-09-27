import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CLUBS_POPULAIRES } from "../clubs";
import { PlayerForm } from "../components/PlayerForm";
import { SectionCard } from "../components/SectionCard";
import { useAppState } from "../context/AppContext";
import { useFetch } from "../hooks/useFetch";
import type { TeamDetailResponse } from "../types";
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

      <SectionCard title="Ajouter un joueur">
        <PlayerForm onSubmit={handleAddPlayer} />
      </SectionCard>
    </>
  );
}
