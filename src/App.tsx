import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import { HomePage } from './pages/HomePage';
import { ClubPage } from './pages/ClubPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/club/:clubId" element={<ClubPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <AppProvider>
      <div className="container">
        <AppRoutes />
      </div>
    </AppProvider>
  );
}

export default App;
