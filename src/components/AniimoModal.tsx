"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Aniimo, HeldItem } from "@/types";
import { ELEMENT_COLORS, PERSONALITY_DESCRIPTIONS } from "@/lib/constants";
import { X, Sparkles, Swords, Zap, Calculator, MapPin, Check, GitBranch, Info, AlertCircle } from "lucide-react";
import heldItemsData from "@/data/held_items.json";

interface AniimoModalProps {
  aniimo: Aniimo | null;
  onClose: () => void;
}

export default function AniimoModal({ aniimo, onClose }: AniimoModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!aniimo) return null;

  const elem = ELEMENT_COLORS[aniimo.element];
  const isV11 = aniimo.version === "1.1";
  const itemDetail = (heldItemsData as HeldItem[]).find(
    (h) => h.name.toLowerCase() === (aniimo.heldItem || "").toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#12142d]/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#e2e5da] overflow-hidden my-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className={`h-3 w-full ${elem.bg}`} />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#f1f3ec] hover:bg-[#1d2046] hover:text-white text-[#1d2046] transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Top Row: Circular Avatar + Details + Full-Body Render */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Big Circular Avatar with Prismana Rainbow Glow */}
              <div
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full shrink-0 p-1 ${
                  aniimo.isPrismana ? "rainbow-border rainbow-glow" : `border-4 ${elem.border} bg-white shadow-md`
                }`}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#f1f3ec]">
                  <Image
                    src={aniimo.image}
                    alt={aniimo.name}
                    fill
                    className="object-cover"
                    sizes="120px"
                    priority
                  />
                </div>
                {aniimo.isPrismana && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Prismana
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-md text-white ${elem.bg}`}>
                    {aniimo.element} Element
                  </span>
                  {aniimo.secondaryElement && (
                    <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                      +{aniimo.secondaryElement} Dual Type
                    </span>
                  )}
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                      isV11
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-[#1d2046] bg-[#f1f3ec] border border-[#d6dacb]"
                    }`}
                  >
                    {isV11 ? "New in 1.1" : `Version ${aniimo.version}`}
                  </span>
                  <span className="text-xs font-bold text-[#6b7280] bg-gray-100 px-2 py-0.5 rounded-md capitalize">
                    {aniimo.stage || "unknown"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1d2046] tracking-tight">
                  {aniimo.name}
                </h2>

                <p className="text-xs sm:text-sm text-[#4b5563] mt-1">
                  {isV11
                    ? "New species introduced in the Version 1.1 expansion. Official combat build ratings are pending Alpha raid calibration."
                    : `Optimal combat configuration for ${aniimo.name}. Balanced for endgame Boss raids, Bloom challenges, and PvP.`}
                </p>
              </div>
            </div>

            {/* Official Full-Body Render from Wiki (if available) */}
            {aniimo.renderImage && (
              <div className="relative w-28 h-36 sm:w-32 sm:h-40 shrink-0 hidden sm:block">
                <Image
                  src={aniimo.renderImage}
                  alt={`${aniimo.name} Full Render`}
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="160px"
                />
              </div>
            )}
          </div>

          {/* Version 1.0 Complete Build Section */}
          {!isV11 ? (
            <div className="space-y-4">
              {/* Personality Card */}
              {aniimo.personality && (
                <div className="p-4 rounded-2xl bg-[#f8faf5] border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">
                      Optimal Nature / Personality
                    </div>
                    <div className="text-base font-extrabold text-[#1d2046] mt-0.5">
                      {aniimo.personality}{" "}
                      <span className="text-xs font-normal text-gray-500">
                        ({PERSONALITY_DESCRIPTIONS[aniimo.personality] || "Synergistic combat profile"})
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-[#cc5231] bg-[#cc5231]/10 px-3 py-1 rounded-full border border-[#cc5231]/20">
                    Highest Synergy
                  </span>
                </div>
              )}

              {/* Skills to Equip */}
              {aniimo.skills && (
                <div className="p-4 rounded-2xl bg-white border border-[#e2e5da] space-y-2">
                  <div className="text-xs font-bold text-[#1d2046] uppercase tracking-wider flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-[#cc5231]" />
                    <span>Equipped Skill Pair</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {aniimo.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#f1f3ec] border border-[#d6dacb] flex items-center gap-2"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#1d2046] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm text-[#1d2046] truncate">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Held Item & Artifact Information */}
              {aniimo.heldItem && (
                <div className="p-4 rounded-2xl bg-[#fffcf5] border border-[#ebdcc7] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#b45309] uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      <span>Best-in-Slot Held Item (Artifact)</span>
                    </div>
                    <Link
                      href="/held-items"
                      className="text-xs font-bold text-[#cc5231] hover:underline"
                    >
                      View Farm Map →
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    {itemDetail?.icon && (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#ebdcc7] shrink-0 bg-white">
                        <Image
                          src={itemDetail.icon}
                          alt={aniimo.heldItem}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-extrabold text-base text-[#1d2046]">{aniimo.heldItem}</div>
                      {aniimo.alphaBoss && (
                        <div className="text-xs text-[#6b7280] font-medium">
                          Dropped by <strong className="text-[#cc5231]">{aniimo.alphaBoss}</strong>
                          {itemDetail?.location && ` • ${itemDetail.location}`}
                        </div>
                      )}
                    </div>
                  </div>
                  {itemDetail?.description && (
                    <p className="text-xs text-[#78350f] italic bg-amber-50/50 p-2 rounded-lg">
                      &quot;{itemDetail.description}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* Awakening Focus Stats */}
              {aniimo.awakeningFocus && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="font-bold text-[#6b7280]">Awakening Priority:</span>
                  {aniimo.awakeningFocus.map((stat, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full text-xs"
                    >
                      ★ {stat} Focus
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* UNIFIED Version 1.1 Detailed Template */
            <div className="space-y-4">
              {/* Role Box */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Assigned Combat Role
                  </div>
                  <div className="text-xs text-blue-700 mt-0.5">
                    Primary function in team battle formations
                  </div>
                </div>
                <span className="font-black text-sm text-blue-950 bg-white px-3.5 py-1 rounded-xl border border-blue-200 shadow-2xs">
                  {aniimo.role || "unknown"}
                </span>
              </div>

              {/* Evolution Requirement & Line */}
              <div className="p-4 rounded-2xl bg-[#f8faf5] border border-gray-200 space-y-1.5">
                <div className="text-xs font-bold text-[#1d2046] uppercase tracking-wider flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-emerald-600" />
                  <span>Evolution Requirement & Milestone</span>
                </div>
                <p className="text-sm font-semibold text-[#1d2046]">
                  {aniimo.evolution || "unknown"}
                </p>
              </div>

              {/* Encounter Location & How to Get */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>Habitat / How to Get</span>
                </div>
                <p className="text-sm font-semibold text-amber-950">
                  {aniimo.location || "unknown"}
                </p>
              </div>

              {/* Build Not Published Yet Notice */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Build not published yet (Version 1.1)
                </span>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Source: Official Aniimo Power Cards
            </span>

            <Link
              href={`/calculator?aniimo=${aniimo.slug}`}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1d2046] hover:bg-[#cc5231] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <Calculator className="w-4 h-4 text-[#ecd86a] group-hover:rotate-12 transition-transform" />
              <span>Track Upgrades in Calculator</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
