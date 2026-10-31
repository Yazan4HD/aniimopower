import Fuse from "fuse.js";
import { Aniimo } from "@/types";

export function createAniimoSearchIndex(aniimos: Aniimo[]) {
  const options = {
    keys: [
      { name: "name", weight: 0.5 },
      { name: "number", weight: 0.4 },
      { name: "element", weight: 0.2 },
      { name: "secondaryElement", weight: 0.15 },
      { name: "heldItem", weight: 0.2 },
      { name: "alphaBoss", weight: 0.15 },
      { name: "skills", weight: 0.15 },
      { name: "personality", weight: 0.1 },
      { name: "role", weight: 0.15 },
      { name: "location", weight: 0.15 },
      { name: "evolution", weight: 0.15 },
      { name: "stage", weight: 0.1 },
      { name: "evolutionStage", weight: 0.1 },
    ],
    threshold: 0.38, // Forgiving typo tolerance
    distance: 100,
    minMatchCharLength: 2,
    includeScore: true,
  };

  return new Fuse(aniimos, options);
}

