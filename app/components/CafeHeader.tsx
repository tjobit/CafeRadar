"use client";

interface CafeHeaderProps {
  onSearchInArea: () => void;
  onGeolocationClick: () => void;
}

export default function CafeHeader({
  onSearchInArea,
  onGeolocationClick,
}: CafeHeaderProps) {
  return (
    <div className="bg-gradient-cream-beige border-b-2 border-coffee-light shadow-lg">
      <div className="container mx-auto px-4 py-4">
        {/* Logo et titre */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-caramel-chocolate rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">☕</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-coffee-dark">Cafe Radar</h1>
              <p className="text-sm text-coffee-medium">Trouvez les meilleurs cafés près de vous</p>
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
          <button
            onClick={onSearchInArea}
            className="px-6 py-3 bg-gradient-caramel-chocolate text-cream font-semibold rounded-xl hover-chocolate-caramel transition-all shadow-md flex items-center space-x-2"
          >
            <span className="text-lg">🔍</span>
            <span className="text-cream">Chercher dans cette zone</span>
          </button>

          <button
            onClick={onGeolocationClick}
            className="px-6 py-3 bg-gradient-medium-dark-coffee text-cream font-semibold rounded-xl hover-dark-medium-coffee transition-all shadow-md flex items-center space-x-2"
          >
            <span className="text-lg">📍</span>
            <span className="text-cream">Ma Position</span>
          </button>
        </div>
      </div>
    </div>
  );
}
