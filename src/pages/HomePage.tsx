import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { ClubCard } from "../components/ClubCard";
import { SectionCard } from "../components/SectionCard";
import { useAppState } from "../context/AppContext";
import { CLUBS_POPULAIRES } from "../clubs";
import { normaliserTexte } from "../utils";

export function HomePage() {
  const navigate = useNavigate();
  const { state, setQuery, toggleFavorite } = useAppState();
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);

  const filteredClubs = useMemo(() => {
    const query = normaliserTexte(state.query);
    if (!query) return CLUBS_POPULAIRES;

    return CLUBS_POPULAIRES.filter((club) =>
      normaliserTexte(club.name).includes(query) ||
      normaliserTexte(club.shortName).includes(query) ||
      normaliserTexte(club.country).includes(query)
    );
  }, [state.query]);

  function handleSelectClub(id: number) {
    setSelectedClubId(id);
    navigate(`/club/${id}`);
  }

  return (
    <>
      <SearchBar value={state.query} onChange={setQuery} placeholder="Rechercher un club, une nationalité..." />

      {!selectedClubId && (
        <p className="helper-text">Choisissez un club pour afficher les détails.</p>
      )}

      <SectionCard title="Clubs populaires" subtitle={`${filteredClubs.length} clubs`}>
        <div className="grid-cards">
          {filteredClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              isFavorite={state.favorites.includes(club.id)}
              onSelect={handleSelectClub}
              onFavoriteToggle={toggleFavorite}
            />
          ))}
        </div>
      </SectionCard>

      {selectedClubId && (
        <p className="helper-text">Club sélectionné : {CLUBS_POPULAIRES.find((club) => club.id === selectedClubId)?.name}</p>
      )}
    </>
  );
}
