"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Aniimo, UpgradeRules } from "@/types";
import rawAniimos from "@/data/aniimos.json";
import rawRules from "@/data/upgrade_rules.json";
import { ELEMENT_COLORS } from "@/lib/constants";
import {
  Calculator as CalcIcon,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Plus,
  Trash2,
  Info,
} from "lucide-react";

const allAniimos = rawAniimos as Aniimo[];
const upgradeRules = rawRules as UpgradeRules;

function CalculatorContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("aniimo");

  // Selected Aniimo
  const [selectedAniimo, setSelectedAniimo] = useState<Aniimo>(() => {
    if (initialSlug) {
      const found = allAniimos.find((a) => a.slug === initialSlug);
      if (found) return found;
    }
    return allAniimos[0]; // Default to Infergon
  });

  // Stages: 1 through 7
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [targetStage, setTargetStage] = useState<number>(7);

  // User's Owned Inventory
  const [ownedDewdrops, setOwnedDewdrops] = useState<number>(0);
  const [ownedStones, setOwnedStones] = useState<number>(0);
  const [ownedFlux, setOwnedFlux] = useState<number>(0);
  const [ownedPhenomena, setOwnedPhenomena] = useState<number>(0);

  // Saved Tracker list in LocalStorage
  interface SavedTrack {
    id: string;
    aniimoId: string;
    currentStage: number;
    targetStage: number;
    updatedAt: string;
  }
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);

  // Load saved tracks on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aniimo_power_tracks");
      if (saved) {
        setSavedTracks(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveTrack = () => {
    const newTrack: SavedTrack = {
      id: `${selectedAniimo.id}-${Date.now()}`,
      aniimoId: selectedAniimo.id,
      currentStage,
      targetStage,
      updatedAt: new Date().toLocaleDateString(),
    };
    const updated = [newTrack, ...savedTracks.filter((t) => t.aniimoId !== selectedAniimo.id)];
    setSavedTracks(updated);
    try {
      localStorage.setItem("aniimo_power_tracks", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeTrack = (trackId: string) => {
    const updated = savedTracks.filter((t) => t.id !== trackId);
    setSavedTracks(updated);
    try {
      localStorage.setItem("aniimo_power_tracks", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Calculate Required Costs between Current and Target
  const calculation = useMemo(() => {
    const validCurrent = Math.min(currentStage, targetStage);
    const validTarget = Math.max(currentStage, targetStage);

    let requiredDewdrops = 0;
    let requiredStones = 0;
    let requiredPhenomena = 0;
    const stagesUnlocked: typeof upgradeRules.stages = [];

    // Stages are indexed 1..7. Stage 1 has 0 cost.
    for (let s = validCurrent + 1; s <= validTarget; s++) {
      const stageData = upgradeRules.stages.find((st) => st.stage === s);
      if (stageData) {
        requiredDewdrops += stageData.dewdropCrystals;
        requiredStones += stageData.elementalStones;
        requiredPhenomena += stageData.phenomenaCrystals;
        stagesUnlocked.push(stageData);
      }
    }

    // Remaining after deducting owned inventory
    const remDewdrops = Math.max(0, requiredDewdrops - ownedDewdrops);

    // Flux crystal can substitute 1-to-1 for missing stones
    const effectiveStonesOwned = ownedStones + ownedFlux;
    const remStones = Math.max(0, requiredStones - effectiveStonesOwned);

    const remPhenomena = Math.max(0, requiredPhenomena - ownedPhenomena);

    // Progress percentage
    const totalItemsRequired = requiredDewdrops + requiredStones * 20 + requiredPhenomena * 100;
    const totalItemsOwned =
      Math.min(ownedDewdrops, requiredDewdrops) +
      Math.min(effectiveStonesOwned, requiredStones) * 20 +
      Math.min(ownedPhenomena, requiredPhenomena) * 100;

    const progressPct =
      totalItemsRequired > 0
        ? Math.min(100, Math.round((totalItemsOwned / totalItemsRequired) * 100))
        : 100;

    return {
      requiredDewdrops,
      requiredStones,
      requiredPhenomena,
      remDewdrops,
      remStones,
      remPhenomena,
      stagesUnlocked,
      progressPct,
    };
  }, [currentStage, targetStage, ownedDewdrops, ownedStones, ownedFlux, ownedPhenomena]);

  const elemConfig = ELEMENT_COLORS[selectedAniimo.element];
  const stoneName = `${selectedAniimo.element} Stone`;

  return (
    <div className="min-h-screen bg-[#f1f3ec] text-[#1d2046] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e2e5da] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#d2d7c5] text-xs font-bold text-[#1d2046] mb-2 shadow-2xs">
              <CalcIcon className="w-3.5 h-3.5 text-[#cc5231]" />
              <span>Resonance & Ascension Calculator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d2046] tracking-tight">
              Aniimo Upgrade & Progress Tracker
            </h1>
            <p className="text-xs sm:text-sm text-[#4b5563] mt-1">
              Calculate exact Dewdrop Crystals, Elemental Stones, and Phenomena Crystals needed to reach Stage 7.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={saveTrack}
              className="px-4 py-2 rounded-full bg-[#1d2046] text-white text-xs font-bold hover:bg-[#cc5231] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Save Progress</span>
            </button>
          </div>
        </div>

        {/* Aniimo Selector Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e5da] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Circular Avatar */}
            <div
              className={`relative w-20 h-20 rounded-full shrink-0 p-1 ${
                selectedAniimo.isPrismana
                  ? "rainbow-border rainbow-glow"
                  : `border-4 ${elemConfig.border} bg-white shadow-sm`
              }`}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#f1f3ec]">
                <Image
                  src={selectedAniimo.image}
                  alt={selectedAniimo.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                  priority
                />
              </div>
            </div>

            {/* Dropdown Selector */}
            <div className="flex-1">
              <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider block mb-1">
                Selected Aniimo
              </label>
              <select
                value={selectedAniimo.id}
                onChange={(e) => {
                  const found = allAniimos.find((a) => a.id === e.target.value);
                  if (found) setSelectedAniimo(found);
                }}
                className="w-full text-base sm:text-lg font-extrabold text-[#1d2046] bg-[#f1f3ec] border border-[#d6dacb] rounded-2xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#cc5231]"
              >
                {allAniimos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.element} • v{a.version} {a.isPrismana ? "• Prismana" : ""})
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 mt-1.5 text-xs">
                <span className={`font-bold ${elemConfig.text}`}>{selectedAniimo.element} Element</span>
                <span>•</span>
                <span className="text-[#6b7280]">Requires {stoneName}</span>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="w-full md:w-auto bg-[#f8faf5] p-3.5 rounded-2xl border border-gray-100 flex items-center justify-around gap-6 text-center">
            <div>
              <div className="text-[10px] font-bold text-[#6b7280] uppercase">Max Stage</div>
              <div className="text-lg font-black text-[#1d2046]">Stage 7</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div>
              <div className="text-[10px] font-bold text-[#6b7280] uppercase">Total Crystals</div>
              <div className="text-lg font-black text-[#cc5231]">850</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div>
              <div className="text-[10px] font-bold text-[#6b7280] uppercase">Total Stones</div>
              <div className="text-lg font-black text-[#2c5eb3]">42</div>
            </div>
          </div>
        </div>

        {/* Stages Selection Grid: Current -> Target */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Current Stage */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e5da] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">
                Current Evolution Stage
              </label>
              <span className="text-xs font-bold text-[#1d2046] bg-[#f1f3ec] px-2.5 py-1 rounded-full">
                Starting Level
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((stageNum) => (
                <button
                  key={stageNum}
                  onClick={() => setCurrentStage(stageNum)}
                  className={`py-3 rounded-2xl font-black text-sm transition-all ${
                    currentStage === stageNum
                      ? "bg-[#1d2046] text-white shadow-sm scale-105"
                      : "bg-[#f1f3ec] text-[#1d2046] hover:bg-[#e4e8dc]"
                  }`}
                >
                  S{stageNum}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#6b7280] font-medium bg-[#f8faf5] p-3 rounded-xl border border-gray-100 flex items-center justify-between">
              <span>Current Status:</span>
              <strong className="text-[#1d2046]">
                {upgradeRules.stages[currentStage - 1].name}
              </strong>
            </div>
          </div>

          {/* Target Stage */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e5da] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">
                Goal / Target Stage
              </label>
              <span className="text-xs font-bold text-[#cc5231] bg-[#cc5231]/10 px-2.5 py-1 rounded-full">
                Target Milestone
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((stageNum) => {
                const isUnder = stageNum < currentStage;
                return (
                  <button
                    key={stageNum}
                    disabled={isUnder}
                    onClick={() => setTargetStage(stageNum)}
                    className={`py-3 rounded-2xl font-black text-sm transition-all ${
                      targetStage === stageNum
                        ? "bg-[#cc5231] text-white shadow-sm scale-105"
                        : isUnder
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-[#f1f3ec] text-[#1d2046] hover:bg-[#e4e8dc]"
                    }`}
                  >
                    S{stageNum}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-[#6b7280] font-medium bg-[#f8faf5] p-3 rounded-xl border border-gray-100 flex items-center justify-between">
              <span>Goal Unlock:</span>
              <strong className="text-[#cc5231]">
                {upgradeRules.stages[targetStage - 1].benefit}
              </strong>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar to Goal */}
        <div className="bg-white rounded-3xl p-6 border border-[#e2e5da] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#cc5231]" />
              <span className="font-extrabold text-sm text-[#1d2046]">
                Stage {currentStage} → Stage {targetStage} Completion
              </span>
            </div>
            <span className="text-sm font-black text-[#1d2046]">{calculation.progressPct}%</span>
          </div>

          <div className="w-full bg-[#f1f3ec] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#d6dacb]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2c5eb3] via-[#cc5231] to-emerald-500 transition-all duration-500"
              style={{ width: `${calculation.progressPct}%` }}
            />
          </div>
        </div>

        {/* Exact Materials Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Dewdrop Crystals */}
          <div className="bg-white rounded-3xl p-5 border border-[#e2e5da] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6b7280] uppercase">Dewdrop Crystals</span>
              <span className="text-[11px] font-bold text-[#2c5eb3] bg-blue-50 px-2 py-0.5 rounded-full">
                Regional
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1d2046]">{calculation.remDewdrops}</span>
              <span className="text-xs text-[#6b7280]">
                needed ({calculation.requiredDewdrops} total)
              </span>
            </div>
            <div className="text-xs text-[#6b7280] bg-[#f8faf5] p-2.5 rounded-xl border border-gray-100 leading-relaxed">
              Breezy Plains or Whisperwake Isles Bloom drops.
            </div>
          </div>

          {/* Elemental Stones */}
          <div className="bg-white rounded-3xl p-5 border border-[#e2e5da] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6b7280] uppercase">{stoneName}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${elemConfig.bg} text-white`}>
                Ascension
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1d2046]">{calculation.remStones}</span>
              <span className="text-xs text-[#6b7280]">
                needed ({calculation.requiredStones} total)
              </span>
            </div>
            <div className="text-xs text-[#6b7280] bg-[#f8faf5] p-2.5 rounded-xl border border-gray-100 leading-relaxed">
              Flux Crystals can stand in 1:1 for any missing stone.
            </div>
          </div>

          {/* Phenomena Crystals */}
          <div className="bg-white rounded-3xl p-5 border border-[#e2e5da] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6b7280] uppercase">Phenomena Crystals</span>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                Endgame
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1d2046]">{calculation.remPhenomena}</span>
              <span className="text-xs text-[#6b7280]">
                needed ({calculation.requiredPhenomena} total)
              </span>
            </div>
            <div className="text-xs text-[#6b7280] bg-[#f8faf5] p-2.5 rounded-xl border border-gray-100 leading-relaxed">
              Required only for Stage 6 (x1) and Stage 7 (x1).
            </div>
          </div>
        </div>

        {/* User Inventory Input Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e2e5da] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-[#1d2046]">
                Deduct What You Currently Own
              </h3>
              <p className="text-xs text-[#6b7280]">
                Enter your current inventory count to get the exact net remaining materials.
              </p>
            </div>
            <button
              onClick={() => {
                setOwnedDewdrops(0);
                setOwnedStones(0);
                setOwnedFlux(0);
                setOwnedPhenomena(0);
              }}
              className="text-xs font-bold text-[#cc5231] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Inventory
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-[#6b7280] block mb-1">
                Dewdrops Owned
              </label>
              <input
                type="number"
                min="0"
                value={ownedDewdrops || ""}
                onChange={(e) => setOwnedDewdrops(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-[#f1f3ec] border border-[#d6dacb] font-bold text-[#1d2046] focus:outline-none focus:ring-2 focus:ring-[#cc5231]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6b7280] block mb-1">
                {selectedAniimo.element} Stones
              </label>
              <input
                type="number"
                min="0"
                value={ownedStones || ""}
                onChange={(e) => setOwnedStones(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-[#f1f3ec] border border-[#d6dacb] font-bold text-[#1d2046] focus:outline-none focus:ring-2 focus:ring-[#cc5231]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6b7280] block mb-1">
                Flux Crystals (Sub)
              </label>
              <input
                type="number"
                min="0"
                value={ownedFlux || ""}
                onChange={(e) => setOwnedFlux(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-[#f1f3ec] border border-[#d6dacb] font-bold text-[#1d2046] focus:outline-none focus:ring-2 focus:ring-[#cc5231]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6b7280] block mb-1">
                Phenomena Crystals
              </label>
              <input
                type="number"
                min="0"
                value={ownedPhenomena || ""}
                onChange={(e) => setOwnedPhenomena(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-[#f1f3ec] border border-[#d6dacb] font-bold text-[#1d2046] focus:outline-none focus:ring-2 focus:ring-[#cc5231]"
              />
            </div>
          </div>
        </div>

        {/* Saved Tracking Aniimos List */}
        {savedTracks.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-[#e2e5da] shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-[#1d2046] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Your Saved Aniimo Progress Tracks</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {savedTracks.map((tr) => {
                const trackedAniimo = allAniimos.find((a) => a.id === tr.aniimoId);
                if (!trackedAniimo) return null;
                const trackElem = ELEMENT_COLORS[trackedAniimo.element];

                return (
                  <div
                    key={tr.id}
                    className="p-3.5 rounded-2xl bg-[#f8faf5] border border-gray-100 flex items-center justify-between gap-3 group"
                  >
                    <button
                      onClick={() => {
                        setSelectedAniimo(trackedAniimo);
                        setCurrentStage(tr.currentStage);
                        setTargetStage(tr.targetStage);
                      }}
                      className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                    >
                      <div
                        className={`relative w-10 h-10 rounded-full shrink-0 overflow-hidden ${
                          trackedAniimo.isPrismana ? "rainbow-border p-0.5" : `border-2 ${trackElem.border}`
                        }`}
                      >
                        <Image
                          src={trackedAniimo.image}
                          alt={trackedAniimo.name}
                          fill
                          className="object-cover rounded-full"
                          sizes="40px"
                        />
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-xs text-[#1d2046] group-hover:text-[#cc5231] transition-colors truncate">
                          {trackedAniimo.name}
                        </div>
                        <div className="text-[11px] text-[#6b7280]">
                          Stage {tr.currentStage} → Stage {tr.targetStage}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => removeTrack(tr.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage Milestone Checklist */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e5da] shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-[#1d2046] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#cc5231]" />
            <span>Stage-by-Stage Upgrade Milestone Reference</span>
          </h3>

          <div className="divide-y divide-gray-100">
            {upgradeRules.stages.map((st) => (
              <div
                key={st.stage}
                className={`py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                  st.stage >= currentStage && st.stage <= targetStage ? "bg-amber-50/40 -mx-3 px-3 rounded-xl" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                      st.stage <= currentStage
                        ? "bg-emerald-600 text-white"
                        : st.stage <= targetStage
                        ? "bg-[#1d2046] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {st.stage}
                  </span>
                  <div>
                    <span className="font-extrabold text-sm text-[#1d2046]">{st.name}</span>
                    <span className="text-xs text-[#6b7280] ml-2 font-medium">{st.benefit}</span>
                  </div>
                </div>

                <div className="text-xs font-bold text-[#1d2046] flex items-center gap-3 sm:text-right">
                  {st.stage === 1 ? (
                    <span className="text-gray-400">Unlocked by default</span>
                  ) : (
                    <>
                      <span>{st.dewdropCrystals} Crystals</span>
                      <span>•</span>
                      <span>{st.elementalStones} Stones</span>
                      {st.phenomenaCrystals > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-purple-700">{st.phenomenaCrystals} Phenomena</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f1f3ec] p-8 text-center">Loading Calculator...</div>}>
      <CalculatorContent />
    </Suspense>
  );
}

