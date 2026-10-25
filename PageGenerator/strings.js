// The page's own texts, per page language. The bindings' labels and the sets' names come from the .vdf.

const REPO = "https://github.com/lhervier/KSP-Util-SteamInputConfig";
const PLUGIN = "https://github.com/lhervier/KSP-Mod-SteamInput";

module.exports = {
    en: {
        htmlLang: "en",
        pageTitle: "KSP Steam Controller Layout",
        h1: "KSP · Steam Controller",
        sub: `The Steam Input layout of <a href="${REPO}">KSP-Util-SteamInputConfig</a> for the Steam Controller
            (2025), set by set. The <a href="${PLUGIN}">KSP-Mod-SteamInput</a> plugin picks the set from what you
            are doing in the game. Hover an input to see it on the controller.`,
        generated: "Generated from the layout",
        otherLang: { label: "Version française", href: "fr.html" },
        layers: "Layers", all: "All", press: "Press", long: "Long press", shiftHeld: "R5 held",
        backPaddles: "Back paddles",
        backCaption: "Back paddles seen through the controller: the left ones are under the left hand.",
        free: "free",
        diffFrom: "≠ {set}",
        hold: "hold",
        shiftTo: "switches to the R5 layer:",
        zones: {
            joystick: "left stick", right_joystick: "right stick", dpad: "D-pad", button_diamond: "A B X Y",
            left_trackpad: "left trackpad", right_trackpad: "right trackpad",
            left_trigger: "left trigger", right_trigger: "right trigger", switch: "buttons"
        },
        inputs: {
            lt: "Left trigger · LT", lb: "Left bumper · LB",
            dup: "D-pad ↑", dleft: "D-pad ←", dright: "D-pad →", ddown: "D-pad ↓",
            view: "View button ⧉", ls: "Left stick", l3: "Left stick click · L3",
            lp: "Left trackpad", lpc: "Left trackpad · press",
            rt: "Right trigger · RT", rb: "Right bumper · RB",
            y: "Y", x: "X", b: "B", a: "A",
            menu: "Menu button ☰", rs: "Right stick", r3: "Right stick click · R3",
            rp: "Right trackpad", rpc: "Right trackpad · press",
            l4: "Upper left paddle · L4", l5: "Lower left paddle · L5",
            r4: "Upper right paddle · R4", r5: "Lower right paddle · R5"
        },
        tags: {
            long: "long press", double: "double press", doubletap: "double tap", start: "on press",
            release: "on release", touchmenu: "touch menu", list: "list", analog: "emulated analog",
            chord: "with {button} held"
        },
        mouse: {
            cursor: "Mouse", button_LEFT: "Left click", button_RIGHT: "Right click", button_MIDDLE: "Middle click",
            wheel_SCROLL_UP: "Wheel ↑", wheel_SCROLL_DOWN: "Wheel ↓"
        },
        keys: {
            BACKSLASH: "\\", BACKSPACE: "Backspace", BACK_TICK: "`", CAPSLOCK: "Caps Lock", COMMA: ",",
            DELETE: "Del", DOWN_ARROW: "↓", LEFT_ARROW: "←", RIGHT_ARROW: "→", UP_ARROW: "↑", ESCAPE: "Esc",
            FORWARD_SLASH: "/", INSERT: "Ins", KEYPAD_PERIOD: "Keypad .", LEFT_ALT: "Alt", LEFT_BRACKET: "[",
            RIGHT_BRACKET: "]", LEFT_CONTROL: "Ctrl", LEFT_SHIFT: "Shift", PAGE_DOWN: "Page ↓", PAGE_UP: "Page ↑",
            PERIOD: ".", RETURN: "Enter", SEMICOLON: ";", SPACE: "Space", TAB: "Tab"
        },
        contexts: {
            MenuControls: "Main menu, space center, its buildings, pause menu",
            FlightControls: "Flying (maneuver mode included), IVA in a seat",
            DockingControls: "Docking mode",
            EditorControls: "VAB, SPH, mission builder",
            MapControls: "Map view (from flight, docking or EVA), tracking station",
            EVAControls: "EVA, EVA construction, FreeIVA out of the seat"
        },
        notes: [
            {
                title: "Always there: Steam button +",
                items: [
                    "<kbd>X</kbd> on-screen keyboard",
                    "<kbd>←</kbd> Esc · <kbd>→</kbd> Enter · <kbd>↓</kbd> Tab",
                    "<kbd>RT</kbd> / <kbd>LT</kbd> left / right click",
                    "Valve's default Steam button shortcuts: they do not depend on this layout."
                ]
            },
            {
                title: "Lists on a stick",
                items: [
                    "Push the stick <kbd>↓</kbd> to show the list.",
                    "<kbd>←</kbd> <kbd>→</kbd> to pick, <kbd>↑</kbd> to trigger."
                ]
            },
            {
                title: "Good to know",
                items: [
                    "The bindings send keys: pick the layout of your keyboard (English for QWERTY, French for AZERTY).",
                    "Alt + mouse wheel changes KSP's field of view. If the wheel does that without Alt, press Alt once; a double click of the middle mouse button restores the view.",
                    "On Linux, non-US keyboard layouts may send wrong keys (<a href=\"https://github.com/ValveSoftware/steam-for-linux/issues/13220\">Steam issue #13220</a>)."
                ]
            }
        ]
    },

    fr: {
        htmlLang: "fr",
        pageTitle: "Disposition KSP Steam Controller",
        h1: "KSP · Steam Controller",
        sub: `La disposition Steam Input de <a href="${REPO}">KSP-Util-SteamInputConfig</a> pour le Steam Controller
            (2025), set par set. Le plugin <a href="${PLUGIN}">KSP-Mod-SteamInput</a> choisit le set selon ce que
            vous faites dans le jeu. Survolez une entrée pour la voir sur la manette.`,
        generated: "Généré à partir de la disposition",
        otherLang: { label: "English version", href: "index.html" },
        layers: "Couches", all: "Tout", press: "Appui", long: "Appui long", shiftHeld: "R5 tenue",
        backPaddles: "Palettes arrière",
        backCaption: "Palettes arrière vues à travers la manette : celles de gauche sont sous la main gauche.",
        free: "libre",
        diffFrom: "≠ {set}",
        hold: "tenir",
        shiftTo: "passe sur la couche R5 :",
        zones: {
            joystick: "stick gauche", right_joystick: "stick droit", dpad: "croix", button_diamond: "A B X Y",
            left_trackpad: "pad gauche", right_trackpad: "pad droit",
            left_trigger: "gâchette gauche", right_trigger: "gâchette droite", switch: "boutons"
        },
        inputs: {
            lt: "Gâchette gauche · LT", lb: "Bouton haut gauche · LB",
            dup: "Croix ↑", dleft: "Croix ←", dright: "Croix →", ddown: "Croix ↓",
            view: "Bouton Affichage ⧉", ls: "Stick gauche", l3: "Clic stick gauche · L3",
            lp: "Pad gauche", lpc: "Pad gauche · appui",
            rt: "Gâchette droite · RT", rb: "Bouton haut droit · RB",
            y: "Y", x: "X", b: "B", a: "A",
            menu: "Bouton Menu ☰", rs: "Stick droit", r3: "Clic stick droit · R3",
            rp: "Pad droit", rpc: "Pad droit · appui",
            l4: "Palette haute gauche · L4", l5: "Palette basse gauche · L5",
            r4: "Palette haute droite · R4", r5: "Palette basse droite · R5"
        },
        tags: {
            long: "appui long", double: "double appui", doubletap: "double tape", start: "à l'appui",
            release: "au relâchement", touchmenu: "menu tactile", list: "liste", analog: "émulation analogique",
            chord: "{button} tenu"
        },
        mouse: {
            cursor: "Souris", button_LEFT: "Clic gauche", button_RIGHT: "Clic droit", button_MIDDLE: "Clic milieu",
            wheel_SCROLL_UP: "Molette ↑", wheel_SCROLL_DOWN: "Molette ↓"
        },
        keys: {
            BACKSLASH: "\\", BACKSPACE: "Retour arr.", BACK_TICK: "`", CAPSLOCK: "Verr. maj", COMMA: ",",
            DELETE: "Suppr", DOWN_ARROW: "↓", LEFT_ARROW: "←", RIGHT_ARROW: "→", UP_ARROW: "↑", ESCAPE: "Échap",
            FORWARD_SLASH: "/", INSERT: "Inser", KEYPAD_PERIOD: "Pavé .", LEFT_ALT: "Alt", LEFT_BRACKET: "[",
            RIGHT_BRACKET: "]", LEFT_CONTROL: "Ctrl", LEFT_SHIFT: "Maj", PAGE_DOWN: "Pg. suiv.", PAGE_UP: "Pg. préc.",
            PERIOD: ".", RETURN: "Entrée", SEMICOLON: ";", SPACE: "Espace", TAB: "Tab"
        },
        contexts: {
            MenuControls: "Menu principal, centre spatial, ses bâtiments, menu pause",
            FlightControls: "Vol (mode manœuvre compris), IVA assis",
            DockingControls: "Mode amarrage",
            EditorControls: "VAB, SPH, éditeur de missions",
            MapControls: "Vue carte (depuis le vol, l'amarrage ou l'AEV), station de suivi",
            EVAControls: "AEV, construction en AEV, FreeIVA hors du siège"
        },
        notes: [
            {
                title: "Toujours là : bouton Steam +",
                items: [
                    "<kbd>X</kbd> clavier à l'écran",
                    "<kbd>←</kbd> Échap · <kbd>→</kbd> Entrée · <kbd>↓</kbd> Tab",
                    "<kbd>RT</kbd> / <kbd>LT</kbd> clic gauche / droit",
                    "Raccourcis du bouton Steam par défaut de Valve : ils ne dépendent pas de cette disposition."
                ]
            },
            {
                title: "Les listes sur un stick",
                items: [
                    "Poussez le stick <kbd>↓</kbd> pour afficher la liste.",
                    "<kbd>←</kbd> <kbd>→</kbd> pour choisir, <kbd>↑</kbd> pour déclencher."
                ]
            },
            {
                title: "Bon à savoir",
                items: [
                    "Les liaisons envoient des touches : prenez la disposition de votre clavier (anglaise pour QWERTY, française pour AZERTY).",
                    "Alt + molette change le champ de vision de KSP. Si la molette le fait sans Alt, appuyez une fois sur Alt ; un double clic du bouton du milieu rétablit la vue.",
                    "Sous Linux, les claviers non américains peuvent envoyer de mauvaises touches (<a href=\"https://github.com/ValveSoftware/steam-for-linux/issues/13220\">issue Steam #13220</a>)."
                ]
            }
        ]
    }
};
