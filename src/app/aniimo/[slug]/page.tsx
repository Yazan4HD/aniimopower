import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import rawAniimos from "@/data/aniimos.json";
import rawHeldItems from "@/data/held_items.json";
import { Aniimo, HeldItem } from "@/types";
import { ELEMENT_COLORS, EVOLUTION_STAGE_CONFIG, ROLE_CONFIG, PERSONALITY_DESCRIPTIONS } from "@/lib/constants";
import {
  Sparkles,
  Swords,
  Zap,
  Calculator,
  MapPin,
  GitBranch,
  ArrowLeft,
  ChevronRight,
  Shield,
  Layers,
  ExternalLink,
} from "lucide-react";

const allAniimos = rawAniimos as Aniimo[];
const allHeldItems = rawHeldItems as HeldItem[];

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params for every Aniimo for 100% SSG speed
export async function generateStaticParams() {
  return allAniimos.map((aniimo) => ({
    slug: aniimo.slug,
  }));
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const aniimo = allAniimos.find((a) => a.slug === params.slug);
  if (!aniimo) return { title: "Aniimo Not Found | Aniimo Power" };

  return {
    title: `${aniimo.name} ${aniimo.number || ""} - ${aniimo.element} ${aniimo.role} | Aniimo Power`,
    description: `Complete guide, optimal build, held items, evolution path, and stats for ${aniimo.name} (${aniimo.number || ""}) in Aniimo.`,
    openGraph: {
      title: `${aniimo.name} - Aniimo Power Guide`,
      description: `Complete guide and level up calculator for ${aniimo.name} (${aniimo.element} • ${aniimo.role}).`,
      images: [aniimo.image],
    },
  };
}

export default function AniimoDetailPage({ params }: PageProps) {
  const aniimo = allAniimos.find((a) => a.slug === params.slug);

  if (!aniimo) {
    notFound();
  }

  const elem = ELEMENT_COLORS[aniimo.element];
  const roleConfig = ROLE_CONFIG[aniimo.role as keyof typeof ROLE_CONFIG];
  const stageConfig = EVOLUTION_STAGE_CONFIG[aniimo.stage];
  const itemDetail = allHeldItems.find(
    (h) => h.name.toLowerCase() === aniimo.heldItem?.toLowerCase()
  );

  // Related Aniimos of same element
  const relatedAniimos = allAniimos
    .filter((a) => a.element === aniimo.element && a.id !== aniimo.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f1f3ec] text-[#1d2046] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] mb-6">
          <Link href="/" className="hover:text-[#cc5231] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/" className="hover:text-[#cc5231] transition-colors">
            Aniimos
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1d2046] font-extrabold">{aniimo.name}</span>
        </nav>

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6b7280] hover:text-[#cc5231] mb-5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Aniimos</span>
        </Link>

        {/* Main Aniimo Profile Card */}
        <div className="bg-white rounded-3xl border border-[#e2e5da] shadow-sm overflow-hidden mb-8">
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#1d2046] to-[#2b306b] text-white p-6 sm:p-8 overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Big Circular Avatar with Prismana / Element Border */}
              <div
                className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full shrink-0 p-1.5 ${
                  aniimo.isPrismana
                    ? "rainbow-border rainbow-glow"
                    : `border-4 ${elem.border} bg-white shadow-xl`
                }`}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#f1f3ec]">
                  <Image
                    src={aniimo.image}
                    alt={aniimo.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="160px"
                  />
                </div>
                {aniimo.isPrismana && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Prismana
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  {/* Dex Number */}
                  {aniimo.number && (
                    <span className="text-xs font-mono font-black text-gray-200 bg-white/10 px-2.5 py-0.5 rounded-md border border-white/20">
                      {aniimo.number}
                    </span>
                  )}

                  {/* Official Role Badge with Icon */}
                  {aniimo.role && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-black bg-white text-[#1d2046] shadow-sm">
                      <Image
                        src={`/images/roles/${aniimo.role.toLowerCase()}.webp`}
                        alt={aniimo.role}
                        width={14}
                        height={14}
                        className="shrink-0 object-contain"
                      />
                      <span>{aniimo.role}</span>
                    </span>
                  )}

                  {/* Element */}
                  <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-md text-white ${elem.bg}`}>
                    {aniimo.element}
                  </span>

                  {aniimo.secondaryElement && (
                    <span className="text-xs font-bold text-gray-200 bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                      +{aniimo.secondaryElement}
                    </span>
                  )}

                  {/* Evolution Stage */}
                  <span
                    className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${
                      aniimo.stage === "Nova"
                        ? "bg-purple-900/40 text-purple-200 border-purple-400/40"
                        : aniimo.stage === "Gamma"
                        ? "bg-amber-900/40 text-amber-200 border-amber-400/40"
                        : "bg-emerald-900/40 text-emerald-200 border-emerald-400/40"
                    }`}
                  >
                    {aniimo.stage} Stage
                  </span>

                  {/* Version */}
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-white/10 text-gray-200 border border-white/15">
                    v{aniimo.version}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                  {aniimo.name}
                </h1>

                <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl">
                  {roleConfig?.desc ||
                    `Comprehensive combat configuration, evolution milestones, and held item artifact build for ${aniimo.name}.`}
                </p>
              </div>

              {/* Full Render Image (if available) */}
              {aniimo.renderImage && (
                <div className="relative w-32 h-44 shrink-0 hidden md:block">
                  <Image
                    src={aniimo.renderImage}
                    alt={`${aniimo.name} Full Render`}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="180px"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Detailed Content Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Recommended Skills & Personality */}
              <div className="space-y-6">
                {/* Personality */}
                {aniimo.personality && (
                  <div className="bg-[#f8faf5] p-5 rounded-2xl border border-gray-200 space-y-2">
                    <div className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">
                      Optimal Combat Personality
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-[#cc5231] font-mono bg-white px-3 py-1 rounded-xl border border-gray-200 shadow-2xs">
                        {aniimo.personality}
                      </span>
                      <span className="text-xs font-semibold text-[#1d2046]">
                        {PERSONALITY_DESCRIPTIONS[aniimo.personality] ||
                          "Balanced tactical stance maximizing core performance."}
                      </span>
                    </div>
                  </div>
                )}

                {/* Recommended Skills */}
                {aniimo.skills && aniimo.skills.length > 0 && (
                  <div className="bg-[#f8faf5] p-5 rounded-2xl border border-gray-200 space-y-3">
                    <div className="text-xs font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-1.5">
                      <Swords className="w-4 h-4 text-[#cc5231]" />
                      <span>Recommended Active & Passive Skills</span>
                    </div>
                    <div className="space-y-2">
                      {aniimo.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white border border-[#e2e5da] flex items-center gap-2.5 shadow-2xs"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#1d2046] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-sm text-[#1d2046]">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awakening Focus */}
                {aniimo.awakeningFocus && aniimo.awakeningFocus.length > 0 && (
                  <div className="bg-[#f8faf5] p-5 rounded-2xl border border-gray-200 space-y-2.5">
                    <div className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">
                      Awakening Stat Priority
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {aniimo.awakeningFocus.map((stat, idx) => (
                        <span
                          key={idx}
                          className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full text-xs"
                        >
                          ★ {stat} Focus
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Held Item & Evolution & Habitat */}
              <div className="space-y-6">
                {/* Held Item Artifact */}
                {aniimo.heldItem && (
                  <div className="p-5 rounded-2xl bg-[#fffcf5] border border-[#ebdcc7] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#b45309] uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-[#b45309]" />
                        <span>Best-in-Slot Held Item</span>
                      </div>
                      <Link
                        href="/held-items"
                        className="text-xs font-bold text-[#cc5231] hover:underline"
                      >
                        View Held Items Guide →
                      </Link>
                    </div>

                    <div className="flex items-center gap-3">
                      {itemDetail?.icon && (
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#ebdcc7] shrink-0 bg-white shadow-2xs">
                          <Image
                            src={itemDetail.icon}
                            alt={aniimo.heldItem}
                            fill
                            className="object-cover"
                            sizes="56px"
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
                      <p className="text-xs text-[#78350f] italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50">
                        &quot;{itemDetail.description}&quot;
                      </p>
                    )}
                  </div>
                )}

                {/* Evolution Requirement & Milestone */}
                {aniimo.evolution && (
                  <div className="p-5 rounded-2xl bg-[#f8faf5] border border-gray-200 space-y-1.5">
                    <div className="text-xs font-bold text-[#1d2046] uppercase tracking-wider flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-emerald-600" />
                      <span>Evolution Milestone</span>
                    </div>
                    <p className="text-sm font-semibold text-[#1d2046]">{aniimo.evolution}</p>
                  </div>
                )}

                {/* Habitat / How to Get */}
                {aniimo.location && (
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-700" />
                      <span>Habitat / How to Get</span>
                    </div>
                    <p className="text-sm font-semibold text-amber-950">{aniimo.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Upgrade Calculator Action Box */}
            <div className="mt-8 p-6 rounded-2xl bg-[#1d2046] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#ecd86a]" />
                  <span>Level Up & Evolution Calculator</span>
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Track required Dewdrops, Stones, and Crystals for {aniimo.name} with instant inventory deduction.
                </p>
              </div>

              <Link
                href={`/calculator?aniimo=${aniimo.slug}`}
                className="px-6 py-3 rounded-full bg-[#cc5231] hover:bg-[#b84526] text-white font-bold text-sm transition-all shadow-md shrink-0 flex items-center gap-2"
              >
                <span>Track {aniimo.name} Upgrades</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Related Aniimos Carousel / Grid */}
        {relatedAniimos.length > 0 && (
          <div className="mt-12 space-y-4">
            <h2 className="text-lg font-extrabold text-[#1d2046] flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${elem.bg}`}></span>
              <span>Other {aniimo.element} Aniimos</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedAniimos.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/aniimo/${rel.slug}`}
                  className="bg-white rounded-2xl p-3.5 border border-[#e2e5da] hover:border-[#1d2046] transition-all hover:shadow-sm text-center group"
                >
                  <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-gray-100 group-hover:scale-105 transition-transform mb-2">
                    <Image src={rel.image} alt={rel.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="font-extrabold text-xs text-[#1d2046] group-hover:text-[#cc5231] transition-colors truncate">
                    {rel.name}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-gray-400">{rel.number}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

