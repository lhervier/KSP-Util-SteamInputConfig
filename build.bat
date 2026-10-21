@echo off
REM Builds the Steam Input layouts (one .vdf per keyboard language) into Release\.
setlocal
cd /d "%~dp0"

echo Installing the merge tool dependencies
pushd MergeScripts
call npm ci
if errorlevel 1 (
    echo ERROR: npm ci failed
    popd
    exit /b 1
)

echo Merging the VDF templates
node merge-controller.js "..\SteamInputConfig\controllers.json" all
if errorlevel 1 (
    echo ERROR: the VDF merge failed
    popd
    exit /b 1
)
popd

if not exist "Release" mkdir "Release"
copy /y "MergeScripts\build\*.vdf" "Release\" >nul
if errorlevel 1 (
    echo ERROR: could not copy the VDF files to Release
    exit /b 1
)
echo Build complete: Release\
