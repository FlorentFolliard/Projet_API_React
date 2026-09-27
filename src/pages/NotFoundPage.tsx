import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Oups, la page demandée n'existe pas ou a été déplacée.</p>
      <button onClick={() => navigate('/')}>Retourner à l'accueil</button>
    </div>
  );
};