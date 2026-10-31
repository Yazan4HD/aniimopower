"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import AniimoCard from "@/components/AniimoCard";
import AniimoModal from "@/components/AniimoModal";
import { Aniimo, ElementType } from "@/types";
import rawAniimos from "@/data/aniimos.json";
import { createAniimoSearchIndex } from "@/lib/search";
import { Sparkles, Frown, Shield, Zap, Layers } from "lucide-react";

const allAniimos = rawAniimos as Aniimo[];
const fuse = createAniimoSearchIndex(allAniimos);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedElement, setSelectedElement] = useState<ElementType | "All">("All");
  const [selectedVersion, setSelectedVersion] = useState<"All" | "1.0" | "1.1">("All");
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [isPrismanaOnly, setIsPrismanaOnly] = useState<boolean>(false);
  const [activeAniimo, setActiveAniimo] = useState<Aniimo | null>(null);

  // Filtered list
  const filteredAniimos = useMemo(() => {
    let result = allAniimos;

    // 1. Search Query with Typo Forgiving Fuzzy Search
    if (searchQuery.trim()) {
      const searchRes = fuse.search(searchQuery.trim());
      result = searchRes.map((r) => r.item);
    }

    // 2. Element Filter
    if (selectedElement !== "All") {
      result = result.filter((a) => a.element === selectedElement);
    }

    // 3. Version Filter
    if (selectedVersion !== "All") {
      result = result.filter((a) => a.version === selectedVersion);
    }

    // 4. Evolution Stage Filter
    if (selectedStage !== "All") {
      result = result.filter((a) => {
        if (selectedStage === "Final Stage") return a.isFinalForm;
        return a.evolutionStage === selectedStage || a.stage.toLowerCase().includes(selectedStage.toLowerCase().replace(" stage", ""));
      });
    }

    // 5. Prismana Only Filter
    if (isPrismanaOnly) {
      result = result.filter((a) => a.isPrismana);
    }

    return result;
  }, [searchQuery, selectedElement, selectedVersion, selectedStage, isPrismanaOnly]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedElement("All");
    setSelectedVersion("All");
    setSelectedStage("All");
    setIsPrismanaOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f3ec] text-[#1d2046] flex flex-col">
      {/* Top Navigation */}
      <Navbar onSelectAniimo={(aniimo) => setActiveAniimo(aniimo)} />

      {/* Hero with Centered Big Logo & Main Typo-Forgiving Search */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={allAniimos.length}
      />

      {/* Dynamic Filter Controls Bar */}
      <FilterBar
        selectedElement={selectedElement}
        onSelectElement={setSelectedElement}
        selectedVersion={selectedVersion}
        onSelectVersion={setSelectedVersion}
        selectedStage={selectedStage}
        onSelectStage={setSelectedStage}
        isPrismanaOnly={isPrismanaOnly}
        onTogglePrismana={() => setIsPrismanaOnly(!isPrismanaOnly)}
        totalFiltered={filteredAniimos.length}
        totalAll={allAniimos.length}
        onResetFilters={handleResetFilters}
      />

      {/* Cards Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        {filteredAniimos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredAniimos.map((aniimo) => (
              <AniimoCard
                key={aniimo.id}
                aniimo={aniimo}
                onClick={() => setActiveAniimo(aniimo)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-[#e2e5da] shadow-sm my-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Frown className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#1d2046] mb-1">No Aniimos Match Your Search</h3>
            <p className="text-xs text-[#6b7280] mb-5">
              We couldn&apos;t find any Aniimo matching your current filter criteria or keywords.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-full bg-[#1d2046] text-white text-xs font-bold hover:bg-[#cc5231] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <AniimoModal
        aniimo={activeAniimo}
        onClose={() => setActiveAniimo(null)}
      />

      {/* Speed Footer */}
      <footer className="border-t border-[#e2e5da] bg-white py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#6b7280]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#1d2046]">ANIIMO POWER</span>
            <span>•</span>
            <span className="font-mono text-[#cc5231]">aniimopower.app</span>
          </div>
          <div>
            Data drawn from official <span className="font-semibold text-[#1d2046]">Aniimo Power Cards</span> (v1.0 & v1.1)
          </div>
          <div className="text-[11px] text-gray-400">
            Blazing fast static delivery • Typo-forgiving search
          </div>
        </div>
      </footer>
    </div>
  );
}

