"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Calculator, ShieldAlert, Sparkles, X, ChevronRight, Layers } from "lucide-react";
import { Aniimo } from "@/types";
import { createAniimoSearchIndex } from "@/lib/search";
import rawAniimos from "@/data/aniimos.json";
import { ELEMENT_COLORS } from "@/lib/constants";

const aniimosData = rawAniimos as Aniimo[];
const fuse = createAniimoSearchIndex(aniimosData);

interface NavbarProps {
  onSelectAniimo?: (aniimo: Aniimo) => void;
}

export default function Navbar({ onSelectAniimo }: NavbarProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Aniimo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const searchRes = fuse.search(query.trim()).slice(0, 6);
    setResults(searchRes.map((r) => r.item));
    setIsOpen(true);
  }, [query]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f1f3ec]/95 backdrop-blur-md border-b border-[#e2e5da] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#1d2046] shadow-sm group-hover:scale-105 transition-transform">
            <Image
              src="/images/logo.png"
              alt="Aniimo Power"
              fill
              className="object-cover"
              sizes="36px"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[#1d2046] tracking-tight text-lg">
                ANIIMO<span className="text-[#cc5231]">POWER</span>
              </span>
              <span className="text-[10px] font-bold bg-[#1d2046] text-[#f1f3ec] px-1.5 py-0.5 rounded tracking-wide">
                1.0 & 1.1
              </span>
            </div>
            <div className="text-[11px] text-[#6b7280] font-mono leading-none">aniimopower.app</div>
          </div>
        </Link>

        {/* Top Fast Typo-Forgiving Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7b8190]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setIsOpen(true)}
              placeholder="Instant search Aniimo, artifact, skill (typo forgiving)..."
              className="w-full pl-10 pr-9 py-2 rounded-full bg-white text-sm text-[#1d2046] placeholder-[#9ca3af] border border-[#d6dacb] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cc5231] focus:border-transparent transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1d2046]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dropdown Results */}
          {isOpen && results.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#e2e5da] overflow-hidden z-50 animate-fade-in divide-y divide-gray-100">
              <div className="px-3.5 py-2 text-[11px] font-semibold text-[#6b7280] bg-[#f8faf5] flex justify-between items-center">
                <span>Top Matches for &quot;{query}&quot;</span>
                <span className="text-[10px] text-[#9ca3af]">Forgiving Fuzzy Search</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {results.map((item) => {
                  const elemColor = ELEMENT_COLORS[item.element];
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (onSelectAniimo) onSelectAniimo(item);
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-[#f1f3ec] transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`relative w-9 h-9 rounded-full overflow-hidden shrink-0 ${item.isPrismana ? "rainbow-border p-[2px]" : "border-2 border-gray-200"
                            }`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-full"
                            sizes="36px"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1d2046] group-hover:text-[#cc5231] transition-colors">
                              {item.name}
                            </span>
                            {item.isPrismana && (
                              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white">
                                PRISMANA
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                            <span className={`font-semibold ${elemColor.text}`}>{item.element}</span>
                            <span>•</span>
                            <span>{item.evolutionStage}</span>
                            {item.heldItem && (
                              <>
                                <span>•</span>
                                <span className="text-[#1d2046] font-medium">{item.heldItem}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${pathname === "/"
                ? "bg-[#1d2046] text-white shadow-sm"
                : "text-[#1d2046] hover:bg-[#e4e8dc]"
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Guide</span>
          </Link>

          <Link
            href="/calculator"
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${pathname === "/calculator"
                ? "bg-[#1d2046] text-white shadow-sm"
                : "text-[#1d2046] hover:bg-[#e4e8dc]"
              }`}
          >
            <Calculator className="w-3.5 h-3.5 text-[#ecd86a]" />
            <span>Calculator</span>
          </Link>

          <Link
            href="/held-items"
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              pathname === "/held-items"
                ? "bg-[#1d2046] text-white shadow-sm"
                : "text-[#1d2046] hover:bg-[#e4e8dc]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#cc5231]" />
            <span>Held Items</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

