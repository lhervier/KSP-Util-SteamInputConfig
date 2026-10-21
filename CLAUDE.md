# KSP-Util-SteamInputConfig — notes de développement

Ce dépôt produit les configurations Steam Input (`.vdf`) du mod **KSP-Mod-SteamInput** : la disposition
du Steam Controller v2 sur les **6 action sets natifs de Squad** (`MenuControls`, `FlightControls`,
`DockingControls`, `EditorControls`, `MapControls`, `EVAControls`), que Steam sert sans aucun fichier
`controller_config`. Lionel les tient dans git plutôt que dans l'interface de Steam : un comportement qui
se répète en plusieurs endroits s'y change une fois, et chaque modification se relit.

- `SteamInputConfig\` : les fragments (bindings, inputs, groups, presets, réglages, localisation) et
  `controllers.json` (une seule manette pour l'instant : `steamcontroller_v2`).
- `MergeScripts\` : l'outil qui les fusionne (`merge-controller.js`, node).
- `build.bat` / `build.sh` : `npm ci`, fusion, copie dans `Release\` d'un `.vdf` par langue de clavier.

La disposition est montrée par deux pages (artefacts claude.ai, publiques) : en anglais pour le README
(<https://claude.ai/artifact/Ujeyfu9dcMrKzdZHCv54g6>, sans les points de travail) et en français, la
copie de travail avec « À vérifier en jeu » (<https://claude.ai/artifact/LinLom7CUPZ83rWt8NwNnW>).
**Toute modification de la disposition se reporte dans les deux.**

Le `.vdf` se diffuse par Steam : l'importer dans l'interface Steam Input de KSP, puis le partager
(« Configurations de la communauté »). Le joueur n'a plus de fichier à copier.

## Fichiers de contexte — à ouvrir au besoin, PAS par défaut

- **[CLAUDE-disposition-squad.md](CLAUDE-disposition-squad.md)** — **la disposition elle-même** : les 6
  sets lus dans le plugin de Squad, le repli des contextes du mod sur eux, les raccourcis du bouton Steam,
  Linux et les claviers non américains, les principes (gâchettes = clics, palettes hautes = Maj/Ctrl,
  palette basse droite = shift), le squelette et les différences par set, ce qui reste à vérifier.
  **À lire avant de toucher à une entrée de la disposition.**
- **[CLAUDE-format-vdf.md](CLAUDE-format-vdf.md)** — **le format** : bindings, inputs, groups, presets,
  mode shift, layers, appui combiné (`chord`). **À lire avant de toucher au contenu d'une configuration.**
- **[CLAUDE-generation-config.md](CLAUDE-generation-config.md)** — **le générateur** : refs VDF,
  paramètres d'inclusion, variables de manette, helpers handlebars. **À lire avant de toucher aux
  templates ou au script.**

## Règles

- **Les noms des presets sont un contrat avec le jeu** : ce sont les noms des action sets du plugin de
  Squad, à la casse près (`EVAControls`, pas `EvaControls`). Windows ne distingue pas la casse des noms
  de fichiers : renommer un preset en ne changeant que la casse demande un passage par un nom temporaire.
- **Aucun layer** (`action_layers`) : on ne sait pas si une configuration peut en déclarer sur le manifeste
  natif de Squad. **Un seul mode shift par zone** (Steam refuse les autres).
- **Le pad droit (la souris) n'est jamais shifté** : on tient souvent la palette basse droite, prêt à
  couper les gaz, tout en déplaçant la caméra à la souris.
- **Plein gaz / coupure = appui combiné** palette basse droite + palette haute droite / gauche. Le numéro
  du bouton à tenir (`chord_button`) vient de `controllers.json` (`chordBackRight`) ; tant qu'il n'y est
  pas, ces deux commandes ne sont pas générées.
- **Un fragment que plus rien ne référence se supprime** : le dépôt ne garde que ce qui sert.

Les connaissances KSP transverses sont dans le [`CLAUDE.md` parent](../CLAUDE.md) de `kspmod\`.
