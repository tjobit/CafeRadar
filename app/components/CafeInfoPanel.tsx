"use client";

import React from "react";
import { CafeData } from "./CafeMapCore";

interface CafeInfoPanelProps {
  cafe: CafeData;
  onClose: () => void;
}

const CafeInfoPanel: React.FC<CafeInfoPanelProps> = ({ cafe, onClose }) => {
  const handleCall = () => {
    if (cafe.phone) {
      window.open(`tel:${cafe.phone}`, "_self");
    }
  };

  const handleWebsite = () => {
    if (cafe.website) {
      window.open(cafe.website, "_blank");
    }
  };

  const handleDirections = () => {
    const [lat, lng] = cafe.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-emerald-600 bg-emerald-50";
    if (rating >= 4.0) return "text-blue-600 bg-blue-50";
    if (rating >= 3.5) return "text-yellow-600 bg-yellow-50";
    return "text-orange-600 bg-orange-50";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 max-w-md w-full max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 truncate">
                {cafe.name}
              </h2>
              <p className="text-sm text-slate-600 mt-1">{cafe.address}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-3 rounded-full hover:bg-slate-100 transition-colors"
              style={{ marginRight: "8px", marginTop: "-4px" }}
            >
              <svg
                className="w-5 h-5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Heures d'ouverture */}
          {cafe.opening_hours && (
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Horaires</h3>
              <div className="text-sm text-slate-600">{cafe.opening_hours}</div>
            </div>
          )}

          {/* Équipements */}
          {cafe.facilities && (
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Équipements</h3>
              <div className="flex flex-wrap gap-2">
                {cafe.facilities.wifi && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    📶 WiFi
                  </span>
                )}
                {cafe.facilities.outdoor_seating && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    🌿 Terrasse
                  </span>
                )}
                {cafe.facilities.wheelchair && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                    ♿ Accessible
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Informations de contact */}
          <div className="grid grid-cols-1 gap-3">
            {cafe.phone && (
              <button
                onClick={handleCall}
                className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-emerald-900">
                    Appeler
                  </div>
                  <div className="text-sm text-emerald-700">{cafe.phone}</div>
                </div>
              </button>
            )}

            {cafe.website && (
              <button
                onClick={handleWebsite}
                className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-blue-900">
                    Site web
                  </div>
                  <div className="text-sm text-blue-700 truncate">
                    Visiter le site
                  </div>
                </div>
              </button>
            )}

            <button
              onClick={handleDirections}
              className="flex items-center gap-3 p-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-indigo-900">
                  Itinéraire
                </div>
                <div className="text-sm text-indigo-700">Ouvrir dans Maps</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeInfoPanel;
