import { useState } from "react";
import type { ClubItem } from "../types";

type ClubCardProps = {
  club: ClubItem;
  isFavorite: boolean;
  onSelect: (clubId: number) => void;
  onFavoriteToggle: (clubId: number) => void;
};

export function ClubCard({ club, isFavorite, onSelect, onFavoriteToggle }: ClubCardProps) {
  const [logoIndisponible, setLogoIndisponible] = useState(false);

  return (
    <article className="card club-card" role="button" tabIndex={0} onClick={() => onSelect(club.id)} onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect(club.id);
      }
    }}>
      <button
        type="button"
        className="favorite-button"
        onClick={(event) => {
          event.stopPropagation();
          onFavoriteToggle(club.id);
        }}
        aria-label={isFavorite ? `Retirer ${club.name} des favoris` : `Ajouter ${club.name} aux favoris`}
      >
        {isFavorite ? "★" : "☆"}
      </button>
      {logoIndisponible ? (
        <span className="club-logo club-logo-fallback" aria-label={`Logo de ${club.name} indisponible`}>
          {club.shortName.slice(0, 2).toUpperCase()}
        </span>
      ) : (
        <img
          src={club.crest}
          alt={club.name}
          className="club-logo"
          onError={() => setLogoIndisponible(true)}
        />
      )}
      <div className="card-body">
        <h3>{club.name}</h3>
        <span className="tag-badge">🌍 {club.country}</span>
      </div>
    </article>
  );
}
