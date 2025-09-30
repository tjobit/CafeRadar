"use client";

import dynamic from "next/dynamic";

const DynamicCafeMap = dynamic(() => import("./CafeMapCore"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">☕</div>
        <p className="text-coffee-dark">Chargement...</p>
      </div>
    </div>
  ),
});

export default function CafeMap() {
  return <DynamicCafeMap />;
}
