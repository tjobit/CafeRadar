"use client";

import { LatLngTuple } from "leaflet";
import { Marker, Popup } from "react-leaflet";

// Simple coffee marker
export const createCoffeeIcon = () => {
  if (typeof window === "undefined") return null;
  
  const L = require("leaflet");
  return L.divIcon({
    html: '<div style="font-size: 24px;">☕</div>',
    className: 'simple-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Simple user location marker
export const createUserIcon = () => {
  if (typeof window === "undefined") return null;
  
  const L = require("leaflet");
  return L.divIcon({
    html: '<div style="font-size: 20px;">📍</div>',
    className: 'simple-marker',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
};

interface LocationMarkerProps {
  userLocation: LatLngTuple | null;
  setUserLocation: (location: LatLngTuple | null) => void;
}

export function LocationMarker({ userLocation }: LocationMarkerProps) {
  if (!userLocation) return null;

  return (
    <Marker position={userLocation} icon={createUserIcon()}>
      <Popup>Votre position</Popup>
    </Marker>
  );
}

interface CafeMarkerProps {
  position: LatLngTuple;
  name: string;
}

export function CafeMarker({ position, name }: CafeMarkerProps) {
  return (
    <Marker position={position} icon={createCoffeeIcon()}>
      <Popup>{name}</Popup>
    </Marker>
  );
}
