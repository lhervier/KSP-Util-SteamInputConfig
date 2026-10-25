@echo off
REM Builds the pages that show the layout (English and French) into Release\pages\, from the layouts
REM that build.bat wrote to Release\.
setlocal
cd /d "%~dp0"

set LAYOUT=Release\ksp_steaminput_steamcontroller_v2
if not exist "%LAYOUT%_english.vdf" goto missing
if not exist "%LAYOUT%_french.vdf" goto missing

node PageGenerator\generate-page.js "%LAYOUT%_english.vdf" Release\pages\index.html --lang en
if errorlevel 1 exit /b 1
node PageGenerator\generate-page.js "%LAYOUT%_french.vdf" Release\pages\fr.html --lang fr --keyboard SteamInputConfig\keyboard-french.json
if errorlevel 1 exit /b 1
echo Pages complete: Release\pages\
exit /b 0

:missing
echo ERROR: run build.bat first, the layouts are missing from Release\
exit /b 1
