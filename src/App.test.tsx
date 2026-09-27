import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('affiche le titre principal', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Football Explorer/i)).toBeInTheDocument();
  });

  it('affiche un message sur la fiche joueur quand aucun club n\'est sélectionné', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/choisissez un club/i)).toBeInTheDocument();
  });

  it('permet de saisir dans le champ de recherche', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/rechercher/i);
    await user.type(input, 'Paris');

    expect(input).toHaveValue('Paris');
  });

  it('passe sur une page 404 si la route est inconnue', () => {
    render(
      <MemoryRouter initialEntries={['/route-inconnue']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/page introuvable/i)).toBeInTheDocument();
  });
});
