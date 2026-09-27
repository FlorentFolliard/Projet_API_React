import React from 'react';
import type { Player } from '../types';

type TeamStatsProps = {
  players: Player[];
};

export const TeamStats: React.FC<TeamStatsProps> = ({ players }) => {
  const gardiens = players.filter((p) => p.position === 'Gardien').length;
  const defenseurs = players.filter((p) => p.position === 'Défenseur').length;
  const milieux = players.filter((p) => p.position === 'Milieu').length;
  const attaquants = players.filter((p) => p.position === 'Attaquant').length;

  return (
    <div className="team-stats">
      <span>🧤 {gardiens} Gardien(s)</span>
      <span>🛡️ {defenseurs} Défenseur(s)</span>
      <span>⚙️ {milieux} Milieu(x)</span>
      <span>⚡ {attaquants} Attaquant(s)</span>
    </div>
  );
};