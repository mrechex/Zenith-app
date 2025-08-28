#!/bin/bash
cd "$(dirname "$0")"
npm run build && firebase deploy
echo "✅ App actualizada!"
read -p "Presiona Enter para cerrar..."