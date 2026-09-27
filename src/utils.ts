/**
 * Supprime accents et met en minuscules
 */
export function normaliserTexte(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Fonction générique exigée par le sujet:
 * Filtre un tableau d'éléments génériques T selon une clé et une recherche
 */
export function normaliserEtFiltrer<T>(
  elements: T[],
  recherche: string,
  extraireValeur: (element: T) => string
): T[] {
  const query = normaliserTexte(recherche);
  if (!query) return elements;
  return elements.filter((element) =>
    normaliserTexte(extraireValeur(element)).includes(query)
  );
}

export function validerDate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d.getTime());
}