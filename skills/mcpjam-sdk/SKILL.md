---
name: mcpjam-sdk
description: Implement tests, evals, and provider comparisons for MCP servers with @mcpjam/sdk when users want to validate MCP tools with real LLMs, benchmark provider accuracy, or write deterministic and statistical checks for MCP server behavior.
---

# @mcpjam/sdk

Skill pour tester, evaluer et comparer des serveurs MCP avec le SDK TypeScript `@mcpjam/sdk`.

## Quand utiliser ce skill

Active ce skill quand l'utilisateur veut :

- tester un serveur MCP avec un vrai provider LLM
- ecrire des tests unitaires, d'integration ou e2e autour d'outils MCP
- mesurer une accuracy sur plusieurs iterations
- comparer plusieurs providers sur le meme serveur MCP
- transformer des verifications manuelles en evals reproductibles

## Workflow

1. Identifie le type de serveur MCP cible : STDIO local, HTTP/SSE distant, ou multi-serveurs.
2. Choisis le niveau de test minimum necessaire :
   - appel direct d'outil via `MCPClientManager` pour un test deterministe
   - `TestAgent` pour verifier selection d'outil, arguments, latence et erreurs
   - `EvalTest` ou `EvalSuite` pour mesurer la fiabilite statistique
3. Regle les tests LLM pour la reproductibilite :
   - temperature basse, typiquement `0` a `0.2`
   - `maxSteps` borne
   - iterations adaptees au risque et au cout
4. Si plusieurs providers sont compares, garde exactement le meme prompt, le meme set d'outils et la meme methode de scoring.
5. Termine toujours par un nettoyage explicite des connexions MCP.

## Regles critiques

- TOUJOURS commencer par verifier si un test direct sans LLM suffit.
- TOUJOURS preferer des assertions observables : outil appele, arguments, sortie, erreur, latence, accuracy.
- TOUJOURS expliquer qu'un test unique avec LLM ne prouve pas la fiabilite.
- NE PAS presenter une accuracy comme stable si le nombre d'iterations est trop faible.
- NE PAS comparer des providers avec des prompts, temperatures ou outils differents.
- NE PAS mettre de cles API en dur dans le code ou dans le skill.

## References a lire selon le besoin

- Connexion serveur, `TestAgent`, evals, providers, et exemple complet : [references/sdk-reference.md](references/sdk-reference.md)
- Exemple de test Vitest minimal : [examples/vitest-example.ts](examples/vitest-example.ts)

Lis uniquement le fichier pertinent au besoin de l'utilisateur. Ne charge pas toute la reference si une seule section suffit.

## Resultat attendu

Le livrable doit en general contenir :

- un setup `MCPClientManager` adapte au mode de connexion
- soit un test direct d'outil, soit un test `TestAgent`, soit une `EvalSuite`
- des assertions factuelles sur les appels d'outils
- une configuration explicite du provider et des variables d'environnement attendues
- une fermeture propre des connexions

## Limitations

- Le skill ne remplace pas la documentation officielle du SDK.
- Si l'API exacte du SDK est critique, verifier les symboles et signatures sur la doc officielle avant de coder.
