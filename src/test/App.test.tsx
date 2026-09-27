import { describe, it, expect } from 'vitest';
import { normaliserEtFiltrer, normaliserTexte, validerDate } from '../utils';

describe('Fonctions utilitaires et filtres', () => {
  it('normalise correctement les textes avec accents', () => {
    expect(normaliserTexte('Kylian Mbappé')).toBe('kylian mbappe');
    expect(normaliserTexte('Luka Modrić')).toBe('luka modric');
  });

  it('valide le format strict des dates (AAAA-MM-JJ)', () => {
    expect(validerDate('1998-12-20')).toBe(true);
    expect(validerDate('invalid-date')).toBe(false);
  });

  it('générique : filtre correctement un tableau selon le critère', () => {
    const data = [
      { id: 1, nom: 'Real Madrid' },
      { id: 2, nom: 'FC Barcelona' },
    ];
    const resultat = normaliserEtFiltrer(data, 'barca', (item) => item.nom);
    expect(resultat).toHaveLength(1);
    expect(resultat[0].nom).toBe('FC Barcelona');
  });

  // Test conditionnel exigé par le sujet[cite: 6]
  it('comportement conditionnel : renvoie tout le tableau si la recherche est vide', () => {
    const data = [{ id: 1, n: 'A' }, { id: 2, n: 'B' }];
    const resVide = normaliserEtFiltrer(data, '', (item) => item.n);
    expect(resVide).toHaveLength(2);

    const resFiltre = normaliserEtFiltrer(data, 'A', (item) => item.n);
    expect(resFiltre).toHaveLength(1);
  });
});