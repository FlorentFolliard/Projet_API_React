import React from 'react';
import type { Player } from '../types';
import { useApp } from '../context/AppContext';

type PlayerModalProps = {
  player: Player | null;
  onClose: () => void;
};

export const PlayerModal: React.FC<PlayerModalProps> = ({ player, onClose }) => {
  const { state, dispatch } = useApp();
  if (!player) return null;

  const isFavori = state.favorisIds.includes(player.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <img src={player.teamCrest} alt="" className="modal-crest" />
          <div>
            <h2>{player.name} {player.shirtNumber ? `#${player.shirtNumber}` : ''}</h2>
            <p className="modal-team">{player.teamName}</p>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </header>
        <div className="modal-body">
          <p><strong>Poste :</strong> {player.position}</p>
          <p><strong>Nationalité :</strong> 🌍 {player.nationality}</p>
          <p><strong>Date de naissance :</strong> {player.dateOfBirth}</p>
          <p><strong>Identifiant :</strong> #{player.id}</p>
        </div>
        <footer className="modal-footer">
          <button
            className={`btn-fav ${isFavori ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_FAVORI', payload: player.id })}
          >
            {isFavori ? '★ Retirer des favoris' : '☆ Ajouter aux favoris'}
          </button>
        </footer>
      </div>
    </div>
  );
};