# ⚽ Football Explorer — Application React & TypeScript

Application web interactive de consultation et de gestion des grands clubs européens, de leurs effectifs et de leurs statistiques de match. Conçue avec **React**, **TypeScript** et **Vite**, elle respecte l'ensemble des contraintes académiques de robustesse, d'architecture modulaire et de gestion asynchrone.

🔗 **URL de production (HTTPS) :** [https://projet-api-react.vercel.app](https://projet-api-react.vercel.app)

---

## 👥 Répartition des rôles et livrables

| Membre | Rôle principal | Fichiers & Livrables clés | Compétences démontrées |
| :--- | :--- | :--- | :--- |
| **Oscar** | Architecture TypeScript & État Global | `types.ts`, `AppContext.tsx`, `utils.ts`, `useLocalStorage.ts` | Génériques, `useReducer`, typage strict sans `any`, immuabilité. |
| **Florent** | API, Asynchrone & Déploiement | `useFetch.ts`, `api/football.ts`, `vercel.json`, `vite.config.ts` | `AbortController`, 3 états asynchrones, déploiement HTTPS, Serverless/Proxy. |
| **Mohamed** | UI, Layout & React Router v6 | `App.tsx`, `Layout.tsx`, `HomePage.tsx`, `Card.tsx`, `Grid.tsx` | Routes v6, `<Outlet/>`, composants réutilisables avec `children`, navigation programmatique. |
| **Joey** | Formulaire, Détails & Tests Unitaires | `PlayerForm.tsx`, `ClubPage.tsx`, `ClubMatches.tsx`, `app.test.tsx` | Formulaire contrôlé, route à paramètre, tests Vitest & cas conditionnels. |

---

## 🛠️ Stack technique & Architecture

- **Moteur & Bundler :** [Vite](https://vitejs.dev/) avec template `react-ts` (HMR ultra-rapide).
- **Langage :** TypeScript (mode strict activé, validation `tsc --noEmit` à 0 erreur).
- **Routage :** React Router v6 (`<Outlet/>`, `useNavigate`, `useParams`).
- **Source de données :** API `football-data.org` (v4) couplée à un cache local et une sauvegarde de secours synchrone.
- **Tests unitaires :** Vitest + Testing Library.
- **Hébergement :** Vercel avec fonction Serverless et règles de redirection (`vercel.json`).

---

## 📋 Fonctionnalités de l'application

1. **Exploration & Recherche multicritère :**
   - Grille responsive des 8 grands clubs européens.
   - Moteur de recherche globale (sans distinction d'accents ni de casse) sur les clubs, joueurs, nationalités et postes.
   - Système d'ajout/retrait de favoris pour les clubs et les joueurs avec persistance locale (`localStorage`).
   - Page dédiée aux clubs favoris accessible depuis l'en-tête.

2. **Fiche détaillée de club (`/club/:clubId`) :**
   - Statistiques complètes de l'effectif ventilées par poste (gardiens, défenseurs, milieux, attaquants).
   - Historique récent des rencontres avec pastilles de résultat (Victoire, Nul, Défaite).
   - Modale d'informations détaillées au clic sur un joueur.

3. **Formulaire d'ajout contrôlé (`/ajouter-joueur`) :**
   - Formulaire entièrement contrôlé en local (`useState`).
   - Validation en temps réel champ par champ (format date `AAAA-MM-JJ`, numéro de maillot entre 1 et 99, etc.).
   - Soumission désactivée tant que les données saisies ne sont pas valides.

4. **Résilience réseau & Gestion asynchrone :**
   - Traitement explicite des trois états : `loading`, `error` et `success`.
   - Annulation propre des requêtes en cours via `AbortController` pour éliminer les situations de course (*race conditions*).
   - Bascule automatique sur des données locales de repli en cas de coupure réseau ou de dépassement de quota (HTTP 429).

---

## 🧩 Analyse des exigences pédagogiques

### 1. TypeScript & Typage strict
- **Zéro `any` non documenté :** Tous les types de données, événements du DOM et retours d'API sont strictement définis dans `src/types.ts`.
- **Unions pour états finis :** Modélisation de l'état asynchrone (`AsyncState<T>` avec `'idle' | 'loading' | 'success' | 'error'`) et des postes (`Position`).
- **Générique personnalisé :** Fonction `normaliserEtFiltrer<T>()` dans `src/utils.ts` permettant de filtrer n'importe quelle collection d'objets sans duplication de code.

### 2. État global & Immuabilité
- `AppContext` combiné à `useReducer` pour centraliser la modification des listes et des favoris de façon immuable (pas de mutation directe de tableaux ou d'objets).

### 3. Composants réutilisables (≥ 8 composants)
- `Layout` (structure globale avec navigation et pied de page via `<Outlet/>`)
- `Card` (composant conteneur réutilisable exploitant la prop `children`)
- `Grid` (disposition en grille CSS auto-adaptative exploitant `children`)
- `SearchBar` (champ de saisie contrôlé et réutilisable)
- `Header` (barre de navigation supérieure avec compteur réactif)
- `PlayerModal` (fenêtre modale de détails)
- `PlayerForm` (formulaire d'insertion de joueur)
- `TeamStats` (panneau analytique de l'effectif)
- `ClubMatches` (historique et résultats des rencontres)

### 4. Tests automatisés
Suite de tests exécutée sous Vitest (`src/test/app.test.tsx`) validant la normalisation textuelle, la validation stricte de date et un comportement conditionnel sur le filtrage générique.

---
