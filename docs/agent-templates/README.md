# Templates d'AGENTS.md

Collection de templates d'`AGENTS.md` prêts à l'emploi, organisés par stack ou catégorie.

## Qu'est-ce qu'un AGENTS.md ?

Un fichier `AGENTS.md` placé à la racine d'un projet fournit des instructions persistantes à l'agent IA. Il décrit les conventions du projet, les patterns à suivre, les outils à utiliser, et les erreurs à éviter.

## Organisation

Les templates sont organisés par stack ou catégorie :

```
agent-templates/
├── README.md              # Ce fichier
├── <stack>.md             # Template par stack (ex: fullstack-typescript.md)
└── <categorie>.md         # Template par catégorie (ex: monorepo.md)
```

## Comment utiliser un template

1. Choisissez le template le plus proche de votre stack
2. Copiez-le à la racine de votre projet sous le nom `AGENTS.md`
3. Adaptez les sections à votre projet (supprimez ce qui ne s'applique pas, ajoutez vos spécificités)
4. Commitez le fichier dans le repo

## Comment contribuer un template

1. Créez un fichier `<nom-de-stack>.md` dans ce dossier
2. Suivez la structure recommandée ci-dessous
3. Basez-vous sur une expérience réelle de projet

### Structure recommandée

```markdown
# AGENTS.md — [Nom de la stack]

> Description courte : pour quel type de projet ce template est adapté.

## Contexte projet

- Stack technique
- Architecture
- Conventions de nommage

## Commandes essentielles

- Build, test, lint, deploy...

## Conventions de code

- Patterns à suivre
- Anti-patterns à éviter

## Structure du projet

- Arborescence type
- Rôle des dossiers clés

## Règles critiques

- TOUJOURS faire X
- JAMAIS faire Y

## Outils et dépendances

- Outils spécifiques à connaître
- Configuration particulière
```

## Templates disponibles

| Template           | Description                                                                                                                                                                                   |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [base.md](base.md) | Template générique agnostique de stack. Contient toutes les sections à compléter : présentation, stack, architecture, conventions, commandes, bonnes pratiques, workflows et changelog agent. |
