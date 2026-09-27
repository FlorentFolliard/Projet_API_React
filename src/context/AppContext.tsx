import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";

export type AppState = {
  query: string;
  favorites: number[];
};

export type AppAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "TOGGLE_FAVORITE"; payload: number };

const initialState: AppState = {
  query: "",
  favorites: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "TOGGLE_FAVORITE": {
      const alreadyLiked = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: alreadyLiked
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    }
    default:
      return state;
  }
}

type AppContextValue = {
  state: AppState;
  setQuery: (value: string) => void;
  toggleFavorite: (clubId: number) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = useMemo<AppContextValue>(() => ({
    state,
    setQuery: (value: string) => dispatch({ type: "SET_QUERY", payload: value }),
    toggleFavorite: (clubId: number) => dispatch({ type: "TOGGLE_FAVORITE", payload: clubId }),
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState doit être utilisé à l'intérieur de AppProvider");
  }

  return context;
}
