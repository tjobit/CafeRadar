"use client";

interface CafeHeaderProps {
  onSearchInArea: () => void;
  onGeolocationClick: () => void;
  isLoading?: boolean;
}

export default function CafeHeader({
  onSearchInArea,
  onGeolocationClick,
  isLoading = false,
}: CafeHeaderProps) {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-xl">☕</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Cafe Radar</h1>
              <p className="text-sm text-slate-600 hidden sm:block">
                Découvrez les meilleurs cafés près de vous
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSearchInArea}
              disabled={isLoading}
              className="group px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 text-white font-medium rounded-xl transition-all duration-300 ease-out flex items-center gap-2 shadow-lg hover:shadow-xl scale-100 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
              style={{ transition: 'all 0.3s ease-out, transform 0.3s ease-out' }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Recherche...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">🔍</span>
                  <span className="hidden sm:inline">Chercher ici</span>
                </>
              )}
            </button>

            <button
              onClick={onGeolocationClick}
              className="group px-5 py-2.5 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-medium rounded-xl transition-all duration-300 ease-out flex items-center gap-2 shadow-lg hover:shadow-xl scale-100 hover:scale-105 cursor-pointer"
              style={{ transition: 'all 0.3s ease-out, transform 0.3s ease-out' }}
            >
              <span className="text-lg">📍</span>
              <span className="hidden sm:inline">Ma position</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
