"use client";

import { LatLngTuple } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { CafeData } from "./CafeMapCore";

// Marqueur de café moderne avec animation
export const createModernCoffeeIcon = (isSelected = false) => {
  if (typeof window === "undefined") return null;

  const L = require("leaflet");
  const size = isSelected ? 40 : 32;
  const color = isSelected ? "#3B82F6" : "#10B981";

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, ${color}, ${color}DD);
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.5}px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.2s ease;
        transform: ${isSelected ? "scale(1.1)" : "scale(1)"};
      ">☕</div>
    `,
    className: "modern-cafe-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Marqueur de position utilisateur moderne
export const createModernUserIcon = () => {
  if (typeof window === "undefined") return null;

  const L = require("leaflet");
  return L.divIcon({
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #EF4444, #DC2626);
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        box-shadow: 0 4px 12px rgba(239,68,68,0.3);
        animation: pulse 2s infinite;
      ">📍</div>
      <style>
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
      </style>
    `,
    className: "modern-user-marker",
    iconSize: [24, 24],
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
    <Marker position={userLocation} icon={createModernUserIcon()}>
      <Popup>
        <div className="text-center p-2">
          <div className="text-lg font-semibold text-slate-800 mb-1">
            📍 Votre position
          </div>
          <div className="text-sm text-slate-600">Vous êtes ici</div>
        </div>
      </Popup>
    </Marker>
  );
}

interface CafeMarkerProps {
  position: LatLngTuple;
  cafe: CafeData;
  isSelected?: boolean;
  onClick: () => void;
  onDetailsClick?: () => void;
}

export function CafeMarker({
  position,
  cafe,
  isSelected = false,
  onClick,
  onDetailsClick,
}: CafeMarkerProps) {
  return (
    <Marker
      position={position}
      icon={createModernCoffeeIcon(isSelected)}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="max-w-xs p-3">
          <h3 className="font-bold text-slate-900 mb-1">{cafe.name}</h3>
          <p className="text-sm text-slate-600 mb-3">{cafe.address}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {cafe.facilities.wifi && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                📶 WiFi
              </span>
            )}
            {cafe.facilities.outdoor_seating && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                🌿 Terrace
              </span>
            )}
            {cafe.facilities.wheelchair && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                ♿ Accessible
              </span>
            )}
          </div>

          {onDetailsClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDetailsClick();
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors font-medium"
            >
              View details
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
