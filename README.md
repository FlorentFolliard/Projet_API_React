# Football Explorer

Application React + TypeScript pour explorer des clubs et joueurs de football, filtrer les informations, consulter les détails d’un club et gérer une fiche joueur avec validation côté client.

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
- Front / routing / navigation : [src/App.tsx](src/App.tsx), [src/components/Layout.tsx](src/components/Layout.tsx)
- Contexte global et useReducer : [src/context/AppContext.tsx](src/context/AppContext.tsx)
- Hooks API et gestion des états : [src/hooks/useFetch.ts](src/hooks/useFetch.ts)
- Recherche et composants UI : [src/components/SearchBar.tsx](src/components/SearchBar.tsx), [src/components/ClubCard.tsx](src/components/ClubCard.tsx), [src/components/SectionCard.tsx](src/components/SectionCard.tsx)
- Formulaire et validation : [src/components/PlayerForm.tsx](src/components/PlayerForm.tsx)
- Tests : [src/App.test.tsx](src/App.test.tsx)

## Déploiement
Renseigner l’adresse HTTPS publique du projet lors du déploiement final.

## Remarques
Le projet est prêt pour la démonstration locale et la soutenance technique. La version de production doit être déployée sur une URL publique pour la présentation finale en ligne.
