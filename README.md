# Football Explorer

Application React + TypeScript pour explorer des clubs et joueurs de football, filtrer les informations, consulter les détails d’un club et gérer une fiche joueur avec validation côté client.

Projet réalisé par :
Florent Folliard, Joey Sportes, Mohamed Traore, Oscar Vivien

## Fonctionnalités
- Liste de clubs populaires
- Recherche multicritère
- Navigation par routes avec React Router
- Détail d’un club avec chargement, erreur et succès visible
- Formulaire sécurisé avec validation
- Contexte global géré via useReducer
- Export et synchronisation locale des joueurs

## Stack technique
- React
- TypeScript
- Vite
- React Router
- Vitest + Testing Library

## Installation
```bash
npm install
npm run dev
```

## Scripts
```bash
npm run dev
npm run build
npm test
```

## Répartition du travail
| Membre | Rôle principal | Fichiers & Livrables clés | Compétences démontrées |
| :--- | :--- | :--- | :--- |
| **Oscar** | Architecture TypeScript & État Global | `types.ts`, `AppContext.tsx`, `utils.ts`, `useLocalStorage.ts` | Génériques, `useReducer`, typage strict sans `any`, immuabilité. |
| **Florent** | API, Asynchrone & Déploiement | `useFetch.ts`, `api/football.ts`, `vercel.json`, `vite.config.ts` | `AbortController`, 3 états asynchrones, déploiement HTTPS, Serverless/Proxy. |
| **Mohamed** | UI, Layout & React Router v6 | `App.tsx`, `Layout.tsx`, `HomePage.tsx`, `Card.tsx`, `Grid.tsx` | Routes v6, `<Outlet/>`, composants réutilisables avec `children`, navigation programmatique. |
| **Joey** | Formulaire, Détails & Tests Unitaires | `PlayerForm.tsx`, `ClubPage.tsx`, `ClubMatches.tsx`, `app.test.tsx` | Formulaire contrôlé, route à paramètre, tests Vitest & cas conditionnels. |

## Déploiement
[URL publique déployée grâce à Vercel](https://projet-api-react.vercel.app/)

