#!/usr/bin/env node
// Generates the HTML page that shows a Steam Input layout, set by set.
//
// Usage: node generate-page.js <layout.vdf> <page.html> --lang <en|fr> [--keyboard <keyboard.json>]
//
//   <layout.vdf>   a layout built by MergeScripts (one .vdf file)
//   <page.html>    the page to write
//   --lang         language of the page's own texts (the bindings' labels come from the .vdf)
//   --keyboard     the keyboard table the layout was built with (SteamInputConfig/keyboard-<lang>.json),
//                  so that keys are shown as the game names them

const fs = require("fs");
const path = require("path");
const { buildLayout } = require("./layout");
const STRINGS = require("./strings");

// The page draws this controller only.
const CONTROLLER_TYPE = "controller_triton";

function usage(message) {
    if (message) console.error("Error: " + message);
    console.error("Usage: node generate-page.js <layout.vdf> <page.html> --lang <en|fr> [--keyboard <keyboard.json>]");
    process.exit(2);
}

function parseArgs(argv) {
    const args = { files: [] };
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === "--lang") args.lang = argv[++i];
        else if (argv[i] === "--keyboard") args.keyboard = argv[++i];
        else if (argv[i].startsWith("--")) usage(`unknown option ${argv[i]}`);
        else args.files.push(argv[i]);
    }
    if (args.files.length !== 2) usage("expected a layout and a page");
    if (!STRINGS[args.lang]) usage(`--lang must be one of: ${Object.keys(STRINGS).join(", ")}`);
    return args;
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// JSON that can sit inside a <script> element.
function scriptJson(value) {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    const [layoutFile, pageFile] = args.files;
    const strings = STRINGS[args.lang];

    const keyboard = args.keyboard ? JSON.parse(fs.readFileSync(args.keyboard, "utf8")) : null;
    const layout = buildLayout(fs.readFileSync(layoutFile, "utf8"), keyboard);
    if (layout.controllerType !== CONTROLLER_TYPE) {
        throw new Error(`the page draws the Steam Controller (2025) only (${CONTROLLER_TYPE}), not ${layout.controllerType}`);
    }

    const values = {
        LANG: escapeHtml(strings.htmlLang),
        TITLE: escapeHtml(strings.pageTitle),
        H1: escapeHtml(strings.h1),
        SUB: strings.sub,
        GENERATED: escapeHtml(strings.generated),
        LAYOUT_TITLE: escapeHtml(layout.title),
        OTHER_HREF: escapeHtml(strings.otherLang.href),
        OTHER_LABEL: escapeHtml(strings.otherLang.label)
    };
    const template = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");
    // Replacement functions, not strings: "$" in the data must stay as is.
    const page = template
        .replace("/*%%LAYOUT%%*/null", () => scriptJson(layout))
        .replace("/*%%STRINGS%%*/null", () => scriptJson(strings))
        .replace(/%%([A-Z0-9_]+)%%/g, (match, name) => name in values ? values[name] : match);

    fs.mkdirSync(path.dirname(path.resolve(pageFile)), { recursive: true });
    fs.writeFileSync(pageFile, page);
    console.log(`Page written: ${pageFile} (${layout.sets.length} sets)`);
}

try {
    main();
} catch (e) {
    console.error("Error: " + e.message);
    process.exit(1);
}
