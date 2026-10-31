"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { HeldItem, Aniimo } from "@/types";
import rawItems from "@/data/held_items.json";
import rawAniimos from "@/data/aniimos.json";
import { Zap, MapPin, Sparkles, Shield, ChevronRight, Calculator, Swords } from "lucide-react";

const allItems = rawItems as HeldItem[];
const allAniimos = rawAniimos as Aniimo[];

export default function HeldItemsPage() {
  const [selectedItem, setSelectedItem] = useState<HeldItem | null>(null);

  // Map which Aniimos recommend which held item
  const getAniimosForItem = (itemName: string) => {
    return allAniimos.filter(
      (a) => (a.heldItem || "").toLowerCase() === itemName.toLowerCase()
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f3ec] text-[#1d2046] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="border-b border-[#e2e5da] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#d2d7c5] text-xs font-bold text-[#1d2046] mb-2 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-[#cc5231]" />
            <span>Artifact & Boss Compendium</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d2046] tracking-tight">
            Where to Farm Every Held Item Artifact
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] mt-1 max-w-3xl">
            Held items are the cornerstone of high-tier Aniimo builds. Defeat Alpha world bosses in their specific regional habitats to obtain and awaken these powerful artifacts.
          </p>
        </div>

        {/* Alpha Boss Farm Guide Quick Table */}
        <div className="bg-white rounded-3xl p-6 border border-[#e2e5da] shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-[#1d2046] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#cc5231]" />
            <span>Alpha Boss Locations & Item Drop Table</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-[#f8faf5] text-[#6b7280]">
                  <th className="py-2.5 px-3 font-bold uppercase">Alpha Boss</th>
                  <th className="py-2.5 px-3 font-bold uppercase">Held Items Dropped</th>
                  <th className="py-2.5 px-3 font-bold uppercase">Exact Map Location</th>
                  <th className="py-2.5 px-3 font-bold uppercase">Requirement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                <tr>
                  <td className="py-3 px-3 font-bold text-[#cc5231]">Alpha Ignitis</td>
                  <td className="py-3 px-3 font-semibold text-[#1d2046]">Ferocious Fang, Miraculous Fleece</td>
                  <td className="py-3 px-3 text-[#4b5563]">Berylline Vale, southeast of Berylline Vale Bloom</td>
                  <td className="py-3 px-3 text-emerald-700 font-semibold">Open World Access</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#2c5eb3]">Alpha Irisal</td>
                  <td className="py-3 px-3 font-semibold text-[#1d2046]">Spirited Feather, Echoing Grimoire, Fission Needles</td>
                  <td className="py-3 px-3 text-[#4b5563]">Sea of Flowers, south of Sea of Flowers Bloom</td>
                  <td className="py-3 px-3 text-emerald-700 font-semibold">Open World Access</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#347f3f]">Alpha Grizbo</td>
                  <td className="py-3 px-3 font-semibold text-[#1d2046]">Gargantuan Horn, Heartseeker Pendant, Heritage Amulet</td>
                  <td className="py-3 px-3 text-[#4b5563]">Rosetower Woods, north of Rosetower Woods Bloom</td>
                  <td className="py-3 px-3 text-emerald-700 font-semibold">Open World Access</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#d9ad26]">Alpha Geoclaw</td>
                  <td className="py-3 px-3 font-semibold text-[#1d2046]">Explosive Gloves</td>
                  <td className="py-3 px-3 text-[#4b5563]">Nimbus Fields, underground in NW near Breezy Plains Branch</td>
                  <td className="py-3 px-3 text-amber-700 font-bold">Needs 120 Lumin Amber</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#926339]">Alpha Minespine</td>
                  <td className="py-3 px-3 font-semibold text-[#1d2046]">Explosive Gloves (Alt Drop)</td>
                  <td className="py-3 px-3 text-[#4b5563]">Beast Fang Ridge, inside the Forgotten Mine cave</td>
                  <td className="py-3 px-3 text-amber-700 font-bold">Needs 120 Lumin Amber</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* All Held Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allItems.map((item) => {
            const recommended = getAniimosForItem(item.name);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e5da] hover:border-[#cc5231]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Item Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-amber-300 bg-[#f1f3ec] shadow-2xs">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        Boss: {item.alphaBoss}
                      </span>
                      <h3 className="text-lg font-black text-[#1d2046] tracking-tight mt-1">
                        {item.name}
                      </h3>
                      <div className="text-xs text-[#cc5231] font-semibold">{item.region}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#4b5563] leading-relaxed mb-3 bg-[#f8faf5] p-3 rounded-xl border border-gray-100">
                    {item.description}
                  </p>

                  {/* Farm Location Details */}
                  <div className="space-y-1.5 text-xs mb-4">
                    <div className="flex items-start gap-1.5 text-[#1d2046]">
                      <MapPin className="w-3.5 h-3.5 text-[#cc5231] shrink-0 mt-0.5" />
                      <span className="font-medium">{item.location}</span>
                    </div>
                    {item.requirement && (
                      <div className="text-[11px] text-[#78350f] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 font-semibold">
                        🔒 {item.requirement}
                      </div>
                    )}
                  </div>

                  {/* Recommended Aniimos for this Item */}
                  {recommended.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Swords className="w-3 h-3 text-[#cc5231]" /> Recommended For ({recommended.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recommended.slice(0, 6).map((aniimo) => (
                          <Link
                            key={aniimo.id}
                            href={`/?q=${encodeURIComponent(aniimo.name)}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f1f3ec] hover:bg-[#1d2046] hover:text-white text-[11px] font-bold text-[#1d2046] transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#cc5231]"></span>
                            <span>{aniimo.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#cc5231]">
                  <span>{item.roleSynergy}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

