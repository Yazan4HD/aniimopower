"use client";

import React from "react";
import { ElementType } from "@/types";
import { ELEMENT_COLORS } from "@/lib/constants";
import { Sparkles, RotateCcw, Filter, Check } from "lucide-react";

interface FilterBarProps {
  selectedElement: ElementType | "All";
  onSelectElement: (el: ElementType | "All") => void;
  selectedVersion: "All" | "1.0" | "1.1";
  onSelectVersion: (ver: "All" | "1.0" | "1.1") => void;
  selectedStage: string;
  onSelectStage: (stage: string) => void;
  isPrismanaOnly: boolean;
  onTogglePrismana: () => void;
  totalFiltered: number;
  totalAll: number;
  onResetFilters: () => void;
}

const ELEMENTS: (ElementType | "All")[] = [
  "All",
  "Fire",
  "Water",
  "Grass",
  "Lightning",
  "Ice",
  "Wind",
  "Earth",
  "Dark",
  "Light",
];

const STAGES = [
  { id: "All", label: "All Stages" },
  { id: "Single Stage", label: "Single Stage" },
  { id: "Base Stage", label: "Base Form" },
  { id: "Nova Stage", label: "Nova Stage" },
  { id: "Lumin Stage", label: "Lumin Stage (v1.1)" },
  { id: "Final Stage", label: "Final Form" },
];

export default function FilterBar({
  selectedElement,
  onSelectElement,
  selectedVersion,
  onSelectVersion,
  selectedStage,
  onSelectStage,
  isPrismanaOnly,
  onTogglePrismana,
  totalFiltered,
  totalAll,
  onResetFilters,
}: FilterBarProps) {
  const isFiltered =
    selectedElement !== "All" ||
    selectedVersion !== "All" ||
    selectedStage !== "All" ||
    isPrismanaOnly;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e5da] space-y-4">
        {/* Top Controls Row: Update Toggle + Evolution Stage + Prismana Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
          {/* Update Version Tabs: 1.0 or 1.1 or Both */}
          <div className="flex items-center gap-1.5 bg-[#f1f3ec] p-1 rounded-xl">
            <span className="text-[11px] font-bold text-[#6b7280] px-2 uppercase tracking-wider hidden sm:inline">
              Update:
            </span>
            {(["All", "1.0", "1.1"] as const).map((ver) => (
              <button
                key={ver}
                onClick={() => onSelectVersion(ver)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedVersion === ver
                    ? "bg-[#1d2046] text-white shadow-xs"
                    : "text-[#1d2046] hover:bg-[#e2e6d8]"
                }`}
              >
                {ver === "All" ? "Both Updates" : `v${ver}`}
              </button>
            ))}
          </div>

          {/* Evolution Stage Dropdown / Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider hidden sm:inline">
              Stage:
            </span>
            <select
              value={selectedStage}
              onChange={(e) => onSelectStage(e.target.value)}
              className="bg-[#f1f3ec] text-[#1d2046] text-xs font-bold rounded-xl px-3 py-1.5 border border-[#d6dacb] focus:outline-none focus:ring-2 focus:ring-[#cc5231]"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* Prismana Only Toggle */}
            <button
              onClick={onTogglePrismana}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isPrismanaOnly
                  ? "rainbow-border text-white shadow-sm font-extrabold"
                  : "bg-[#f1f3ec] text-[#1d2046] hover:bg-[#e4e8dc] border border-[#d6dacb]"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isPrismanaOnly ? "text-yellow-200" : "text-[#9333ea]"}`} />
              <span>Prismana Only</span>
              {isPrismanaOnly && <Check className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>

          {/* Reset Filters & Results Count */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs font-semibold text-[#6b7280]">
              Showing <strong className="text-[#1d2046]">{totalFiltered}</strong> of {totalAll}
            </span>
            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-xs font-bold text-[#cc5231] hover:underline"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Elements Filter Pills Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-[#6b7280] shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Element:
          </span>
          {ELEMENTS.map((elem) => {
            const isSelected = selectedElement === elem;
            const config = elem !== "All" ? ELEMENT_COLORS[elem] : null;

            return (
              <button
                key={elem}
                onClick={() => onSelectElement(elem)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? elem === "All"
                      ? "bg-[#1d2046] text-white shadow-sm"
                      : `${config?.bg} text-white shadow-sm`
                    : "bg-[#f1f3ec] text-[#1d2046] hover:bg-[#e2e6d8]"
                }`}
              >
                {config && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? "#ffffff" : config.hex }}
                  />
                )}
                <span>{elem}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

