# Cafe Radar ☕

A Next.js application to find cafes near you with a modern, intuitive interface.

## Features

🗺️ **Interactive Map** - Browse cafes on an interactive map with modern markers  
📍 **Geolocation** - Find cafes near your current location  
🔍 **Area Search** - Search for cafes in any area you're viewing  
ℹ️ **Detailed Info** - View cafe details, facilities, contact information  
🌐 **Real-time Data** - Powered by Geoapify API for up-to-date information

## Technology Stack

- **Framework**: Next.js and React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with React-Leaflet
- **Data**: Geoapify Places API
- **Deployment**: Vercel

**Live Demo**: [https://cafe-radar.vercel.app/](https://cafe-radar.vercel.app/)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/tjobit/CafeRadar.git
cd cafe-radar
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your Geoapify API key
# Get a free key at: https://www.geoapify.com/
```

In `.env.local`:

```
NEXT_PUBLIC_GEOAPIFY_API_KEY=your_api_key_here
```

## Getting Started

Once you have configured your environment, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
