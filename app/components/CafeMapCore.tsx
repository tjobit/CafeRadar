"use client";

import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import { LocationMarker, CafeMarker } from "./MapMarkers";
import CafeHeader from "./CafeHeader";

type Cafe = {
  name: string;
  coordinates: LatLngTuple;
};

export default function CafeMapCore() {
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([48.866, 2.333]);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const mapRef = useRef<any>(null);

  const fetchCafes = async () => {
    if (!mapRef.current) return;

    try {
      const mapBounds = mapRef.current.getBounds();
      const bounds = `rect:${mapBounds.getWest()},${mapBounds.getSouth()},${mapBounds.getEast()},${mapBounds.getNorth()}`;
      
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=catering.cafe&filter=${bounds}&limit=50&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
      );
      const result = await response.json();
      
      const cafes = result.features.map((feature: any) => ({
        name: feature.properties.name,
        coordinates: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] as LatLngTuple,
      }));
      
      setCafes(cafes);
    } catch (error) {
      console.log("Erreur lors de la recherche de cafés:", error);
    }
  };

  const handleGeolocationClick = () => {
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LatLngTuple = [position.coords.latitude, position.coords.longitude];
        setUserLocation(location);
        setMapCenter(location);
        mapRef.current?.flyTo(location, 13);
      },
      () => alert("Impossible de vous localiser"),
      { timeout: 10000 }
    );
  };



  return (
    <div className="min-h-screen bg-cream">
      <CafeHeader
        onSearchInArea={fetchCafes}
        onGeolocationClick={handleGeolocationClick}
      />

      <div className="p-4">
        <div className="rounded-xl overflow-hidden shadow-lg">
          <MapContainer
            center={mapCenter}
            zoom={11}
            style={{ height: "75vh", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            <LocationMarker
              userLocation={userLocation}
              setUserLocation={setUserLocation}
            />

            {cafes.map((cafe, index) => (
              <CafeMarker
                key={index}
                position={cafe.coordinates}
                name={cafe.name}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
