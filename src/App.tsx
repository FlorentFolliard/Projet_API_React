import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ClubPage } from './pages/ClubPage';
import { AddPlayerPage } from './pages/AddPlayerPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './App.css';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/club/:clubId" element={<ClubPage />} />
        <Route path="/ajouter-joueur" element={<AddPlayerPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

export default App;