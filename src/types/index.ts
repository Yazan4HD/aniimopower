export type ElementType =
  | "Fire"
  | "Water"
  | "Grass"
  | "Lightning"
  | "Ice"
  | "Wind"
  | "Earth"
  | "Dark"
  | "Light";

export type EvolutionStage = "Lumin" | "Gamma" | "Nova";

export type RoleType = "DPS" | "BREAK" | "Support" | "Heal" | "REGEN";

export interface Aniimo {
  id: string;
  slug: string;
  name: string;
  number?: string;
  element: ElementType;
  role: RoleType | string;
  roleIcon?: string;
  version: "1.0" | "1.1";
  stage: EvolutionStage;
  evolutionStage: EvolutionStage;
  isPrismana: boolean;
  image: string;
  cardIndex: number;
  row: number;
  col: number;
  rawTexts: string[];
  renderImage?: string;
  officialWikiId?: string;
  officialWikiUrl?: string;
  // v1.0 properties
  isFinalForm?: boolean;
  personality?: string;
  heldItem?: string;
  alphaBoss?: string;
  awakeningFocus?: string[];
  skills?: string[];
  // v1.1 properties
  evolution?: string;
  location?: string;
  secondaryElement?: string | null;
}

export interface HeldItem {
  id: string;
  name: string;
  alphaBoss: string;
  location: string;
  region: string;
  requirement: string;
  description: string;
  roleSynergy: string;
  icon: string;
}

export interface UpgradeStage {
  stage: number;
  name: string;
  stars: number;
  levelReq: number;
  dewdropCrystals: number;
  elementalStones: number;
  phenomenaCrystals: number;
  benefit: string;
  awakeningBonus: string;
}

export interface UpgradeRules {
  totalCosts: {
    dewdropCrystals: number;
    elementalStones: number;
    phenomenaCrystals: number;
  };
  stages: UpgradeStage[];
  elementalStoneTypes: string[];
  regionalDewdrops: {
    name: string;
    region: string;
    source: string;
  }[];
  rules: string[];
}

