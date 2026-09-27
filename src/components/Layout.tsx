import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app-shell">
      <header className="main-header">
        <h1>Football Explorer</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
