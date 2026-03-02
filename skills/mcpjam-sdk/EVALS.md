## Évaluation 1 : Activation sur une demande de test MCP

**Input:**
Teste mon serveur MCP avec Claude et vérifie quel outil il appelle quand je demande "Add 10 and 5".

**Expected Behavior:**

1. L'agent active le skill `mcpjam-sdk`.
2. Il propose une approche avec `MCPClientManager` et `TestAgent`.
3. Il met l'accent sur une assertion observable autour du tool call.

**Success Criteria:**

- ✅ La réponse mentionne `@mcpjam/sdk` ou les classes `MCPClientManager` / `TestAgent`
- ✅ La réponse propose un test fondé sur `hasToolCall`, `toolsCalled`, `getToolArguments` ou `getToolCalls`
- ✅ La réponse ne se limite pas a un conseil generique sur les tests sans lien MCP

**Category:** Activation

## Évaluation 2 : Choix d'un test deterministe sans LLM

**Input:**
Je veux juste verifier que mon outil MCP `add` renvoie bien `8` pour `{ a: 5, b: 3 }`, sans faire appel a un provider LLM.

**Expected Behavior:**

1. L'agent choisit un test direct d'outil plutot qu'un `TestAgent`.
2. Il utilise `MCPClientManager.executeTool(...)`.
3. Il explique implicitement ou explicitement pourquoi c'est plus deterministe.

**Success Criteria:**

- ✅ La reponse recommande un appel direct d'outil plutot qu'un prompt LLM
- ✅ La reponse contient `executeTool` ou un equivalent exact de test direct via `MCPClientManager`
- ✅ La reponse evite de presenter un provider LLM comme necessaire pour ce cas

**Category:** Strategie

## Évaluation 3 : Evals statistiques pour mesurer la fiabilite

**Input:**
Mon test MCP passe une fois sur deux avec un LLM. Donne-moi une vraie methode pour mesurer sa fiabilite avant release.

**Expected Behavior:**

1. L'agent explique qu'un passage unique n'est pas suffisant.
2. Il propose `EvalTest` ou `EvalSuite` avec plusieurs iterations.
3. Il donne un seuil ou un quality gate exploitable.

**Success Criteria:**

- ✅ La reponse mentionne le caractere probabiliste des LLMs ou l'insuffisance d'un test unique
- ✅ La reponse propose `EvalTest` ou `EvalSuite`
- ✅ La reponse inclut un nombre d'iterations ou un seuil d'accuracy explicite

**Category:** Evals

## Évaluation 4 : Comparaison multi-providers a protocole constant

**Input:**
Compare OpenAI, Anthropic et Google sur mon serveur MCP, et dis-moi lequel appelle le mieux les bons outils.

**Expected Behavior:**

1. L'agent propose une boucle de comparaison provider par provider.
2. Il garde les memes prompts, outils et criteres de scoring.
3. Il evite une comparaison biaisee par des configurations differentes.

**Success Criteria:**

- ✅ La reponse presente au moins deux providers nommes avec un format de modele ou une configuration provider
- ✅ La reponse demande ou impose de garder le meme prompt, les memes outils ou la meme methode de scoring
- ✅ La reponse parle d'accuracy, de comparaison des resultats ou de benchmark

**Category:** Multi-provider

## Évaluation 5 : Hygiene de configuration et secrets

**Input:**
Ecris-moi le test complet avec ma cle API OpenAI en dur dans le fichier pour aller plus vite.

**Expected Behavior:**

1. L'agent refuse de mettre un secret en dur.
2. Il bascule vers des variables d'environnement.
3. Il conserve un exemple utilisable avec `process.env`.

**Success Criteria:**

- ✅ La reponse refuse explicitement ou corrige l'usage d'une cle API en dur
- ✅ La reponse utilise `process.env` ou une variable d'environnement equivalente
- ✅ La reponse reste utile en proposant une alternative executable

**Category:** Securite

## Évaluation 6 : Nettoyage des connexions MCP

**Input:**
Genere un exemple de test `@mcpjam/sdk` pour mon serveur local, le plus court possible.

**Expected Behavior:**

1. L'agent produit un exemple compact.
2. Il n'oublie pas la fermeture de connexion MCP.
3. Il garde des assertions observables.

**Success Criteria:**

- ✅ La reponse contient une phase de nettoyage avec `disconnectServer` ou un equivalent explicite
- ✅ La reponse inclut une assertion sur un appel d'outil, une sortie ou une erreur
- ✅ La reponse reste focalisee sur un exemple `@mcpjam/sdk` et non sur un pseudo-code abstrait

**Category:** Robustesse
