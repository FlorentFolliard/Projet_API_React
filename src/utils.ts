/**
 * Supprime les accents, majuscules et espaces superflus
 */
export function normaliserTexte(chaine: string): string {
  return chaine
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}