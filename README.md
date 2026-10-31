# Steam Input layouts for Kerbal Space Program

Steam Input layouts for the **Steam Controller (2025)**, built for the
[KSP-Mod-SteamInput](https://github.com/lhervier/KSP-Mod-SteamInput) plugin.

The layouts only use the six action sets that Kerbal Space Program already declares to Steam (Menu,
Flight, Docking, Editor, Map, EVA): there is nothing to install in Steam's folders. Steam serves these
sets by itself; the plugin only fixes which one is active (the stock plugin falls back to the menu
layout in maneuver mode, and knows nothing of EVA construction or FreeIVA).

The layouts are not edited in Steam's configuration screen but generated from small VDF fragments kept
in this repository: a behaviour shared by several sets is written once, and every change can be reviewed
and reverted.

**How this was made.** The layout, these fragments and the page generator were written with Claude
(Anthropic), then reviewed and validated by a human. I say it upfront because work done with an AI
deserves a closer look, and because some will prefer to stop here. What deserves that look here is the
layout itself: every binding is a plain key press, listed in the fragments under `SteamInputConfig/`.

## Using a layout

1. Install the [KSP-Mod-SteamInput](https://github.com/lhervier/KSP-Mod-SteamInput) plugin.
2. In Steam, open the controller settings of Kerbal Space Program, browse the community layouts, and
   pick **KSP - Steam Controller**.

To try a layout built from this repository instead, copy
`Release/ksp_steaminput_steamcontroller_v2_<language>.vdf` into
`<Steam>/steamapps/common/Steam Controller Configs/<your Steam id>/config/220200/`, and add to its name a
number higher than the last one already there (`..._french_11.vdf` after `..._french_10.vdf`). Steam
picks it up without being restarted; it shows up under **Your layouts**.

The language is the one of your keyboard layout (`english` for QWERTY, `french` for AZERTY): the
bindings send keys, and the keys KSP expects sit at different places on each keyboard.

## The layout

**[See the layout, input by input and set by set](https://lhervier.github.io/KSP-Util-SteamInputConfig/)**:
an interactive drawing of the controller showing what each input does on a press, a long press and with
the R5 paddle held. The same page in French, built from the French layout, is
[here](https://lhervier.github.io/KSP-Util-SteamInputConfig/fr.html). Both are generated from the layouts
of this repository each time `main` changes.

In short, the back paddles carry the keyboard modifiers:

- **upper right / upper left**: Shift / Ctrl, so throttle up / down in flight, translation forward /
  backward in docking mode, jetpack up / down in EVA;
- **lower left**: Alt (trim with the left stick, physics warp);
- **lower right**: held, it switches the controller to its second layer (action groups on the left
  stick, RCS translation on the right stick, vessel switching on the D-pad, system menu on the left
  trackpad...). Held together with an upper paddle, it gives full throttle / throttle cut-off.

The triggers are mouse clicks (right: left click, left: right click), the right trackpad is the mouse,
the left trackpad zooms. The D-pad handles time warp (left / right, hold left to stop it), lights and
gear. The Steam button shortcuts (Steam + X for the on-screen keyboard...) still work.

## Building

Requires [Node.js](https://nodejs.org/).

```
build.bat      (Windows)
./build.sh     (Linux)
```

The layouts are written to `Release/`, one file per keyboard language.

The pages that show the layout are generated from these files by `PageGenerator/`, a separate tool that
reads one built layout (`.vdf`) and writes one HTML page:

```
build-pages.bat      (Windows)
./build-pages.sh     (Linux)
```

They are written to `Release/pages/`. On GitHub, the `Pages` workflow (`.github/workflows/pages.yml`)
runs both builds and publishes these pages to GitHub Pages each time `main` changes.

## Known issues

**Linux with a keyboard layout other than US English.** On Windows, Steam Input sends the key at the
place of the bound QWERTY key, whatever the keyboard; picking the layout of your keyboard language is
enough. On Linux, it does so only for some keys: for the letters A, Q, W, Z and M it sends the
character instead, and several punctuation keys (`[`, `]`, `` ` ``, `\`, `'`, `;`, `.`, `/`, `-`, keypad
`.`) all come out as the same key, or as nothing. With an AZERTY keyboard, for instance, these bindings
reach the game as other keys:

- pitch, yaw and roll (W, A, Q), full throttle (Z), the map view (M), undo in the editor (Ctrl + Z);
- time warp and stopping it, switching vessels, the navball, resetting the camera.

No layout can fix the punctuation keys from Steam's side. I reported it to Valve:
[ValveSoftware/steam-for-linux#13220](https://github.com/ValveSoftware/steam-for-linux/issues/13220).

## License

MIT — see `LICENSE`.
