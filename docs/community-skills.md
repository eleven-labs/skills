# Skills communautaires

Catalogue des skills communautaires que nous utilisons (ou avons testés) via [skills.sh](https://skills.sh).

## Légende

| Icône | Signification                                    |
| ----- | ------------------------------------------------ |
| ✅    | Recommandé — efficace, testé en production       |
| ⚠️    | Avec réserves — fonctionne mais avec des limites |
| ❌    | Non recommandé — inefficace ou problématique     |

## Skills recommandés

### skybridge

- **Source** : [`alpic-ai/skybridge`](https://github.com/alpic-ai/skybridge)
- **Installation** : `npx skills add alpic-ai/skybridge --skill skybridge`
- **Description** : Framework pour créer des applications conversationnelles (ChatGPT Apps, serveurs MCP) de bout en bout. Couvre le brainstorming, le scaffolding, l'implémentation de tools/widgets, le debug, le déploiement et la connexion aux assistants IA.
- **Agents compatibles** : Claude Code, Codex ...

| Avis | Par       | Retour d'expérience                                                                                                                                                                                |
| :--: | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  ✅  | @fpasquet | Permet de créer un serveur MCP from scratch de manière performante avec un code propre. Utilisé pour créer un serveur MCP de webperf. Fonctionne aussi bien pour des apps ChatGPT que pour Claude. |

### vercel-react-best-practices

- **Source** : [`vercel/next.js`](https://github.com/vercel/next.js)
- **Installation** : `npx skills add vercel/next.js --skill vercel-react-best-practices`
- **Description** : Bonnes pratiques React et Next.js par Vercel. Couvre les patterns recommandés, les conventions et les optimisations de l'écosystème Next.js.
- **Agents compatibles** : Claude Code, Codex ...

| Avis | Par       | Retour d'expérience                                                                                                              |
| :--: | :-------- | :------------------------------------------------------------------------------------------------------------------------------- |
|  ✅  | @fpasquet | Accélère les refactoring sur des projets Next.js existants et facilite les migrations vers Next.js depuis d'autres stacks React. |

### tailwind-v4-shadcn

- **Source** : [`jezweb/claude-skills`](https://github.com/jezweb/claude-skills)
- **Installation** : `npx skills add jezweb/claude-skills --skill shadcn-ui`
- **Description** : Automatise l'ajout de composants shadcn/ui à des projets React. Gère l'ordre d'installation des dépendances, corrige les bugs courants (Radix Select, React Hook Form, icônes Lucide), et fournit des recettes réutilisables (formulaires, data tables, modales CRUD). Personnalisation basée sur des tokens sémantiques Tailwind v4.
- **Agents compatibles** : Claude Code, Codex ...

| Avis | Par       | Retour d'expérience                                                                                              |
| :--: | :-------- | :--------------------------------------------------------------------------------------------------------------- |
|  ⚠️  | @fpasquet | Pas encore testé sur un projet réel. Le skill semble complet et bien structuré, à évaluer en conditions réelles. |

### turborepo

- **Source** : [`vercel/turborepo`](https://github.com/vercel/turborepo)
- **Installation** : `npx skills add vercel/turborepo --skill turborepo`
- **Description** : Guide sur Turborepo pour les monorepos JS/TS. Couvre la configuration des tâches (`dependsOn`, `outputs`), la mise en cache locale et distante, le filtrage avec `--affected`/`--filter`, la structure monorepo, l'intégration CI/CD (GitHub Actions, Vercel) et le mode watch. Détecte et corrige les anti-patterns courants.
- **Agents compatibles** : Claude Code, Codex ...

| Avis | Par       | Retour d'expérience                                                                                                                       |
| :--: | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
|  ✅  | @fpasquet | Utilisé pour créer un monorepo GraphQL avec Schema Stitching from scratch. Le skill guide bien la structure et les conventions Turborepo. |

## Skills non recommandés

_Aucun skill référencé pour le moment._

<!-- Ajoutez ici les skills non recommandés sous forme libre :
### ❌ nom-du-skill
- **Source** : `owner/repo`
- **Raison du rejet** : Pourquoi on ne le recommande pas.
- **Alternative** : Skill ou approche alternative.
-->

## Comment contribuer

1. Testez le skill sur au moins un projet
2. Ajoutez une entrée en suivant la structure existante
3. Ajoutez votre avis dans le tableau avec votre `@pseudo` — plusieurs avis par skill sont encouragés
4. Soyez factuels : décrivez ce qui fonctionne et ce qui ne fonctionne pas
5. Mettez à jour votre avis si votre expérience évolue
