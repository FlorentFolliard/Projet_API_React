import { useFetch } from "./hooks/useFetch";
import type { ReponseCompetitions } from "./types";

export function App() {
  // Récupère la liste des compétitions disponibles
  const { donnees, chargement, erreur } = useFetch<ReponseCompetitions>("competitions");

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto", fontFamily: "sans-serif", padding: "0 1rem" }}>
      <header style={{ borderBottom: "1px solid #ddd", paddingBottom: "1rem", marginBottom: "2rem" }}>
        <h1>Football Data Explorer</h1>
        <p>Projet React + TypeScript connecté à l'API football-data.org</p>
      </header>

      {chargement && <p>⏳ Chargement des compétitions...</p>}
      {erreur && (
        <div style={{ color: "#b91c1c", background: "#fee2e2", padding: "1rem", borderRadius: "8px" }}>
          ❌ {erreur}
        </div>
      )}

      {!chargement && !erreur && donnees && (
        <div>
          <h2>Compétitions disponibles ({donnees.competitions.length})</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {donnees.competitions.map((competition) => (
              <div
                key={competition.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  background: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                {competition.emblem && (
                  <img
                    src={competition.emblem}
                    alt={competition.name}
                    style={{ width: "40px", height: "40px", objectFit: "contain", marginBottom: "0.5rem" }}
                  />
                )}
                <h3 style={{ margin: "0.25rem 0" }}>{competition.name}</h3>
                <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>
                  Pays / Zone : {competition.area.name} {competition.area.flag || ""}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "0.5rem",
                    padding: "0.2rem 0.5rem",
                    background: "#e0f2fe",
                    color: "#0369a1",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                  }}
                >
                  Code : {competition.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;