# Une disposition Steam Controller v2 sur les 6 sets de Squad

Ce que Squad livre pour la Steam Input (plugin, manifeste, configuration), ce que les 12 sets du mod
apportent vraiment, et une proposition de disposition pour le Steam Controller v2 qui n'utilise que
les 6 sets natifs du jeu, pour supprimer l'étape `controller_config` de l'installation.

> Fichier de contexte de **KSP-Util-SteamInputConfig** (et du mod **KSP-Mod-SteamInput**). Vue d'ensemble dans [CLAUDE.md](CLAUDE.md).
> Proposition du 2026-10-21, revue une fois par Lionel le même jour (gaz sur les palettes hautes,
> une seule liste par stick, générateur gardé à part), **pas encore testée en jeu**.

## Sommaire

- **Ce que Squad livre** — plugin `KSPSteamCtrlr.dll`, ses 6 action sets (`MenuControls`,
  `FlightControls`, `DockingControls`, `EditorControls`, `MapControls`, `EVAControls`), le choix du
  set par contexte, le mode manœuvre qui tombe sur Menu depuis 1.6.
- **La configuration Squad, set par set** — workshop 1411808523 (Steam Controller v1) : pads,
  grips, touch menus, gâchettes ; ce qui lui manque.
- **Ce que Steam en a fait sur le v2** — `squad_0.vdf` (`controller_triton`) : conversion
  automatique, Map perdu à cause de notre manifeste.
- **Ce que les 12 sets du mod apportent vraiment** — des libellés plus que des fonctions ; table de
  repli des 12 contextes sur les 6 sets Squad.
- **Les raccourcis du bouton Steam** — chords par défaut de Valve pour le v2 (`chord_triton.vdf`) :
  Steam + X = clavier, Steam + croix = Échap/Entrée/Tab, Steam + gâchettes = clics.
- **Les listes sur un stick** — hotbar : bas affiche, gauche/droite naviguent, haut valide ; une
  seule liste par modeshift de stick.
- **Linux et claviers non américains** — issue steam-for-linux #13220 : lettres A/Q/W/Z/M et
  ponctuation (`[` `]` `` ` `` `\` `'` `;` `.` `/` pavé `.`) faussées ; touches de la disposition
  touchées, pistes.
- **Les principes de la proposition** — gâchettes = clics, palettes hautes = Maj/Ctrl (gaz),
  palette R-bas = shift, L-bas = Alt, « ← arrière / → avant », émulation analogique.
- **Le squelette commun** — table complète des entrées du v2 en vol, normal et palette maintenue.
- **Les différences par set** — Amarrage, Carte (et station de suivi), AEV (et construction),
  Éditeur (et Mission Builder), Menu.
- **Où c'est implémenté** — nouveau `KSP-Mod-SteamInput` (6 sets, sans cheatsheet), ce dépôt (config
  v2 générée), l'ancien mod renommé `KSP-Mod-SteamInputExtended` ; diffusion par le Workshop.
- **À vérifier en jeu** — manifeste natif servi par Steam, Retour arrière en carte, F9 maintenu,
  touch menu sur le pad, émulation analogique, boutons ⧉/☰.
- **Défauts repérés au passage** — touches AZERTY codées en dur dans la build anglaise.

## Ce que Squad livre

Le plugin `GameData\Squad\Plugins\KSPSteamCtrlr.dll` (classe `SteamController.KSPSteamController`,
lu le 2026-10-21) demande à Steam **6 action sets**, par leur nom exact :
`MenuControls`, `FlightControls`, `DockingControls`, `EditorControls`, `MapControls`,
`EVAControls` (attention : `EVA` en capitales, et un seul `MapControls`). Ce manifeste est celui que
Steam sert pour l'appli 220200 quand aucun `controller_config\game_actions_220200.vdf` ne le
remplace : l'utilisateur n'a rien à installer.

Les sets ne portent **aucune action de jeu** : toutes les entrées de la configuration Squad sont des
touches clavier ou des clics souris. Le set ne sert qu'à choisir la disposition.

Choix du set (`GetModeForCurrentContext`) :

| Contexte | Set |
|---|---|
| Vol, `FlightUIMode` 0 (étages) | Flight, ou EVA si le vaisseau actif est un Kerbal |
| Vol, `FlightUIMode` 1 (amarrage) | Docking, ou EVA |
| Vol, `FlightUIMode` 2 (carte) | Map (Flight si manœuvre active hors carte) |
| Vol, tout autre `FlightUIMode` | **Menu** (cas par défaut) |
| Station de suivi (scène 8) | Map |
| VAB/SPH, Mission Builder (scène 21) | Editor |
| Pause, tout le reste | Menu |

Depuis 1.6, le mode manœuvre est un `FlightUIMode` à part (3/4) : il tombe dans le cas par défaut
et la manette passe en **Menu** au milieu du vol. C'est la panne décrite dans le README (issue
#22165). Le plugin ne réagit qu'à `onLevelWasLoaded`, pause, `OnFlightUIModeChanged`,
`OnMapEntered`, changement de vaisseau.

## La configuration Squad, set par set

Source : `steamapps\workshop\content\241100\1411808523\*_legacy.bin`, Steam Controller v1
(`controller_steamcontroller_gordon`). Philosophie : la manette **est** un clavier et une souris.

- **Commun** : Back (`button_escape`) = Échap (long : F3 journal), Start (`button_menu`) = M carte
  (long : Suppr, mode amarrage) ; LB/RB = Q/E roulis ; **grip gauche = mode shift de tout**, grip
  droit = Alt.
- **Pad gauche** : molette (zoom), clic = clic gauche ; shifté : **touch menu de 16 cases** (groupes
  1 à 10, F5, F9, F10, F11, F3, F2).
- **Pad droit** : souris, **clic = clic droit** (menus de pièces, caméra en glisser), double tape =
  mouselook ; shifté : touch menu (L, U, G, R, Abort, Inser, Suppr).
- **Stick** : WASD avec **émulation analogique** (`analog_emulation_period` 54,
  `duty_cycle_pct` 7 : un stick à moitié penché envoie la touche par impulsions, donc un contrôle
  proportionnel sans axe de manette), clic = clic milieu ; shifté : V/C caméra, `[`/`]` vaisseaux,
  clic = navball.
- **ABXY** : A Espace (étage), B freins, X RCS, Y SAS ; shifté : Tab, Verr. maj (précision),
  `,`/`.` (warp).
- **Gâchettes en vol** : course partielle = Maj/Ctrl (gaz), **clic de fin de course = Z/X** (plein
  gaz / coupure) sur la même gâchette.
- **Menu, Carte, Éditeur** : gâchettes = clic gauche (RT) / clic droit (LT). En carte, A = navball,
  B = quitter la carte, LB = Retour arrière, RB = Tab.
- **Éditeur** : ABXY = Espace / Suppr / X / C, Back/Start = refaire/annuler, grips = Maj/Alt, clic
  des pads = mode shift vers les outils 1-4 et F/R.
- **AEV** : comme le vol ; shifté : U lampe, B embarquer, warp.

Ce qui lui manque : le mode manœuvre (cf. « Ce que Squad livre »), la construction en AEV, la
translation RCS hors mode amarrage, le trim, les surcouches F10-F12, et ses groupes d'action sont
dans un touch menu qu'il faut regarder pour viser.

## Ce que Steam en a fait sur le v2

`Steam Controller Configs\<id>\config\220200\squad_0.vdf` est la conf Squad **convertie
automatiquement** pour le v2 (`controller_triton`) : Steam a recopié les groupes du pad gauche sur la
croix et ceux du pad droit sur le stick droit, et rempli les palettes hautes (L = `.` warp, R = Verr.
maj). Comme notre `controller_config\game_actions_220200.vdf` était installé, la liste des sets est
la nôtre : le preset **`MapControls` a disparu** (absent de notre manifeste) et nos sets en plus
sont vides. Pour lire la conf Squad d'origine, partir du `.bin` du workshop, pas de cet export.

## Ce que les 12 sets du mod apportent vraiment

Comme chez Squad, tout est touche clavier ou souris. Deux contextes qui envoient les mêmes touches
pour la même entrée peuvent donc partager un set : on ne perd que le **libellé** (et la justesse de
la cheatsheet). « En amarrage, plus de contrôles de vol » vient de KSP, pas du set : `THROTTLE_UP`
est `new KeyBinding(KeyCode.LeftShift, InputBindingModes.Staging)`, la même touche Maj translate en
mode amarrage. Nos `MapFlightControls` et `MapDockingControls` envoyaient déjà les mêmes touches (à
l'appui long Suppr près, sur X dans l'un et Y dans l'autre). Pistes pour le libellé : libellé double
dans le `.vdf` (« tangage / translation »), et une cheatsheet qui choisit le libellé selon le
contexte connu du plugin. Les vraies différences de disposition entre nos 12 sets sont rares (Tab sur les
gâchettes hautes en station de suivi, clics en Menu/Éditeur). Repli proposé :

| Contexte du mod | Set Squad | Remarque |
|---|---|---|
| Menu, KSC, bâtiments, pause | `MenuControls` | |
| VAB, SPH | `EditorControls` | |
| Mission Builder | `EditorControls` | comme Squad ; notre preset est déjà un éditeur |
| Vol, **mode manœuvre** | `FlightControls` | le correctif du mod reste nécessaire |
| FreeIVA | `FlightControls` | ses touches (Y, F, V, C, X, Maj/Ctrl, ZQSD) tombent sur des entrées du vol |
| Amarrage | `DockingControls` | |
| Carte (vol, amarrage, AEV), station de suivi | `MapControls` | mêmes touches ; KSP garde en carte le mode d'avant (étages ou amarrage) et les interprète lui-même (observé par Lionel, 2026-10-21 ; code : `FlightUIModeController.OnMapViewEnter` passe en `MAPMODE` puis revient aussitôt à `_lastMode`, et `InputBinding.CompareSwitchState` ne lit que `Mode == DOCKING` + `linRotState`) |
| AEV, construction AEV | `EVAControls` | les outils 1/2/3 passent par la hotbar |

## Les raccourcis du bouton Steam

Tant que le bouton Steam est tenu, Steam remplace la disposition du jeu par sa « configuration des
raccourcis » (chord). Celle par défaut du v2 est `Steam\controller_base\chord_triton.vdf` ; aucune
surcharge perso pour le v2 sur le fixe (2026-10-21), donc **tout utilisateur l'a, sans rien
installer** :

| Steam + | Action |
|---|---|
| RT / LT | clic gauche / clic droit |
| pad droit | souris, appui = clic gauche ; stick droit = souris aussi |
| X (au relâché) | clavier virtuel |
| croix ← / → / ↓ / ↑ | Échap / Entrée / Tab / clip d'enregistrement |
| RB | capture Steam |
| LB | loupe (tant que tenu) |
| ⧉ / ☰ | Alt+Tab / lecteur d'écran |
| stick gauche ↑ / ↓ | volume |
| L-bas / L-haut | marqueur / marche-arrêt de l'enregistrement de jeu |
| B long (2,4 s) / Y | quitter le jeu / éteindre la manette |

Conséquences :

- Le clavier virtuel n'a plus besoin d'un appui long sur ☰ ; Entrée/Échap/Tab sont aussi là.
- Ce que l'utilisateur a pu changer dans ses propres raccourcis nous échappe : n'y renvoyer que pour
  le confort, jamais pour une fonction que la disposition n'offrirait pas autrement.
- Piste pour la cheatsheet du mod : afficher aussi ces raccourcis, lus dans `chord_triton.vdf`.

## Les listes sur un stick

Une liste (mode `hotbar`) posée sur un stick se pilote ainsi, d'après l'usage de Lionel : **bas**
l'affiche, **gauche/droite** naviguent, **haut** valide. On ne peut donc pas mettre une liste sur
modeshift + stick gauche et une autre sur le stick droit. La proposition n'a qu'**une** liste (R-bas +
stick gauche = rangée de chiffres) ; le stick droit shifté est une croix (I/J/K/L), pas une liste.

## Linux et claviers non américains

Issue de Lionel, `ValveSoftware/steam-for-linux#13220` (aussi `ublue-os/bazzite#3464`), mesurée avec
`xev` sous Ubuntu 26.04 en AZERTY : sous Windows, Steam Input envoie la **position** de la touche
QWERTY liée ; sous Linux, il envoie pour certaines touches le **caractère**, et plusieurs touches
QWERTY tombent sur le même code.

- Justes : F1-F12, Échap, chiffres, Tab, Verr. maj, Maj, Ctrl, Alt gauche, Espace, Entrée, Inser,
  Suppr, Origine, Fin, Page haut/bas, flèches, pavé numérique sauf `.`, et les lettres placées pareil
  en AZERTY (E R T Y U I O P S D F G H J K L X C V B N).
- Faussées (caractère au lieu de position) : A, Q, W, Z, M.
- Collisions sans remède côté Steam : `[` (sur 5), `]`, `` ` ``, `\`, `'`, `;` et `.` (même code),
  `/`, `-`, pavé `.`, Alt droit (rien).

Touches de la disposition touchées : W/A (tangage, lacet), Q (roulis), Z (plein gaz), M (carte),
`,`/`.` (warp, à confirmer : le tableau de l'issue et son texte divergent pour `.`), `[`/`]`
(changer de vaisseau), pavé `.` (navball), `` ` `` (recentrer la caméra), `\` (arrêt du warp).

Pistes, aucune validée :

- **Une table clavier par système** dans le générateur (`french-windows`, `french-linux`) : pour
  les lettres, Linux suit le caractère, on peut donc viser juste.
- Pour les collisions, aucune table n'y peut rien. Le plugin pourrait donner à KSP, **en mémoire
  seulement** (sans `settings.cfg`), une **touche secondaire** sûre (pavé numérique, Origine/Fin…)
  aux actions concernées, et la build Linux viserait ces touches. Généralisé à toutes les actions,
  cela rendrait la disposition indépendante de la langue sur les deux systèmes ; à creuser
  (`GameSettings`, ce qui se passe si le joueur ouvre puis enregistre ses réglages).
- En attendant, ne mettre sur une touche faussée que ce que l'interface de KSP offre aussi à la
  souris (warp, navball, changement de vaisseau en carte).

## Les principes de la proposition

1. **Gâchettes = clics, partout** (RT = clic gauche, LT = clic droit) : le standard, et plus aucun
   set où une gâchette change de sens.
2. **Palettes hautes = Maj (droite) et Ctrl (gauche), partout**, libres aujourd'hui : gaz en vol,
   translation avant/arrière en amarrage, courir/jetpack en AEV, Maj de l'éditeur, Maj+Tab en
   carte. Avec **L-bas = Alt**, les trois modificateurs du clavier sont sur des palettes et se
   composent avec tout le reste : Alt + stick = trim, Alt + warp+ = warp physique, Alt + F12 =
   console, Maj + RB (Tab) = focus précédent.
3. **Palette R-bas maintenue = la manette « shiftée »**, comme aujourd'hui. Un seul mode shift par
   zone, tous portés par la même palette.
4. **Une seule liste** : R-bas + stick gauche = rangée de chiffres 1 à 0, dans tous les sets
   (groupes d'action en vol, outils 1-3 en construction AEV, outils 1-4 dans l'éditeur).
5. **Croix : ← recule, → avance** : warp en vol, annuler/refaire dans l'éditeur. Plus de clics sur
   la croix.
6. **Émulation analogique** (reprise de Squad) sur le stick de pilotage et le stick caméra : le gaz
   n'est plus analogique (Maj/Ctrl sont des touches, sur une gâchette comme sur une palette), le
   pilotage peut l'être.
7. Standard des petits boutons : ☰ = pause, ⧉ = carte, comme Squad et la conf de l'ancien mod. Sur le
   v2, **`button_escape` est ☰ (à droite) et `button_menu` est ⧉ (à gauche)** (vu dans l'interface Steam,
   2026-10-22) : l'inverse de ce que leurs noms laissent croire.

## Le squelette commun

Disposition du set **Vol** ; les autres sets n'en diffèrent que par ce que dit « Les différences
par set ». R-bas = `button_back_right`, L-bas = `button_back_left`, R-haut / L-haut = leurs
`_upper`.

| Entrée | Normal | R-bas maintenue |
|---|---|---|
| Stick gauche | W/A/S/D tangage/lacet (émulation analogique) | liste 1 à 0 (groupes d'action) |
| Clic stick gauche | Verr. maj (précision) | |
| Stick droit | flèches, caméra (émulation analogique) | I/J/K/L, translation RCS (idée AFBW) |
| Clic stick droit | V mode caméra ; long : C (IVA) | |
| Pad droit | souris ; appui = clic gauche ; double tape = mouselook | **aucun changement** (règle) |
| Pad gauche | molette (zoom) ; appui = clic droit | touch menu système (cf. plus bas) |
| LB / RB | Q / E roulis | |
| RT / LT | clic gauche / clic droit | |
| R-haut / L-haut | Maj / Ctrl (gaz + / −) | Z plein gaz / X coupure |
| A | Espace, étage | **long seul** : Retour arrière (Abort) |
| B | B freins | F (inverse SAS tant que tenu) ; long : Y (FreeIVA, se détacher) |
| X | R RCS | |
| Y | T SAS | F4 (étiquettes) |
| Croix ← / → | `,` / `.` warp ; ← long : arrêt du warp | `[` / `]` vaisseau précédent / suivant |
| Croix ↑ / ↓ | U feux / G train | H / N translation avant / arrière |
| ☰ | Échap pause (clavier virtuel : Steam + X) | |
| ⧉ | M carte ; long : Suppr (mode amarrage) | |
| L-bas | Alt | |
| R-bas | shift | |

**Ce que KSP fait d'Alt** (`FlightInputHandler`, lu le 2026-10-21) : `Update` ignore `THROTTLE_CUTOFF` (X) et `THROTTLE_FULL` (Z) tant
que `MODIFIER_KEY` (Alt) est tenu ; `FixedUpdate` remet le trim à zéro sur Alt + `KeyCode.X` (X codé
en dur) ; Maj/Ctrl font varier les gaz même Alt tenu ; Alt + touches de tangage/lacet/roulis règle le
trim (0,1/s, borné à ±1) **à la place** de la commande : avec un stick qui envoie des touches, L-bas
tenue = le stick trime et ne pilote plus. Donc L-bas + R-bas + L-haut = Alt+X = **trim à
zéro sans couper les gaz** : pas besoin d'une entrée dédiée. Lu dans `FixedUpdate`, l'appui peut se
perdre à fréquence d'images élevée (déduit du code, pas mesuré).

Plein gaz / coupure = R-bas + R-haut / L-haut (Lionel, 2026-10-21) : les gâchettes restent des clics
dans toutes les couches. Les palettes sont dans la zone `switch` : il faut un mode shift de cette
zone, ou un appui accordé (chord) sur R-bas, à vérifier.

**Le pad droit (la souris) ne change jamais avec R-bas** (Lionel, 2026-10-21) : on tient souvent
R-bas, prêt à couper les gaz, tout en déplaçant la caméra à la souris ; le stick droit la déplace par
crans, ce n'est pas un substitut. Le touch menu est donc sur le pad gauche ; R-bas tenue, le zoom
du pad gauche est perdu.

Touch menu système (R-bas + pad gauche) : F1 capture, F2 interface, F3 journal, F5 sauvegarde
rapide, F9 chargement rapide, F10 jauges de température, F11 surcouche thermique, F12 forces
aérodynamiques (avec L-bas : console), navball (pavé `.`), recentrer la caméra (`` ` ``), Inser
(mode étages).

## Les différences par set

- **Amarrage** (`DockingControls`) : stick gauche = translation (mêmes touches W/A/S/D), palettes
  hautes = translation avant/arrière (mêmes touches Maj/Ctrl), A = Espace bascule
  translation/rotation (plus d'Abort sous A), ⧉ long = Inser (retour au mode étages).
- **Carte** (`MapControls`, aussi station de suivi et carte depuis l'AEV) : LB / RB gardent Q / E
  (roulis) comme en vol ; **clic du stick droit = Tab** (focus suivant : le stick caméra change
  l'objet que vise la caméra ; V, mode caméra, ne sert pas en carte). Pas de Maj+Tab : KSP y voit
  Maj et monte les gaz (Lionel, 2026-10-21). Steam + croix ↓ donne aussi Tab ; R-bas + croix ↑ = navball (pavé `.`). Les touches
  de vol sont inertes en station de suivi.
- **AEV** (`EVAControls`, aussi construction) : stick gauche = marche, LB / RB = Q / E (roulis du
  jetpack, rotation de la pièce en construction ; aujourd'hui A/D, déjà sur le stick), palettes
  hautes = Maj / Ctrl (courir ou monter / descendre), A = Espace (sauter, lâcher, remettre la pièce
  droite), B = F (s'agripper), X = R (jetpack), croix ↑ = U lampe ; R-bas + B = B (embarquer), R-bas
  + X = P (parachute), R-bas + Y = O (casque), R-bas + stick = liste (outils 1/2/3) ; ⧉ long = I
  (mode construction).
- **Éditeur** (`EditorControls`, aussi Mission Builder) : stick gauche et LB/RB = rotation de la
  pièce (W/A/S/D/Q/E) ; R-haut = Maj (rotation fine, glisser la caméra), donc R-bas n'est plus que le
  shift ; ABXY de la conf actuelle (Espace, Suppr, X, C ; shift : R, F) ; croix ← / → = annuler /
  refaire, ↑ / ↓ = Page haut / bas (caméra) ; R-bas + stick = outils 1-4 ; ☰ = Échap (absent de
  l'éditeur chez Squad comme chez nous).
- **Menu** (`MenuControls`, donc aussi le KSC, chez Squad comme chez nous) : A = Entrée, B = Échap ;
  stick gauche = flèches ; croix ← / → = warp − / + comme en vol, ← long = arrêt (Squad mettait le
  warp de Menu sur X/Y ; la croix garde les mêmes gestes entre vol et KSC, et les menus de KSP se
  pilotent à la souris, pas aux flèches).

## Où c'est implémenté

- **Le mod** : le nouveau `KSP-Mod-SteamInput` (2026-10-22), copié de l'ancien sans cheatsheet ni
  sous-module ; `EActionGroup` réduit aux 6 sets de Squad, détecteurs rattachés selon la table de « Ce
  que les 12 sets du mod apportent vraiment ». Le correctif du mode manœuvre reste sa raison d'être.
- **La config** : ce dépôt. Lionel garde le générateur (2026-10-21) : l'interface de Steam est pénible
  dès qu'un comportement se répète en plusieurs endroits, le générateur est suivi par git. Presets
  nommés comme les sets de Squad ; aucun manifeste à livrer ; aucun layer (on ne sait pas si une config
  peut en déclarer sur le manifeste natif) ; le multi-modeshift reste exclu.
- **L'ancien mod** : renommé `KSP-Mod-SteamInputExtended`, gardé tel quel. Il ne sera repris (sous-modules
  communs) que si Lionel voit, en jouant, une vraie régression par rapport à ses 12 sets.
- **Diffusion** : une conf générée, importée dans Steam, se **publie sur le Workshop** (« Configurations
  de la communauté »). Le joueur installe le plugin et choisit la conf dans Steam : plus de
  `controller_config`, plus de `.vdf` à copier Steam fermé.

## À vérifier en jeu

- Sans `controller_config\game_actions_220200.vdf`, Steam sert bien les 6 sets Squad pour le v2
  (renommer le fichier, relancer Steam : l'interface doit montrer Menu, Vol, Amarrage, Éditeur,
  Carte, AEV). Touche à l'install Steam de Lionel : à lui de le faire.
- En carte, Retour arrière recentre-t-il la vue ou déclenche-t-il Abort ? D'où son absence de la
  carte.
- F9 doit être maintenu pour charger : un bouton de touch menu le tient-il assez longtemps ?
- Un touch menu sur le pad gauche shifté cohabite-t-il avec la liste du stick gauche (cf. « Les
  listes sur un stick ») ?
- Ergonomie : gaz sur les palettes hautes en tenant RT/LT pour cliquer.
- Réglage de l'émulation analogique (période, rapport cyclique) pour le stick de pilotage.
- ~~`button_escape` = ⧉, `button_menu` = ☰~~ : c'est l'inverse (vu le 2026-10-22, cf. principe 7).
  Palettes : `button_back_*_upper` = L4/R4 (hautes), `button_back_*` = L5/R5 (basses).

## Défauts repérés au passage

Dans `SteamInputConfig\bindings`, des lettres AZERTY sont codées en dur et passent telles quelles
dans la build anglaise : `Game/Editor/undo2.vdf` envoie W (annuler devient Ctrl+W),
`FreeIva/Move/move-forward.vdf` et `move-left.vdf` Z et Q, `Vessel/Wheels/forward.vdf` et
`turn-left.vdf` Z et Q. À confirmer contre ce que lit KSP avec un clavier QWERTY.

Pour FreeIVA, c'est un défaut dans **les deux** builds : sa DLL (lue le 2026-10-21 depuis
l'install Steam, classe `Settings`) lit `Input.GetKey` sur des `KeyCode` comme KSP, avec par défaut
W/S/A/D (avancer, reculer, gauche, droite), Q/E (roulis), Maj/Ctrl (monter, descendre), Espace
(sauter), X (s'accroupir), Y (se détacher), F (écoutille), Alt+G (gravité), `CAMERA_NEXT` (changer
de Kerbal). Les templates `move-forward` / `move-left` en Z / Q sont donc faux. Confirmé sur le
source (`kspmod-ext\FreeIva`, `Settings.LoadSettings`) : les touches se surchargent par
`GameData/FreeIva/settings.cfg` (nœud `FreeIvaConfig`), qui livre les mêmes valeurs, et l'install
Steam de Lionel ne les a pas changées. Origine probable (Lionel, 2026-10-21) : des réglages faits sous
Linux en AZERTY, où Steam envoie les lettres A/Q/W/Z par caractère (cf. « Linux et claviers non
américains ») ; c'est un argument de plus pour une table clavier par système, plutôt que des lettres
corrigées à la main dans les templates.
