# Guide de création et publication de Skills

Collection de skills pour agents IA, publiés sur [skills.sh](https://skills.sh).

## Table des matières

- [Qu'est-ce qu'un Skill ?](#quest-ce-quun-skill-)
- [Structure minimale](#structure-minimale)
- [Bonnes pratiques d'écriture](#bonnes-pratiques-décriture)
- [Convention de nommage](#convention-de-nommage)
- [Évaluations](#évaluations)
- [CLI skills.sh](#cli-skillssh)
- [Publication sur skill.sh](#publication-sur-skillsh)
- [Checklist avant publication](#checklist-avant-publication)
- [Ressources](#ressources)

## Qu'est-ce qu'un Skill ?

Un Skill est un ensemble d'instructions spécialisées qui guide un agent IA dans l'accomplissement de tâches spécifiques. C'est un "manuel de bonnes pratiques" condensé qui améliore significativement les résultats sur des domaines précis.

Les skills suivent le standard ouvert [Agent Skills](https://agentskills.io), compatible avec plusieurs agents (Claude Code, Codex, Cursor, etc.).

## Structure minimale

```
skills/
└── mon-skill/
    ├── SKILL.md           # Instructions principales (requis)
    ├── CHANGELOG.md       # Historique des versions (requis)
    ├── EVALS.md           # Évaluations LLM-as-a-judge (optionnel)
    ├── examples/          # Exemples concrets d'outputs attendus
    ├── scripts/           # Scripts exécutables par l'agent
    └── references/        # Fichiers de référence consultés par l'agent
```

**`SKILL.md`** — Le cœur du skill. Contient le frontmatter YAML et les instructions en Markdown que l'agent suit pour accomplir la tâche.

**`CHANGELOG.md`** — Historique des modifications par version. Permet aux utilisateurs qui ont déjà installé le skill de savoir ce qui a changé.

**`EVALS.md`** — Scénarios d'évaluation au format structuré. Optionnel mais recommandé pour valider le comportement du skill via LLM-as-a-judge.

**`examples/`** — Exemples concrets d'outputs attendus (fichiers générés, résultats types). Sert de référence pour l'agent et facilite la rédaction des évaluations.

**`scripts/`** — Scripts que l'agent peut exécuter pendant le skill (validation, transformation, appels CLI). Utile pour déléguer des opérations répétables plutôt que de les décrire en instructions.

**`references/`** — Fichiers consultés par l'agent pendant l'exécution (schémas, listes de valeurs autorisées, specs techniques). Permet de garder `SKILL.md` sous 500 lignes en externalisant les données volumineuses. Le `SKILL.md` indique explicitement quand les consulter.

### SKILL.md - Le cœur du Skill

Le fichier commence par un frontmatter YAML suivi d'instructions en Markdown :

```yaml
---
name: mon-skill
description: >
  Description claire de ce que fait le skill et quand l'utiliser.
  L'agent se base sur cette description pour décider de l'activer automatiquement.
---

## Déclencheurs (Triggers)
Liste des situations où ce Skill doit être activé :
- "créer un rapport"
- "générer une présentation"

## Instructions principales
Étapes détaillées pour accomplir la tâche.

## Règles critiques
- TOUJOURS faire X
- JAMAIS faire Y

## Exemples
Cas d'usage concrets avec résultats attendus.

## Limitations
Ce que le Skill ne fait PAS.
```

### Options du frontmatter

| Champ                      | Description                                                          |
| :------------------------- | :------------------------------------------------------------------- |
| `name`                     | Requis. Identifiant du skill (minuscules, tirets, max 64 caractères) |
| `description`              | Requis. Texte clair d'usage (30 à 500 caractères)                    |
| `disable-model-invocation` | `true` pour invocation manuelle uniquement (`/mon-skill`)            |
| `user-invocable`           | `false` pour masquer du menu `/` (connaissance de fond)              |
| `allowed-tools`            | Liste de strings non vides (`Read`, `Grep`, `Glob`, etc.)            |
| `context`                  | Valeur autorisée: `fork`                                             |
| `agent`                    | Valeurs: `Explore`, `Plan`, `general-purpose`                        |

## Bonnes pratiques d'écriture

### 1. Un skill = une responsabilité

Préférer plusieurs skills ciblés plutôt qu'un skill monolithique. Ne pas enseigner ce que l'agent sait déjà — chaque ligne doit justifier son coût en tokens. Garder `SKILL.md` sous 500 lignes et déplacer les références détaillées dans des fichiers séparés.

### 2. Soyez précis et impératif

```
✅ Bon  : "Commencez TOUJOURS par analyser le fichier avec l'outil approprié"
❌ Mauvais : "Il faudrait peut-être regarder le fichier"
```

Utilisez des mots-clés forts :

- **TOUJOURS** / **JAMAIS** : règles absolues
- **DOIT** / **NE DOIT PAS** : obligations
- **RECOMMANDÉ** : pour les bonnes pratiques
- **CRITIQUE** / **IMPORTANT** : points d'attention

### 3. Incluez des exemples concrets

```markdown
## Exemples de déclencheurs

✅ Doit activer :

- "crée une présentation sur l'IA"
- "fais des slides pour mon pitch"

❌ Ne doit PAS activer :

- "explique comment faire une présentation"
```

### 4. Gérez les cas limites

```markdown
## Gestion des erreurs

Si le fichier existe déjà :

1. Vérifier l'existence
2. Demander confirmation
3. Proposer un nouveau nom
```

### 5. Pas de secrets en dur

Ni clés API, ni mots de passe dans les fichiers du skill.

## Convention de nommage

```
[domaine]-[action]-[format]

✅ Exemples corrects :
- code-review-python
- doc-generator-api
- report-financial-pdf

❌ À éviter :
- my-awesome-skill
- helper
```

Le validateur émet aussi des warnings de qualité si le nom est trop générique, sans tiret, avec segments trop courts, ou purement numériques.

## Évaluations

L'objectif est d'utiliser le LLM comme juge (**LLM-as-a-judge**) pour évaluer automatiquement la qualité d'un skill. Plutôt que d'écrire des tests unitaires, on rédige des scénarios en langage naturel dans un fichier `EVALS.md`. Un agent exécute ensuite chaque scénario avec le skill installé, compare le résultat aux critères de succès attendus, et rend un verdict objectif sur chaque critère.

Cette approche permet de détecter les régressions, de mesurer l'amélioration d'un skill au fil du temps, et de s'assurer qu'il se comporte correctement sur l'ensemble de ses cas d'usage — sans infrastructure de test à maintenir.

### Structure d'une évaluation

```markdown
## Évaluation N : [Titre]

**Input:**
La commande ou question envoyée à l'agent.

**Expected Behavior:**

1. Première action attendue
2. Deuxième action attendue

**Success Criteria:**

- ✅ Critère objectif 1
- ✅ Critère objectif 2

**Category:** [Nom de la catégorie]
```

Les critères de succès doivent être **observables et binaires** — le LLM doit pouvoir répondre oui ou non à chacun sans ambiguïté.

### Exécuter les évaluations

Si vous avez un `EVALS.md`, soumettez-le à l'agent avec le prompt suivant :

```
Lis le fichier EVALS.md et exécute chaque évaluation avec le skill installé.
Pour chaque évaluation, indique quels critères sont ✅ réussis ou ❌ échoués, puis fournis un tableau récapitulatif avec le taux de réussite global.

Format du tableau attendu :

| #   | Évaluation               | Statut | Notes |
|-----|--------------------------|--------|-------|
| 1   | Nom de l'évaluation      | ✅     |       |

**Légende** : ⬜ Non testé | ✅ Réussi | ❌ Échoué | ⚠️ Partiel
```

### Tester et valider localement

```bash
# Valider la structure
node scripts/validate-skills.mjs

# Installer le skill dans un agent
npx skills add . --skill mon-skill

# Cibler un agent spécifique
npx skills add . --skill mon-skill --agent claude-code
npx skills add . --skill mon-skill --agent codex
npx skills add . --skill mon-skill --agent cursor
```

Puis dans l'agent :

- Invocation directe : `/mon-skill`
- Invocation automatique : poser une question qui correspond à la description

### Bonnes pratiques

- Couvrir les cas nominaux, les cas limites et les cas d'erreur
- Garder les critères factuels, pas subjectifs ("génère 5-8 tags" plutôt que "génère de bons tags")
- Viser un minimum de 5 évaluations par skill
- Considérer le skill comme stable à partir de 85% de réussite

## CLI skills.sh

Toutes les commandes s'utilisent via `npx skills <commande>`.

### Créer un skill

```bash
npx skills init mon-skill
```

Génère un template `SKILL.md` prêt à compléter.

### Installer un skill

```bash
# Depuis un repo GitHub
npx skills add owner/repo --skill mon-skill

# Depuis ce repo
npx skills add eleven-labs/skills --skill <nom-du-skill>

# Depuis un chemin local
npx skills add ./mon-dossier --skill mon-skill

# Installation globale (tous les projets)
npx skills add owner/repo --skill mon-skill --global

# Cibler un agent spécifique
npx skills add owner/repo --skill mon-skill --agent claude-code

# Installer tous les skills d'un repo sans confirmation
npx skills add owner/repo --all

# Lister les skills disponibles dans un repo sans installer
npx skills add owner/repo --list
```

### Gérer les skills installés

```bash
# Lister les skills installés
npx skills list          # alias: npx skills ls
npx skills list --global # uniquement les globaux

# Chercher un skill
npx skills find "react testing"

# Vérifier les mises à jour
npx skills check

# Mettre à jour tous les skills
npx skills update

# Supprimer un skill
npx skills remove mon-skill              # alias: npx skills rm
npx skills remove mon-skill --global     # supprimer du scope global
npx skills remove --all                  # supprimer tous les skills
```

## Publication sur skill.sh

Les skills apparaissent automatiquement sur [skills.sh](https://skills.sh) quand des utilisateurs les installent via `npx skills add`. Il n'y a pas de commande `publish` — il suffit d'héberger le repo sur GitHub.

### Versioning (Semantic Versioning)

La version du skill est déclarée dans le frontmatter de `SKILL.md` :

```yaml
---
name: mon-skill
version: 1.2.0
description: ...
---
```

Suivez les règles [Semantic Versioning](https://semver.org/) :

- **1.0.0** → **2.0.0** : Changements incompatibles (instructions restructurées, comportement modifié)
- **1.0.0** → **1.1.0** : Nouvelles fonctionnalités (nouveaux cas d'usage couverts)
- **1.0.0** → **1.0.1** : Corrections de bugs (clarification d'une règle, correction d'un exemple)

### Changelog

Chaque skill doit inclure un fichier `CHANGELOG.md` pour tracer l'historique des modifications. C'est particulièrement important pour les utilisateurs qui ont déjà installé le skill et veulent savoir ce qui a changé.

### CI

La CI valide automatiquement les skills sur chaque PR touchant `skills/` (`validate.yml`) en exécutant `scripts/validate-skills.mjs` pour vérifier la structure, le frontmatter et les conventions de nommage.

## Checklist avant publication

- [ ] `SKILL.md` complet avec frontmatter valide (`name` + `description`)
- [ ] Nom descriptif unique au format `[domaine]-[action]-[format]`
- [ ] (Optionnel) `EVALS.md` avec 5+ évaluations couvrant cas nominaux et cas d'erreur
- [ ] Testé avec taux de réussite ≥ 85%
- [ ] `SKILL.md` < 500 lignes
- [ ] Gestion des cas limites documentée
- [ ] `CHANGELOG.md` à jour
- [ ] Aucun secret en dur

## Ressources

- [Agent Skills specification](https://agentskills.io)
- [Documentation skills.sh](https://skills.sh/docs/cli)
- [Documentation Skills - Claude Code](https://code.claude.com/docs/en/skills)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)
- [Anthropic Skill Creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- [Skills in OpenAI API](https://developers.openai.com/cookbook/examples/skills_in_api/)
