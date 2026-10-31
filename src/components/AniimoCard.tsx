"use client";

import React from "react";
import Image from "next/image";
import { Aniimo } from "@/types";
import { ELEMENT_COLORS } from "@/lib/constants";
import { Sparkles, Swords, Zap, MapPin, ChevronRight, Check, Compass, GitBranch, ShieldAlert } from "lucide-react";

interface AniimoCardProps {
  aniimo: Aniimo;
  onClick: () => void;
}

export default function AniimoCard({ aniimo, onClick }: AniimoCardProps) {
  const elem = ELEMENT_COLORS[aniimo.element];
  const isV11 = aniimo.version === "1.1";

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl p-4 border shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
        isV11 ? "border-blue-200/80 hover:border-blue-400" : "border-[#e2e5da] hover:border-[#1d2046]/40"
      }`}
    >
      {/* Top Header: Avatar + Title & Element */}
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          {/* Circular Image: Prismana with Rainbow Border or Regular Element Border */}
          <div
            className={`relative w-16 h-16 rounded-full shrink-0 p-[3px] transition-transform duration-200 group-hover:scale-105 ${
              aniimo.isPrismana
                ? "rainbow-border rainbow-glow"
                : `border-2 ${elem.border} bg-white shadow-2xs`
            }`}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[#f1f3ec]">
              <Image
                src={aniimo.image}
                alt={aniimo.name}
                fill
                className="object-cover"
                sizes="64px"
                loading="lazy"
              />
            </div>
            {aniimo.isPrismana && (
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-[9px] font-black px-1 py-0.2 rounded-full shadow-xs flex items-center">
                <Sparkles className="w-2.5 h-2.5" />
              </div>
            )}
          </div>

          {/* Name & Stage & Element */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md text-white ${elem.bg}`}
                >
                  {aniimo.element}
                </span>
                {aniimo.secondaryElement && (
                  <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md">
                    +{aniimo.secondaryElement}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                  isV11
                    ? "bg-blue-600 text-white shadow-2xs tracking-wide"
                    : "text-[#6b7280] bg-[#f1f3ec]"
                }`}
              >
                {isV11 ? "NEW IN 1.1" : `v${aniimo.version}`}
              </span>
            </div>

            <h3 className="font-extrabold text-base text-[#1d2046] tracking-tight truncate mt-1 group-hover:text-[#cc5231] transition-colors">
              {aniimo.name}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-[#6b7280] font-medium mt-0.5">
              <span className="capitalize">{aniimo.stage || "unknown"}</span>
              {!isV11 && aniimo.isFinalForm && (
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                  <Check className="w-2.5 h-2.5 mr-0.5" /> Final
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Section: v1.0 Builds vs UNIFIED v1.1 Card Template */}
        {!isV11 ? (
          /* Version 1.0 Card Layout */
          <div className="space-y-2.5 text-xs">
            {/* Personality */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {aniimo.personality && (
                <div className="flex items-center gap-1 bg-[#1d2046]/5 text-[#1d2046] font-bold px-2 py-0.5 rounded-md border border-[#1d2046]/10 text-[11px]">
                  <span>Personality:</span>
                  <span className="text-[#cc5231] font-extrabold">{aniimo.personality}</span>
                </div>
              )}
            </div>

            {/* Skills */}
            {aniimo.skills && aniimo.skills.length > 0 && (
              <div className="bg-[#f8faf5] p-2 rounded-xl border border-gray-100">
                <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Swords className="w-3 h-3 text-[#cc5231]" /> Recommended Skills
                </div>
                <div className="flex flex-col gap-1">
                  {aniimo.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-semibold text-[#1d2046] flex items-center gap-1.5 truncate"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#cc5231]"></span>
                      <span className="truncate">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Held Item & Alpha Boss */}
            {aniimo.heldItem && (
              <div className="bg-[#fdfbf6] p-2 rounded-xl border border-[#ebdcc7]/60">
                <div className="text-[10px] font-bold text-[#b45309] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Best Held Item
                </div>
                <div className="font-bold text-xs text-[#1d2046]">{aniimo.heldItem}</div>
                {aniimo.alphaBoss && (
                  <div className="text-[11px] text-[#6b7280] flex items-center gap-1 mt-0.5">
                    <span>Farm from:</span>
                    <span className="font-semibold text-[#cc5231]">{aniimo.alphaBoss}</span>
                  </div>
                )}
              </div>
            )}

            {/* Awakening Focus Stats */}
            {aniimo.awakeningFocus && aniimo.awakeningFocus.length > 0 && (
              <div className="flex items-center gap-1 text-[11px]">
                <span className="font-semibold text-[#6b7280]">Awakening:</span>
                <div className="flex flex-wrap gap-1">
                  {aniimo.awakeningFocus.map((stat, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded text-[10px] border border-emerald-200"
                    >
                      +{stat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* UNIFIED Version 1.1 Card Template */
          <div className="space-y-2 text-xs">
            {/* 1. Role */}
            <div className="bg-[#f0f4ff] p-2.5 rounded-xl border border-blue-100/80 flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                Combat Role
              </span>
              <span className="font-extrabold text-xs text-blue-950 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 shadow-2xs">
                {aniimo.role || "unknown"}
              </span>
            </div>

            {/* 2. Evolution Milestone */}
            <div className="bg-[#f8faf5] p-2.5 rounded-xl border border-gray-100 space-y-0.5">
              <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-emerald-600" />
                <span>Evolution Milestone</span>
              </div>
              <div className="text-xs font-semibold text-[#1d2046] leading-tight line-clamp-2">
                {aniimo.evolution || "unknown"}
              </div>
            </div>

            {/* 3. Location / How to Get */}
            <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 space-y-0.5">
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600" />
                <span>Habitat / How to Get</span>
              </div>
              <div className="text-xs text-[#1d2046] font-medium leading-tight line-clamp-2">
                {aniimo.location || "unknown"}
              </div>
            </div>

            {/* 4. Build Status */}
            <div className="bg-gray-50 py-1.5 px-2 rounded-lg text-center border border-gray-200/60">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                Build not published yet
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer / Action */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#1d2046] group-hover:text-[#cc5231] transition-colors">
        <span>{isV11 ? "View 1.1 Profile & Evolution" : "Upgrade Guide & Build"}</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
