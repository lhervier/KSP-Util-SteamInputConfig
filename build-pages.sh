#!/bin/bash
# Builds the pages that show the layout (English and French) into Release/pages/, from the layouts
# that build.sh wrote to Release/.
set -e
cd "$(dirname "$0")"

LAYOUT=Release/ksp_steaminput_steamcontroller_v2
if [ ! -f "${LAYOUT}_english.vdf" ] || [ ! -f "${LAYOUT}_french.vdf" ]; then
    echo "ERROR: run build.sh first, the layouts are missing from Release/"
    exit 1
fi

node PageGenerator/generate-page.js "${LAYOUT}_english.vdf" Release/pages/index.html --lang en
node PageGenerator/generate-page.js "${LAYOUT}_french.vdf" Release/pages/fr.html --lang fr \
    --keyboard SteamInputConfig/keyboard-french.json
echo "Pages complete: Release/pages/"
