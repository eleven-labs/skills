# Serveurs MCP

Catalogue des serveurs [Model Context Protocol](https://modelcontextprotocol.io/) que nous utilisons ou avons évalués.

## Légende

| Icône | Signification                                  |
| ----- | ---------------------------------------------- |
| ✅    | Recommandé — apporte une vraie valeur ajoutée  |
| ⚠️    | Avec réserves — utile dans certains cas précis |
| ❌    | Non recommandé — peu fiable ou peu utile       |

## Serveurs recommandés

<!-- Ajoutez ici les serveurs recommandés en suivant la structure :

### Nom du serveur

- **Source** : [lien](https://github.com/...)
- **Description** : Ce que fait le serveur en une phrase.
- **Cas d'usage** : Quand et pourquoi on l'utilise.
- **Agents compatibles** : Claude Code, Codex, Cursor...
- **Configuration** :
  ```json
  {
    "mcpServers": {
      "nom": {
        "command": "...",
        "args": ["..."]
      }
    }
  }
  ```

| Avis | Par     | Retour d'expérience              |
| :--: | :------ | :------------------------------- |
|  ✅  | @pseudo | Ce qui marche bien, les limites. |

-->

### chrome-devtools-mcp

- **Source** : [`ChromeDevTools/chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- **Description** : Serveur MCP qui donne aux agents IA le contrôle complet de Chrome DevTools — inspection du DOM, console, réseau, performance, screenshots et automatisation. 29 outils disponibles couvrant l'input automation, la navigation, le debugging, l'analyse de performance (traces, Lighthouse) et l'émulation d'appareils.
- **Cas d'usage** :
  - Corriger des problèmes UI/UX en donnant à l'agent un accès visuel au rendu navigateur
  - Comparer un environnement de production et un dev local pour détecter les régressions
  - Débugger des erreurs JavaScript en inspectant la console du navigateur
  - Auditer les performances (traces, Lighthouse, snapshots mémoire)
- **Agents compatibles** : Claude Code, Codex ...
- **Configuration** :
  ```json
  {
    "mcpServers": {
      "chrome-devtools": {
        "command": "npx",
        "args": ["-y", "chrome-devtools-mcp@latest"]
      }
    }
  }
  ```

| Avis | Par       | Retour d'expérience                                                                                                                                                                                                                                                                                                                                                  |
| :--: | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  ✅  | @fpasquet | Utilisé pour corriger des problèmes UI/UX, comparer prod vs dev pour vérifier l'absence de régressions, et débugger des erreurs JS via l'inspection de la console navigateur. L'agent peut voir et agir sur le rendu réel, ce qui change la donne pour le debug front-end. Plus performant et plus rapide avec Codex qu'avec Claude Code pour la résolution de bugs. |

## Serveurs non recommandés

_Aucun serveur référencé pour le moment._

<!-- Ajoutez ici les serveurs non recommandés sous forme libre :
### ❌ Nom du serveur
- **Source** : [lien](https://github.com/...)
- **Raison du rejet** : Pourquoi on ne le recommande pas.
- **Alternative** : Serveur ou approche alternative.
-->

## Comment contribuer

1. Testez le serveur MCP sur au moins un projet
2. Ajoutez une entrée en suivant la structure existante
3. Ajoutez votre avis dans le tableau avec votre `@pseudo` — plusieurs avis par serveur sont encouragés
4. Incluez la configuration type pour faciliter l'adoption
