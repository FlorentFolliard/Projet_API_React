import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { useFetch } from './hooks/useFetch'
import type { Player } from './types.tsx'

function App() {
  const [count, setCount] = useState(0)

  // Exemple avec l'id 2019 (Kylian Mbappé sur football-data.org)
  const { donnees: player, chargement, erreur } = useFetch<Player>('persons/2019')

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      {/* Section d'affichage du joueur selon ton types.ts */}
      <section style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem', textAlign: 'left' }}>
        <h2>Fiche Joueur</h2>

        {chargement && <p>⏳ Chargement des informations du joueur...</p>}

        {erreur && (
          <div style={{ color: '#ef4444', background: '#fee2e2', padding: '1rem', borderRadius: '8px' }}>
            ❌ Erreur : {erreur}
          </div>
        )}

        {!chargement && !erreur && player && (
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              {player.currentTeam?.crest && (
                <img
                  src={player.currentTeam.crest}
                  alt={player.currentTeam.name}
                  style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                />
              )}
              <div>
                <h3 style={{ margin: 0 }}>
                  {player.name} {player.shirtNumber ? `#${player.shirtNumber}` : ''}
                </h3>
                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                  {player.currentTeam?.name || 'Sans club'}
                </p>
              </div>
            </div>

            <p style={{ margin: '0.4rem 0' }}><strong>Poste :</strong> {player.position || 'Non renseigné'}</p>
            <p style={{ margin: '0.4rem 0' }}><strong>Nationalité :</strong> {player.nationality}</p>
            <p style={{ margin: '0.4rem 0' }}><strong>Date de naissance :</strong> {player.dateOfBirth}</p>
          </div>
        )}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App