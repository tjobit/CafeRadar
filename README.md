# Cafe Radar ☕

Une application Next.js pour trouver des cafés près de vous avec une interface chaleureuse aux couleurs du café.

## Configuration

### 1. Clonez le repository

```bash
git clone https://github.com/tjobit/CafeRadar.git
cd cafe-radar
```

### 2. Installez les dépendances

```bash
npm install
```

### 3. Configurez les variables d'environnement

```bash
# Copiez le fichier d'exemple
cp .env.example .env.local

# Éditez .env.local et ajoutez votre clé API Geoapify
# Obtenez une clé gratuite sur : https://www.geoapify.com/
```

Dans `.env.local` :

```
NEXT_PUBLIC_GEOAPIFY_API_KEY=votre_cle_api_ici
```

## Getting Started

Une fois que vous avez configuré votre environnement, vous pouvez démarrer le serveur de développement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.
