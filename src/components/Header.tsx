import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { state } = useApp();

  return (
    <header className="app-header">
      <div className="brand">
        <NavLink to="/">⚽ Football Explorer</NavLink>
      </div>
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
          Clubs & Effectifs
        </NavLink>
        <NavLink to="/ajouter-joueur" className={({ isActive }) => (isActive ? 'active' : '')}>
          + Ajouter un joueur
        </NavLink>
        <span className="fav-count">★ Favoris : {state.favorisIds.length}</span>
      </nav>
    </header>
  );
};