// Turns a Steam Input layout (.vdf, Steam Controller 2025) into the data the page displays.

const vdf = require("./vdf");

// Where each input of a group lands on the controller, by source zone. A function receives the input
// name and returns [card id, sub-label] or null. Card ids are those of the page's controller drawing.
const DIRECTIONS = { dpad_north: "↑", dpad_south: "↓", dpad_east: "→", dpad_west: "←" };
const DPAD_CARDS = { dpad_north: "dup", dpad_south: "ddown", dpad_east: "dright", dpad_west: "dleft" };
const DIAMOND_CARDS = {
    button_a: "a", button_b: "b", button_x: "x", button_y: "y",
    // A diamond group in dpad mode: Y is north, A south, B east, X west.
    dpad_north: "y", dpad_south: "a", dpad_east: "b", dpad_west: "x"
};
const SWITCH_CARDS = {
    left_bumper: "lb", right_bumper: "rb",
    button_menu: "view", button_escape: "menu",
    button_back_left_upper: "l4", button_back_left: "l5",
    button_back_right_upper: "r4", button_back_right: "r5"
};

function stick(card, clickCard) {
    return input => {
        if (input === "click") return [clickCard, null];
        if (DIRECTIONS[input]) return [card, DIRECTIONS[input]];
        if (/^touch_menu_button_\d+$/.test(input)) return [card, null];
        return null;
    };
}

function trackpad(card, clickCard) {
    return input => {
        if (input === "click") return [clickCard, null];
        if (input === "doubletap") return [card, null];
        if (input === "scroll_clockwise") return [card, "↻"];
        if (input === "scroll_counterclockwise") return [card, "↺"];
        if (DIRECTIONS[input]) return [card, DIRECTIONS[input]];
        if (/^touch_menu_button_\d+$/.test(input)) return [card, null];
        return null;
    };
}

const ZONES = {
    joystick: stick("ls", "l3"),
    right_joystick: stick("rs", "r3"),
    dpad: input => DPAD_CARDS[input] ? [DPAD_CARDS[input], null] : null,
    button_diamond: input => DIAMOND_CARDS[input] ? [DIAMOND_CARDS[input], null] : null,
    left_trackpad: trackpad("lp", "lpc"),
    right_trackpad: trackpad("rp", "rpc"),
    left_trigger: () => ["lt", null],
    right_trigger: () => ["rt", null],
    switch: input => SWITCH_CARDS[input] ? [SWITCH_CARDS[input], null] : null
};

// The card of a whole zone, for what its group says as a whole (emulated analog, mouse cursor).
const ZONE_CARDS = {
    joystick: "ls", right_joystick: "rs", left_trackpad: "lp", right_trackpad: "rp",
    left_trigger: "lt", right_trigger: "rt"
};

// Rank of an input in its group on the page: directions as on a compass rose read line by line
// (up, left, right, down), touch menu and list items in their on-screen order (the file has 1, 10, 2...).
const DIRECTION_ORDER = ["dpad_north", "dpad_west", "dpad_east", "dpad_south"];
function inputRank(inputName) {
    const direction = DIRECTION_ORDER.indexOf(inputName);
    if (direction >= 0) return direction;
    const match = /^touch_menu_button_(\d+)$/.exec(inputName);
    return match ? Number(match[1]) : -1;
}

// chord_button values (rank in Steam's list of buttons to hold), for the ones a layout may use.
const CHORD_BUTTONS = { 1: "LB", 2: "RB", 3: "L5", 4: "R5", 10: "A", 11: "B", 12: "X", 13: "Y" };

// The button whose hold switches to the shifted groups. Only one shift button is supported: the page
// draws a single shift layer.
const SHIFT_CARD = "r5";

/**
 * Reads a binding string ("key_press C, Label, , ") into { kind, args, label }.
 */
function parseBinding(text) {
    const parts = text.split(",").map(s => s.trim());
    const [kind, ...args] = parts[0].split(/\s+/);
    return { kind, args, label: parts[1] || "" };
}

/**
 * Builds the page data of a layout.
 *
 * @param {string} text the .vdf content
 * @param {object} [keyboard] the keyboard table the layout was built with ({ "M": "SEMICOLON" }):
 *        keys are shown as the game names them, not as Steam sends them
 * @returns {object} { title, controllerType, sets: [{ name, title, cards: { id: card } }] }, where a card
 *          is { rows: [{ layer, sub, keys, mouse, label, tags, shiftZones }], tags: [] }
 * @throws {Error} when an input of the layout has no place on the page
 */
function buildLayout(text, keyboard) {
    const root = vdf.parse(text);
    const mappings = vdf.get(root, "controller_mappings");
    if (!mappings) throw new Error("not a Steam Input layout: no controller_mappings");

    const toGame = {};
    for (const [gameKey, sentKey] of Object.entries(keyboard || {})) toGame[sentKey] = gameKey;

    const groups = {};
    for (const group of vdf.getAll(mappings, "group")) groups[vdf.get(group, "id")] = group;

    const actions = vdf.get(mappings, "actions") || [];
    const errors = [];

    const sets = vdf.getAll(mappings, "preset").map(preset => {
        const name = vdf.get(preset, "name");
        const cards = {};
        const card = id => cards[id] || (cards[id] = { rows: [], tags: [] });

        for (const [groupId, source] of vdf.get(preset, "group_source_bindings") || []) {
            const [zone, , modeshift] = source.split(" ");
            const group = groups[groupId];
            if (!group) {
                errors.push(`${name}: group ${groupId} not found`);
                continue;
            }
            const place = ZONES[zone];
            if (!place) {
                errors.push(`${name}: zone "${zone}" has no place on the page`);
                continue;
            }
            const mode = vdf.get(group, "mode");
            const shifted = modeshift === "modeshift";
            const settings = vdf.get(group, "settings") || [];

            // Group-level information, shown on the card of the zone itself.
            const zoneCard = ZONE_CARDS[zone];
            if (zoneCard && !shifted && vdf.get(settings, "analog_emulation_period")) {
                card(zoneCard).tags.push("analog");
            }
            if (zoneCard && mode === "absolute_mouse") {
                card(zoneCard).rows.push({ layer: shifted ? "s" : "n", mouse: "cursor", label: "", tags: [] });
            }

            const inputs = [...(vdf.get(group, "inputs") || [])];
            inputs.sort(([a], [b]) => inputRank(a) - inputRank(b));
            for (const [inputName, input] of inputs) {
                const target = place(inputName);
                if (!target) {
                    errors.push(`${name}: input "${inputName}" of zone "${zone}" has no place on the page`);
                    continue;
                }
                const [cardId, sub] = target;
                addActivators(card(cardId), vdf.get(input, "activators") || [], {
                    shifted, sub, mode, inputName, toGame, errors, where: `${name}/${zone}/${inputName}`
                });
            }
        }

        const title = vdf.get(vdf.get(actions, name) || [], "title") || name;
        return { name, title, cards };
    });

    if (errors.length) throw new Error("the page cannot show this layout:\n- " + errors.join("\n- "));

    return {
        title: vdf.get(mappings, "title") || "",
        controllerType: vdf.get(mappings, "controller_type") || "",
        sets
    };
}

// Adds the rows of an input's activators to a card. Activators of the same type fire together: their
// bindings make one row (Ctrl + Z). Mode shifts make one row on the shift button.
function addActivators(card, activators, ctx) {
    const byType = new Map();
    for (const [type, activator] of activators) {
        let chord = null;
        for (const settings of vdf.getAll(activator, "settings")) {
            chord = vdf.get(settings, "chord_button") || chord;
        }
        const key = chord ? `chord ${chord}` : type;
        if (!byType.has(key)) byType.set(key, { type, chord, bindings: [] });
        for (const bindings of vdf.getAll(activator, "bindings")) {
            byType.get(key).bindings.push(...vdf.getAll(bindings, "binding").map(parseBinding));
        }
    }

    for (const { type, chord, bindings } of byType.values()) {
        const shiftZones = bindings.filter(b => b.kind === "mode_shift").map(b => b.args[0]);
        const others = bindings.filter(b => b.kind !== "mode_shift");

        if (shiftZones.length) {
            card.rows.push({ layer: "s", shift: true, shiftZones, tags: [] });
        }
        if (!others.length) continue;

        const tags = [];
        let layer = ctx.shifted ? "s" : "n";
        if (chord) {
            if (CHORD_BUTTONS[chord] === "R5") layer = "s";
            else tags.push("chord:" + (CHORD_BUTTONS[chord] || chord));
        }
        if (type === "Long_Press") {
            if (layer === "n") layer = "l";
            else tags.push("long");
        } else if (type === "Double_Press") {
            tags.push("double");
        } else if (type === "Start_Press") {
            tags.push("start");
        } else if (type === "Release_Press") {
            tags.push("release");
        } else if (!["Full_Press", "Soft_Press", "chord"].includes(type)) {
            ctx.errors.push(`${ctx.where}: activator "${type}" is not handled`);
        }
        if (ctx.inputName === "doubletap") tags.push("doubletap");
        if (ctx.mode === "touch_menu") tags.push("touchmenu");
        if (ctx.mode === "hotbar") tags.push("list");

        const row = { layer, sub: ctx.sub, keys: [], label: "", tags };
        for (const b of others) {
            if (b.kind === "key_press") row.keys.push(ctx.toGame[b.args[0]] || b.args[0]);
            else if (b.kind === "mouse_button") row.mouse = "button_" + b.args[0];
            else if (b.kind === "mouse_wheel") row.mouse = "wheel_" + b.args[0];
            else ctx.errors.push(`${ctx.where}: binding "${b.kind}" is not handled`);
            if (!row.label && b.label) row.label = b.label;
        }
        card.rows.push(row);
    }
}

module.exports = { buildLayout, SHIFT_CARD };
