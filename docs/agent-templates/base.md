# ⚠️ **À COMPLÉTER : Nom du projet**

## Présentation du projet

> ⚠️ **À COMPLÉTER : Description fonctionnelle du projet**

Décrire :

- Le domaine métier concerné
- Le type d'application (API, worker, CLI, application web, microservice, etc.)
- Les objectifs principaux
- Les contraintes techniques ou réglementaires éventuelles

### Fonctionnalités principales

> ⚠️ **À COMPLÉTER : Décrire les fonctionnalités clés**

---

## Stack technique

### Technologies principales

> ⚠️ **À COMPLÉTER : Préciser les versions exactes**

- **Runtime** : À compléter
- **Langage** : À compléter
- **Framework applicatif** : À compléter
- **Base de données / stockage** : À compléter
- **Système de cache** : À compléter (si applicable)
- **Tests** : À compléter
- **Logging** : À compléter
- **Documentation API** : À compléter (si applicable)
- **Métriques / Monitoring** : À compléter (si applicable)
- **CI/CD** : À compléter
- **Package manager** : À compléter

---

## Architecture

### Organisation des dossiers

> ⚠️ **À COMPLÉTER : Structure réelle du projet**

---

## Conventions de code

> ⚠️ **À COMPLÉTER : Règles spécifiques éventuelles (ex. : règles ESLint internes, conventions Git, hooks, etc.)**

---

## Commandes disponibles

> ⚠️ **À COMPLÉTER : Adapter aux scripts réels du projet**

---

### Validation obligatoire avant livraison

Toute modification doit passer avec succès :

1. `pnpm lint`
2. `pnpm type-check`
3. `pnpm test`

> ⚠️ **À ADAPTER : Selon le projet, le package manager, les commandes disponibles et les éventuelles validations supplémentaires (audit de sécurité, build de production, analyse statique, etc.)**

Aucune intervention ne doit être considérée comme valide si l'une de ces étapes échoue.

---

## Bonnes pratiques

- **Respecter les principes SOLID** : séparation claire des responsabilités, extensibilité, réutilisation plutôt que duplication, faible couplage et inversion des dépendances.
- **Respecter le principe DRY** : toute logique dupliquée doit être extraite dans un utilitaire ou une abstraction partagée.
- **Respecter le principe KISS** : privilégier la simplicité et la lisibilité du code plutôt que des abstractions prématurées.
- **Configurabilité** : toute valeur dépendante d'un environnement DOIT être externalisée via la configuration applicative, alimentée par des variables d'environnement. Ne jamais coder une valeur d'environnement en dur.
- **Maîtrise des dépendances** : privilégier une solution existante dans la stack avant d'ajouter une librairie. En cas d'ajout nécessaire, vérifier la maintenance active, la légèreté, la stabilité et la compatibilité avec l'architecture en place.
- **Documentation à jour** : toute modification du code ou de l'architecture DOIT être répercutée sur la documentation impactée.

> ⚠️ **À ADAPTER : ces bonnes pratiques constituent un socle minimal. Elles DOIVENT être adaptées, étendues ou restreintes en fonction des spécificités fonctionnelles, techniques et organisationnelles du projet.**

---

### Stratégie de documentation

Toujours utiliser Context7 MCP pour consulter la documentation officielle des librairies, générer du code, configurer ou intégrer des dépendances.
Aucune implémentation ne doit reposer sur une hypothèse non vérifiée par la documentation officielle lorsque celle-ci est accessible via Context7 MCP.

---

## Workflow

### Lors de l'ajout de fonctionnalités

1. **Créer le module ou composant** dans le dossier approprié selon l'architecture du projet
2. **Implémenter la logique métier** dans le service ou équivalent
3. **Définir les contrats d'interface** (types, DTO, schémas) dans le dossier dédié, si existant
4. **Écrire les tests** couvrant les nouveaux comportements
5. **Mettre à jour la configuration** si de nouvelles variables d'environnement sont nécessaires
6. **Enregistrer le module** dans le point d'entrée approprié, si requis par le framework
7. **Exécuter les validations statiques**, puis la suite de tests

### Lors de la correction de bugs

1. **Écrire d'abord un test** qui reproduit le bug (approche TDD)
2. **Corriger la source du problème**
3. **Vérifier la gestion des erreurs** et la présence de logs appropriés
4. **Exécuter les validations statiques**, puis la suite de tests

### Lors du refactoring

1. **Exécuter la suite de tests complète** avant toute modification
2. **Respecter les frontières architecturales** définies dans la section Architecture
3. **Mettre à jour les imports** selon les conventions de nommage et les alias du projet
4. **Vérifier que la couverture de tests** ne diminue pas
5. **Exécuter les validations statiques**, puis la suite de tests
6. **S'assurer de l'absence** de breaking changes comportementaux

---

## Agent Changelog

Après chaque intervention, ajouter une entrée en tête de `AGENTS-CHANGELOG.md` :

- Date (YYYY-MM-DD)
- Résumé en une phrase de la demande
- Actions concrètes réalisées
- Points de vigilance ou décisions notables (omettre si aucun)
- Breaking changes (omettre si aucun)

Ne jamais regrouper plusieurs interventions dans une même entrée.
