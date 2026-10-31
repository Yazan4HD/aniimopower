"use client";

import React from "react";
import Image from "next/image";
import { Search, Sparkles, X, Flame } from "lucide-react";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalCount: number;
}

export default function Hero({ searchQuery, onSearchChange, totalCount }: HeroProps) {
  const quickTags = ["Infergon", "Scorchhowl", "Prismana", "Echoing Grimoire", "Dewple", "Alpha Ignitis"];

  return (
    <section className="pt-6 pb-6 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
      {/* Domain Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e2e6d8] border border-[#d2d7c5] text-xs font-bold text-[#1d2046] mb-4 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>aniimopower.app</span>
        <span className="text-gray-400">•</span>
        <span className="text-[#cc5231]">v1.0 & v1.1 Complete Database</span>
      </div>

      {/* Big Logo in the Middle */}
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl h-28 sm:h-36 md:h-44 mb-3 group">
        <Image
          src="/images/logo.png"
          alt="Aniimo Power Logo"
          fill
          className="object-contain drop-shadow-md group-hover:scale-[1.02] transition-transform duration-300"
          priority
        />
      </div>

      <p className="max-w-2xl text-xs sm:text-sm text-[#4b5563] font-medium mb-6">
        The ultimate speed-optimized guide to level up, choose the optimal held item artifact, and master every Aniimo evolution line.
      </p>

      {/* Big Search Bar directly under Logo */}
      <div className="w-full max-w-2xl relative mb-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#cc5231]/20 via-[#d9ad26]/20 to-[#2c5eb3]/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative flex items-center bg-white rounded-full border-2 border-[#1d2046] shadow-lg">
            <Search className="ml-5 w-5 h-5 text-[#7b8190] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Aniimo name, element, skill, held item, or boss..."
              className="w-full px-4 py-3.5 sm:py-4 rounded-full text-base sm:text-lg text-[#1d2046] placeholder-[#9ca3af] focus:outline-none bg-transparent"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange("")}
                className="mr-4 p-1 rounded-full text-[#9ca3af] hover:text-[#1d2046] hover:bg-gray-100 transition-colors"
                title="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <div className="mr-5 hidden sm:flex items-center gap-1 text-[11px] font-mono font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                Typo Forgiving
              </div>
            )}
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 text-xs">
          <span className="text-[#6b7280] font-medium flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#cc5231]" /> Popular:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSearchChange(tag)}
              className="px-2.5 py-1 rounded-full bg-[#e5e9dc] hover:bg-[#1d2046] hover:text-white text-[#1d2046] text-xs font-semibold transition-all shadow-2xs"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

