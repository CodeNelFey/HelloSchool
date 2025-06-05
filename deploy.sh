#!/bin/bash

# Config
PROJECT_DIR="/home/ubuntu/HelloSchool"    # Remplace par ton chemin exact
BRANCH="main"                             # Ou "master" selon ton repo
SCREEN_NAME="helloschool"
PORT=3030

# Vérifie si le screen existe déjà
if screen -list | grep -q "$SCREEN_NAME"; then
  echo "🟡 Screen '$SCREEN_NAME' existe déjà. Killing and recreating..."
  screen -S "$SCREEN_NAME" -X quit
  sleep 1
fi

# Se placer dans le dossier du projet
cd "$PROJECT_DIR" || exit

echo "🔄 Pulling depuis Git..."
git pull origin "$BRANCH"

echo "🔧 Installation des dépendances..."
npm install

echo "🏗️ Build du projet..."
npm run build

echo "🚀 Lancement du preview dans le screen '$SCREEN_NAME' sur le port $PORT..."
screen -dmS "$SCREEN_NAME" bash -c "npm run preview -- --port $PORT --host"

echo "✅ Déploiement terminé. Accès via : https://helloschool.sohan-birotheau.fr"
