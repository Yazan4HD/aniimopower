import { ElementType } from "@/types";

export const ELEMENT_COLORS: Record<ElementType, { bg: string; text: string; border: string; hex: string }> = {
  Fire: {
    bg: "bg-[#cc5231]",
    text: "text-[#cc5231]",
    border: "border-[#cc5231]",
    hex: "#cc5231",
  },
  Water: {
    bg: "bg-[#2c5eb3]",
    text: "text-[#2c5eb3]",
    border: "border-[#2c5eb3]",
    hex: "#2c5eb3",
  },
  Grass: {
    bg: "bg-[#347f3f]",
    text: "text-[#347f3f]",
    border: "border-[#347f3f]",
    hex: "#347f3f",
  },
  Lightning: {
    bg: "bg-[#d9ad26]",
    text: "text-[#b0880e]",
    border: "border-[#d9ad26]",
    hex: "#d9ad26",
  },
  Ice: {
    bg: "bg-[#2b96c2]",
    text: "text-[#2b96c2]",
    border: "border-[#2b96c2]",
    hex: "#2b96c2",
  },
  Wind: {
    bg: "bg-[#2e9780]",
    text: "text-[#2e9780]",
    border: "border-[#2e9780]",
    hex: "#2e9780",
  },
  Earth: {
    bg: "bg-[#926339]",
    text: "text-[#926339]",
    border: "border-[#926339]",
    hex: "#926339",
  },
  Dark: {
    bg: "bg-[#6246a9]",
    text: "text-[#6246a9]",
    border: "border-[#6246a9]",
    hex: "#6246a9",
  },
  Light: {
    bg: "bg-[#c7902a]",
    text: "text-[#c7902a]",
    border: "border-[#c7902a]",
    hex: "#c7902a",
  },
};

export const PERSONALITY_DESCRIPTIONS: Record<string, string> = {
  ESTP: "Hyper-aggressive attacker, prioritizes critical strike and rapid engagement.",
  ESFP: "Dynamic elemental brawler, excels in active skill combos and burst turns.",
  ISTJ: "Methodical guardian, maximizes consistent damage resistance and sustained defense.",
  ISFJ: "Protective supporter, enhances team shielding and passive regeneration.",
  INTJ: "Strategic tactician, prioritizes break power and weakness exploitation.",
  INTP: "Analytical elementalist, optimizes mana efficiency and consecutive skill loops.",
  ENTP: "Disruptive striker, creates debuff chaos and elemental resonance spikes.",
  ENTJ: "Commanding vanguard, boosts party offensive aura and stagger multipliers.",
  ENFP: "Energetic inspirer, accelerates skill cooldowns and movement speed.",
  ENFJ: "Inspiring leader, balances offensive encouragement with area survivability.",
  INFJ: "Mystic visionary, strengthens rare passive awakening procs and shields.",
  INFP: "Gentle protector, amplifies regenerative healing and elemental cleanses.",
  ISTP: "Precision operative, focuses on single-target weak-point execution.",
  ISFP: "Instinctive skirmisher, delivers burst counter damage upon dodging.",
  ESTJ: "Firm enforcer, suppresses enemy stagger recovery and posture bars.",
  ESFJ: "Community anchor, shares buffs and strengthens adjacent party synergy.",
};

