# Agents de review

Catalogue des agents et workflows de code review IA que nous utilisons ou avons évalués.

## Légende

| Icône | Signification                                           |
| ----- | ------------------------------------------------------- |
| ✅    | Recommandé — améliore réellement la qualité des reviews |
| ⚠️    | Avec réserves — utile mais avec des limites             |
| ❌    | Non recommandé — bruit excessif ou faux positifs        |

## Agents recommandés

<!-- Ajoutez ici les agents recommandés en suivant la structure :

### Nom de l'agent

- **Source** : [lien](https://...)
- **Type** : GitHub Action / GitHub App / CLI / Autre
- **Description** : Ce que fait l'agent en une phrase.
- **Contexte d'utilisation** : Sur quels types de PR on l'utilise.
- **Coût** : Gratuit / payant / token-based.

| Avis | Par     | Retour d'expérience                          |
| :--: | :------ | :------------------------------------------- |
|  ✅  | @pseudo | Qualité des commentaires, pertinence, bruit. |

-->

### Codex Code Review

- **Source** : [`openai/codex-action`](https://github.com/openai/codex-action) | [Documentation](https://developers.openai.com/codex/cloud/code-review)
- **Type** : GitHub App + GitHub Action
- **Description** : Review automatique de PR par OpenAI Codex. Poste des commentaires inline avec filtrage par sévérité (P0/P1). Supporte les guidelines personnalisées via `AGENTS.md` et les instructions ad-hoc (`@codex review`). Mode automatique disponible sur chaque nouvelle PR.
- **Contexte d'utilisation** : Projets personnels.
- **Coût** : Inclus dans l'abonnement ChatGPT Plus ($20/mois) ou Pro ($200/mois), ou pay-per-token via API.

| Avis | Par       | Retour d'expérience                                                                                            |
| :--: | :-------- | :------------------------------------------------------------------------------------------------------------- |
|  ⚠️  | @fpasquet | Trop peu utilisé pour avoir un avis tranché. Testé sur des projets personnels uniquement. À évaluer davantage. |

### OpenCode

- **Source** : [`opencode-ai/opencode`](https://github.com/opencode-ai/opencode) | [Site](https://opencode.ai/)
- **Type** : GitHub App + GitHub Action (open source, MIT)
- **Description** : Agent IA open source qui fonctionne en terminal, desktop et IDE. Son intégration GitHub permet de reviewer des PR, implémenter des fixes et soumettre des PR en autonomie. Se déclenche via `/opencode` ou `/oc` dans les commentaires. Supporte 10+ fournisseurs LLM (Claude, GPT, Gemini, Bedrock, Groq, OpenRouter...) avec votre propre clé API.
- **Contexte d'utilisation** : Projets client, avec une clé API propre.
- **Coût** : Coût des tokens du fournisseur LLM choisi.

_Aucun retour pour le moment._

### Greptile

- **Source** : [greptile.com](https://www.greptile.com) | [GitHub App](https://github.com/apps/greptile-apps)
- **Type** : GitHub App (+ GitLab)
- **Description** : Plateforme de code review qui indexe l'intégralité du codebase pour construire un graphe de code. Revoit les PR avec le contexte complet du projet (pas seulement le diff). Génère des résumés de PR avec diagrammes de séquence, commentaires inline avec score de confiance, et règles personnalisables en langage naturel. Apprend des retours de l'équipe (thumbs up/down). SOC 2 compliant, option self-hosted.
- **Contexte d'utilisation** : Non encore testé.
- **Coût** : $30/dev/mois. Essai gratuit 14 jours. 100% gratuit pour l'open source.

_Aucun retour pour le moment._

## Agents non recommandés

_Aucun agent référencé pour le moment._

<!-- Ajoutez ici les agents non recommandés sous forme libre :
### ❌ Nom de l'agent
- **Source** : [lien](https://...)
- **Raison du rejet** : Trop de bruit, faux positifs, commentaires génériques...
- **Alternative** : Agent ou approche alternative.
-->

## Comment contribuer

1. Utilisez l'agent sur des PRs avant de donner un avis
2. Ajoutez une entrée en suivant la structure existante
3. Ajoutez votre avis dans le tableau avec votre `@pseudo` — plusieurs avis par agent sont encouragés
4. Indiquez le coût réel (tokens consommés, abonnement...)
