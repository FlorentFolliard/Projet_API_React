import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PlayerForm } from '../components/PlayerForm';
import type { Player } from '../types';

export const AddPlayerPage: React.FC = () => {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  function handleAdd(player: Player) {
    dispatch({ type: 'ADD_PLAYER', payload: player });
    navigate(`/club/${player.teamId}`);
  }

  return (
    <div className="form-page-container">
      <h2>Ajouter un nouveau joueur à l'effectif</h2>
      <p>Remplissez l'ensemble des champs validés côté client pour intégrer un joueur.</p>
      <PlayerForm onSubmit={handleAdd} />
    </div>
  );
};