"use client";

import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { LocationMarker, CafeMarker } from "./MapMarkers";
import CafeHeader from "./CafeHeader";
import CafeInfoPanel from "./CafeInfoPanel";

export type CafeData = {
  id: string;
  name: string;
  coordinates: LatLngTuple;
  address: string;
  opening_hours?: string;
  phone?: string;
  website?: string;
  facilities: {
    wifi?: boolean;
    wheelchair?: boolean;
    outdoor_seating?: boolean;
  };
  cuisine?: string;
};

// Composant mémorisé pour les items de café (optimisation de rendu)
const CafeItem = React.memo(
  ({
    cafe,
    onSelect,
    onDetails,
  }: {
    cafe: CafeData;
    onSelect: (cafe: CafeData) => void;
    onDetails: (cafe: CafeData) => void;
  }) => {
    const handleSelect = useCallback(() => onSelect(cafe), [cafe, onSelect]);
    const handleDetails = useCallback(() => onDetails(cafe), [cafe, onDetails]);

    return (
      <div className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100 hover:border-blue-200">
        <div onClick={handleSelect} className="cursor-pointer">
          <h3 className="font-medium text-slate-900 mb-1 truncate">
            {cafe.name}
          </h3>
          <p className="text-sm text-slate-600 mb-2 truncate">{cafe.address}</p>

          <div className="flex items-center gap-2 text-xs mb-3">
            {cafe.facilities.wifi && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                📶 WiFi
              </span>
            )}
            {cafe.facilities.outdoor_seating && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                🌿 Terrasse
              </span>
            )}
            {cafe.facilities.wheelchair && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                ♿ Accessible
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleDetails}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Voir les détails
        </button>
      </div>
    );
  }
);

export default function CafeMapCore() {
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([48.866, 2.333]);
  const [cafes, setCafes] = useState<CafeData[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<CafeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<any>(null);
  const cacheRef = useRef<Map<string, { data: CafeData[]; timestamp: number }>>(
    new Map()
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchCafes = useCallback(async () => {
    if (!mapRef.current) return;

    const mapBounds = mapRef.current.getBounds();
    const boundsKey = `${mapBounds.getWest().toFixed(3)}-${mapBounds
      .getSouth()
      .toFixed(3)}-${mapBounds.getEast().toFixed(3)}-${mapBounds
      .getNorth()
      .toFixed(3)}`;

    // Vérifier le cache
    const cached = cacheRef.current.get(boundsKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setCafes(cached.data);
      return;
    }

    setIsLoading(true);
    try {
      const bounds = `rect:${mapBounds.getWest()},${mapBounds.getSouth()},${mapBounds.getEast()},${mapBounds.getNorth()}`;

      // Requête optimisée avec timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=catering.cafe&filter=${bounds}&limit=50&format=json&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      const enrichedCafes =
        result.features?.map((feature: any) => {
          const props = feature.properties;
          return {
            id:
              props.place_id ||
              `cafe-${feature.geometry.coordinates[1]}-${feature.geometry.coordinates[0]}`,
            name: props.name || "Café sans nom",
            coordinates: [
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0],
            ] as LatLngTuple,
            address:
              props.formatted ||
              `${props.street || ""} ${props.city || ""}`.trim() ||
              "Adresse non disponible",
            opening_hours: props.opening_hours,
            phone: props.contact?.phone,
            website: props.website,
            facilities: {
              wifi: props.facilities?.internet_access || false,
              wheelchair: props.facilities?.wheelchair || false,
              outdoor_seating: props.facilities?.outdoor_seating || false,
            },
            cuisine: props.catering?.cuisine,
          };
        }) || [];

      // Mettre en cache le résultat
      cacheRef.current.set(boundsKey, {
        data: enrichedCafes,
        timestamp: Date.now(),
      });

      // Nettoyer le cache si il devient trop gros (plus de 10 entrées)
      if (cacheRef.current.size > 10) {
        const oldestKey = Array.from(cacheRef.current.keys())[0];
        cacheRef.current.delete(oldestKey);
      }

      setCafes(enrichedCafes);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Erreur lors de la recherche de cafés:", error);
      }
      // En cas d'erreur, garder les anciens résultats si disponibles
    } finally {
      setIsLoading(false);
    }
  }, [CACHE_DURATION]);

  // Recherche avec debouncing pour éviter trop de requêtes
  const debouncedFetchCafes = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchCafes();
    }, 500); // Attendre 500ms après le dernier mouvement
  }, [fetchCafes]);

  // Recherche automatique au chargement avec un délai
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        fetchCafes();
      }
    }, 1000); // Attendre 1 seconde après le chargement

    return () => clearTimeout(timer);
  }, [fetchCafes]);

  const handleGeolocationClick = () => {
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LatLngTuple = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setUserLocation(location);
        setMapCenter(location);
        mapRef.current?.flyTo(location, 13);
      },
      () => alert("Impossible de vous localiser"),
      { timeout: 10000 }
    );
  };

  const handleCafeSelect = useCallback((cafe: CafeData) => {
    // Seulement centrer la carte sur le café, sans ouvrir automatiquement les détails
    mapRef.current?.flyTo(cafe.coordinates, 16);
  }, []);

  const handleCafeDetails = useCallback((cafe: CafeData) => {
    setSelectedCafe(cafe);
  }, []);

  // Mémoriser la liste des cafés pour optimiser le rendu
  const cafesList = useMemo(() => {
    return cafes.slice(0, 20); // Limiter à 20 pour l'affichage (performance)
  }, [cafes]);

  // Mémoriser les marqueurs pour éviter les re-renders
  const cafeMarkers = useMemo(() => {
    return cafes.map((cafe) => (
      <CafeMarker
        key={cafe.id}
        position={cafe.coordinates}
        cafe={cafe}
        isSelected={selectedCafe?.id === cafe.id}
        onClick={() => handleCafeSelect(cafe)}
        onDetailsClick={() => handleCafeDetails(cafe)}
      />
    ));
  }, [cafes, selectedCafe?.id, handleCafeSelect, handleCafeDetails]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      <CafeHeader
        onSearchInArea={debouncedFetchCafes}
        onGeolocationClick={handleGeolocationClick}
        isLoading={isLoading}
      />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Panneau latéral des cafés */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Cafés trouvés ({Math.min(cafes.length, 50)})
              {cafes.length > 20 && (
                <span className="text-sm font-normal text-slate-500 ml-2">
                  (max 50)
                </span>
              )}
            </h2>
            <div className="space-y-3">
              {cafesList.map((cafe) => (
                <CafeItem
                  key={cafe.id}
                  cafe={cafe}
                  onSelect={handleCafeSelect}
                  onDetails={handleCafeDetails}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Carte */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
              maxZoom={19}
            />

            <LocationMarker
              userLocation={userLocation}
              setUserLocation={setUserLocation}
            />

            {cafeMarkers}
          </MapContainer>

          {/* Panneau d'informations flottant */}
          {selectedCafe && (
            <CafeInfoPanel
              cafe={selectedCafe}
              onClose={() => setSelectedCafe(null)}
            />
          )}

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg z-10">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Recherche en cours...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
