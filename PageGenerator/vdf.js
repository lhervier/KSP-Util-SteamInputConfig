// Reader for Valve's KeyValues text format (.vdf), as written by Steam Input.

/**
 * Parses a VDF text into a tree of nodes.
 *
 * A node is an array of [key, value] pairs, in file order; a value is either a string or a node.
 * Keys may repeat (a Steam Input layout has many "group" and "binding" keys), which a plain object
 * could not hold.
 *
 * @param {string} text the VDF content
 * @returns {Array} the root node
 * @throws {Error} on a syntax error, with its line number
 */
function parse(text) {
    let pos = 0;
    let line = 1;

    function fail(message) {
        throw new Error(`VDF line ${line}: ${message}`);
    }

    // Returns the next token: a string, "{", "}", or null at the end of the text.
    function next() {
        for (;;) {
            while (pos < text.length && /\s/.test(text[pos])) {
                if (text[pos] === "\n") line++;
                pos++;
            }
            if (text.startsWith("//", pos)) {
                while (pos < text.length && text[pos] !== "\n") pos++;
                continue;
            }
            break;
        }
        if (pos >= text.length) return null;

        const c = text[pos];
        if (c === "{" || c === "}") {
            pos++;
            return { brace: c };
        }
        if (c === '"') {
            pos++;
            let value = "";
            while (pos < text.length && text[pos] !== '"') {
                if (text[pos] === "\\" && pos + 1 < text.length) {
                    const escaped = text[pos + 1];
                    value += escaped === "n" ? "\n" : escaped === "t" ? "\t" : escaped;
                    pos += 2;
                    continue;
                }
                if (text[pos] === "\n") line++;
                value += text[pos++];
            }
            if (pos >= text.length) fail("unterminated string");
            pos++;
            return { string: value };
        }
        // Unquoted token: up to the next blank or brace.
        let value = "";
        while (pos < text.length && !/[\s{}"]/.test(text[pos])) value += text[pos++];
        return { string: value };
    }

    function readNode(closing) {
        const node = [];
        for (;;) {
            const key = next();
            if (key === null) {
                if (closing) fail("missing '}'");
                return node;
            }
            if (key.brace === "}") {
                if (!closing) fail("unexpected '}'");
                return node;
            }
            if (key.brace) fail("unexpected '{'");

            const value = next();
            if (value === null) fail(`no value for key "${key.string}"`);
            if (value.brace === "{") {
                node.push([key.string, readNode(true)]);
            } else if (value.brace) {
                fail(`unexpected '}' after key "${key.string}"`);
            } else {
                node.push([key.string, value.string]);
            }
        }
    }

    return readNode(false);
}

/**
 * Returns the first value of a key in a node, or undefined.
 */
function get(node, key) {
    const pair = node && node.find(([k]) => k === key);
    return pair ? pair[1] : undefined;
}

/**
 * Returns every value of a key in a node, in file order.
 */
function getAll(node, key) {
    return node ? node.filter(([k]) => k === key).map(([, v]) => v) : [];
}

module.exports = { parse, get, getAll };
