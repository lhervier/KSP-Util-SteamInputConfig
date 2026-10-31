const Handlebars = require('handlebars');

// ---------------------------------------------------------
// Handlebars helpers
// ---------------------------------------------------------

/** Truthy OR for subexpressions, e.g. {{#if (or steamcontroller hori xboxelite)}} */
Handlebars.registerHelper('or', function (...args) {
    const values = args.slice(0, -1);
    return values.some(Boolean);
});

/**
 * Strict boolean context flag for #if / #unless: {{#if (true haptic)}}
 * Throws unless the resolved value is strictly true or false (e.g. missing property → undefined).
 */
Handlebars.registerHelper('true', function (value) {
    if (value !== true && value !== false) {
        const hint =
            value === undefined
                ? 'undefined (missing context property?)'
                : typeof value;
        throw new Error(`true helper: expected a boolean context flag, got ${hint}`);
    }
    return value;
});

/**
 * Strict string equality for #if / #unless: {{#if (equals mouseZone "right_trackpad")}}
 * Throws unless both operands are strings (catches missing context properties or typos).
 */
Handlebars.registerHelper('equals', function (a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') {
        const hintA = a === undefined ? 'undefined (missing context property?)' : typeof a;
        const hintB = b === undefined ? 'undefined (missing context property?)' : typeof b;
        throw new Error(`equals helper: expected two strings, got ${hintA} and ${hintB}`);
    }
    return a === b;
});

/**
 * Check if variable exists in context #if / #unless: {{#if (defined mod)}}
 */
Handlebars.registerHelper('defined', function (variable) {
    return variable !== undefined;
});

/**
 * Resolve an action-layer (preset) name to its 1-based position in the preset
 * list, as expected by the controller_action hold_layer binding.
 * @param {string} name - The preset name of the action layer
 * @returns {number} The 1-based position of the preset
 */
Handlebars.registerHelper('layerPos', function (name) {
    if (!this.layerPosMap) {
        throw new Error('layerPos helper: layerPosMap is missing from context');
    }
    const pos = this.layerPosMap[name];
    if (pos === undefined) {
        throw new Error(`layerPos helper: unknown preset name "${name}"`);
    }
    return pos;
});

/**
 * A physical key, named after its position on a QWERTY keyboard: {{key 'W'}}.
 * For the game bindings KSP moves with the keyboard layout (its Azerty.cfg puts pitch on Z,
 * at the place of the QWERTY W), so the key is the same on every keyboard.
 * @param {string} key - The QWERTY name of the key, as listed in the keyboard table
 * @returns {string} The key Steam must send
 * @throws {Error} when the key is not in the keyboard table
 */
Handlebars.registerHelper('key', function (key) {
    if( !this.keyboard ) {
        throw new Error('key helper: keyboard context is missing');
    }
    if( !this.keyboard[key] ) {
        throw new Error(`key helper: key ${key} is missing in keyboard context`);
    }
    // Steam Input sends key positions (on Windows): no translation
    return key;
});

/**
 * The key that types a character on the keyboard of the build: {{char 'Z'}}.
 * For the shortcuts KSP reads as a letter whatever the layout (editor undo Ctrl+Z,
 * map view M).
 * @param {string} character - The character, named as in the keyboard table
 * @returns {string} The key Steam must send (W for Z on a French keyboard)
 * @throws {Error} when the character is not in the keyboard table
 */
Handlebars.registerHelper('char', function (character) {
    if( !this.keyboard ) {
        throw new Error('char helper: keyboard context is missing');
    }
    if( !this.keyboard[character] ) {
        throw new Error(`char helper: character ${character} is missing in keyboard context`);
    }
    return this.keyboard[character];
});

/**
 * Compile VDF source as a Handlebars template (no HTML escaping, strict lookups).
 * @param {string} source - Raw file contents
 * @param {object} [hbsContext] - Passed through to the template (initialized by merge-*.js)
 * @param {string} vdfPath - For error messages only
 * @returns {string}
 */
function compileVdfSource(source, hbsContext, vdfPath) {
    try {
        const template = Handlebars.compile(source, { noEscape: true, strict: true });
        return template(hbsContext || {});
    } catch (error) {
        throw new Error(`${vdfPath}: Handlebars error: ${error.message}`);
    }
}

module.exports = {
    compileVdfSource
}