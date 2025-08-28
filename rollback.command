#!/bin/bash
cd "$(dirname "$0")"

echo "🔄 Restaurando desde backup V1..."

# Backup de la versión rota
mv ../zenith-task-managerV1 ../zenith-task-manager-roto-$(date +%Y%m%d-%H%M%S)

# Restaurar desde backup del escritorio
cp -r ~/Desktop/zenith-task-managerV1 ../zenith-task-managerV1

# Moverse a la carpeta restaurada
cd ../zenith-task-managerV1

echo "📦 Instalando dependencias..."
npm install

echo "🏗️ Compilando..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Restauración exitosa!"
    read -p "¿Quieres hacer deploy? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        firebase deploy
        echo "🚀 Deploy completado!"
    fi
else
    echo "❌ Error en build - revisar backup V1"
fi

read -p "Presiona Enter para cerrar..."