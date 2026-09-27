/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Player, ClubItem } from '../types';
import { CLUBS_POPULAIRES } from '../clubs';
import initialPlayers from '../data/joueurs.json';

type State = {
  clubs: ClubItem[];
  players: Player[];
  favorisIds: number[];       // Favoris joueurs
  clubFavorisIds: number[];   // Favoris clubs
  recherche: string;
};

type Action =
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'TOGGLE_FAVORI'; payload: number }
  | { type: 'TOGGLE_CLUB_FAVORI'; payload: number }
  | { type: 'SET_RECHERCHE'; payload: string }
  | { type: 'SET_PLAYERS'; payload: Player[] };

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [action.payload, ...state.players],
      };
    case 'TOGGLE_FAVORI': {
      const exists = state.favorisIds.includes(action.payload);
      return {
        ...state,
        favorisIds: exists
          ? state.favorisIds.filter((id) => id !== action.payload)
          : [...state.favorisIds, action.payload],
      };
    }
    case 'TOGGLE_CLUB_FAVORI': {
      const exists = state.clubFavorisIds.includes(action.payload);
      return {
        ...state,
        clubFavorisIds: exists
          ? state.clubFavorisIds.filter((id) => id !== action.payload)
          : [...state.clubFavorisIds, action.payload],
      };
    }
    case 'SET_RECHERCHE':
      return { ...state, recherche: action.payload };
    case 'SET_PLAYERS':
      return { ...state, players: action.payload };
    default:
      return state;
  }
}

type AppContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    clubs: CLUBS_POPULAIRES,
    players: (initialPlayers as Player[]) || [],
    favorisIds: JSON.parse(localStorage.getItem('football_favoris') || '[]'),
    clubFavorisIds: JSON.parse(localStorage.getItem('football_clubs_favoris') || '[]'),
    recherche: '',
  });

  useEffect(() => {
    localStorage.setItem('football_favoris', JSON.stringify(state.favorisIds));
  }, [state.favorisIds]);

  useEffect(() => {
    localStorage.setItem('football_clubs_favoris', JSON.stringify(state.clubFavorisIds));
  }, [state.clubFavorisIds]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé dans AppProvider');
  }
  return context;
}