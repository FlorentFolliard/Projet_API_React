import React, { useState } from 'react';
import type { Player, PlayerFormData, Position } from '../types';
import { CLUBS_POPULAIRES } from '../clubs';
import { validerDate } from '../utils';

type PlayerFormProps = {
  onSubmit: (player: Player) => void;
};

export const PlayerForm: React.FC<PlayerFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PlayerFormData>({
    name: '',
    position: 'Attaquant',
    nationality: '',
    dateOfBirth: '',
    shirtNumber: '',
    teamId: CLUBS_POPULAIRES[0].id,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PlayerFormData, string>>>({});

  function validate(data: PlayerFormData) {
    const errs: Partial<Record<keyof PlayerFormData, string>> = {};
    if (!data.name.trim() || data.name.trim().length < 3) {
      errs.name = 'Le nom doit contenir au moins 3 caractères.';
    }
    if (!data.nationality.trim()) {
      errs.nationality = 'La nationalité est obligatoire.';
    }
    if (!validerDate(data.dateOfBirth)) {
      errs.dateOfBirth = 'La date doit être valide au format AAAA-MM-JJ.';
    }
    const num = Number(data.shirtNumber);
    if (!data.shirtNumber || isNaN(num) || num < 1 || num > 99) {
      errs.shirtNumber = 'Le numéro de maillot doit être compris entre 1 et 99.';
    }
    return errs;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const nextData = { ...formData, [name]: name === 'teamId' ? Number(value) : value };
    setFormData(nextData);
    setErrors(validate(nextData));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const vErrors = validate(formData);
    setErrors(vErrors);

    if (Object.keys(vErrors).length > 0) return;

    const club = CLUBS_POPULAIRES.find((c) => c.id === formData.teamId)!;
    const newPlayer: Player = {
      id: Date.now(),
      name: formData.name.trim(),
      position: formData.position as Position,
      nationality: formData.nationality.trim(),
      dateOfBirth: formData.dateOfBirth,
      shirtNumber: Number(formData.shirtNumber),
      teamId: club.id,
      teamName: club.name,
      teamCrest: club.crest,
    };

    onSubmit(newPlayer);
  }

  const isValid = Object.keys(validate(formData)).length === 0;

  return (
    <form className="controlled-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name">Nom complet</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="position">Poste</label>
        <select id="position" name="position" value={formData.position} onChange={handleChange}>
          <option value="Gardien">Gardien</option>
          <option value="Défenseur">Défenseur</option>
          <option value="Milieu">Milieu</option>
          <option value="Attaquant">Attaquant</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="nationality">Nationalité</label>
        <input
          id="nationality"
          name="nationality"
          type="text"
          value={formData.nationality}
          onChange={handleChange}
          className={errors.nationality ? 'input-error' : ''}
        />
        {errors.nationality && <span className="error-text">{errors.nationality}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="dateOfBirth">Date de naissance</label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className={errors.dateOfBirth ? 'input-error' : ''}
        />
        {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="shirtNumber">Numéro de maillot (1-99)</label>
        <input
          id="shirtNumber"
          name="shirtNumber"
          type="number"
          min="1"
          max="99"
          value={formData.shirtNumber}
          onChange={handleChange}
          className={errors.shirtNumber ? 'input-error' : ''}
        />
        {errors.shirtNumber && <span className="error-text">{errors.shirtNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="teamId">Club d'affectation</label>
        <select id="teamId" name="teamId" value={formData.teamId} onChange={handleChange}>
          {CLUBS_POPULAIRES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={!isValid} className="btn-submit">
        Enregistrer le joueur
      </button>
    </form>
  );
};