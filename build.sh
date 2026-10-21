#!/bin/bash
# Builds the Steam Input layouts (one .vdf per keyboard language) into Release/.
set -e
cd "$(dirname "$0")"

echo "Installing the merge tool dependencies"
(cd MergeScripts && npm ci)

echo "Merging the VDF templates"
(cd MergeScripts && node merge-controller.js ../SteamInputConfig/controllers.json all)

mkdir -p Release
cp MergeScripts/build/*.vdf Release/
echo "Build complete: Release/"
