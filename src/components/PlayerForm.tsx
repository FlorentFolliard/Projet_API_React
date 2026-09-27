import { useState, type FormEvent } from "react";

type PlayerFormProps = {
  onSubmit: (player: { name: string; position: string }) => void;
};

export function PlayerForm({ onSubmit }: PlayerFormProps) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [errors, setErrors] = useState({ name: "", position: "" });

  function validate() {
    const nextErrors = {
      name: name.trim().length >= 2 ? "" : "Le nom doit contenir au moins 2 caractères.",
      position: position.trim().length >= 2 ? "" : "Le poste doit contenir au moins 2 caractères.",
    };

    setErrors(nextErrors);
    return !nextErrors.name && !nextErrors.position;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({ name: name.trim(), position: position.trim() });
    setName("");
    setPosition("");
    setErrors({ name: "", position: "" });
  }

  return (
    <form className="player-form" onSubmit={handleSubmit} noValidate>
      <label>
        Nom du joueur
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Kylian Mbappé" />
      </label>
      {errors.name && <small className="error-text">{errors.name}</small>}

      <label>
        Poste
        <input value={position} onChange={(event) => setPosition(event.target.value)} placeholder="Ex. Attaquant" />
      </label>
      {errors.position && <small className="error-text">{errors.position}</small>}

      <button type="submit" disabled={!name.trim() || !position.trim()}>Ajouter</button>
    </form>
  );
}
