import { useEffect, useState } from 'react'
import type { Player } from './type'
import './App.css'

const playerId = 44
const apiUrl = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY

function App() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        const response = await fetch(`${apiUrl}persons/${playerId}`, {
          headers: { 'X-Auth-Token': apiKey },
        })

        if (!response.ok) {
          throw new Error(`Erreur API : ${response.status}`)
        }

        setPlayer(await response.json())
      } catch {
        setError('Impossible de récupérer les données du joueur.')
      }
    }

    loadPlayer()
  }, [])

  if (error) {
    return <main className="player-page"><p className="status-message error-message">{error}</p></main>
  }

  if (!player) {
    return <main className="player-page"><p className="status-message">Chargement du joueur...</p></main>
  }

  const birthDate = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(player.dateOfBirth))

  return (
    <main className="player-page">
      <header className="page-header">
        <p className="eyebrow">Fiche joueur</p>
        <h1>{player.name}</h1>
        <p className="subtitle">Les informations essentielles du joueur</p>
      </header>

      <section className="player-card" aria-label={`Profil de ${player.name}`}>
        <div className="number-badge" aria-label={`Numéro ${player.shirtNumber}`}>
          <span>Numéro</span>
          <strong>{player.shirtNumber}</strong>
        </div>

        <div className="player-content">
          <div className="player-intro">
            <p className="player-position">{player.position}</p>
            <h2>{player.name}</h2>
            <p className="player-nationality">{player.nationality}</p>
          </div>

          <dl className="player-details">
            <div>
              <dt>Date de naissance</dt>
              <dd>{birthDate}</dd>
            </div>
            <div>
              <dt>Équipe actuelle</dt>
              <dd className="team-name">
                <img src={player.currentTeam.crest} alt="" />
                {player.currentTeam.name}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  )
}

export default App
