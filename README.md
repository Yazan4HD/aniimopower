# Aniimo Power ⚡

> **Live Website:** [aniimopower.app](https://aniimopower.app)

The ultimate companion, leveling guide, and artifact optimization tool for **Aniimo**. Designed and optimized for blazing speed, intuitive fuzzy navigation, and comprehensive progress tracking.

---

## ✨ Features

- **⚡ Blazing Fast & Typo-Forgiving Search:** Powered by Fuse.js fuzzy matching across names, Dex numbers, elements, roles, and passive abilities.
- **🛡️ Comprehensive Aniimo Compendium:** Over 83 Aniimos indexed with official Aniidex numbers (`#001` to `#126`, `S1`), combat roles (`DPS`, `BREAK`, `Support`, `Heal`, `REGEN`), and role icons.
- **📄 Dedicated Aniimo Pages:** Every single Aniimo has a dedicated, statically generated profile page at `/aniimo/[slug]` (e.g., `/aniimo/infergon`, `/aniimo/dewple`) with full combat specs, held items, evolution milestones, and level-up calculators.
- **🌱 Calibrated 3-Tier Evolution Stages:** Strictly classified by the canonical Aniimo stages: **Lumin** (Stage 1), **Gamma** (Stage 2), and **Nova** (Stage 3).
- **🌈 Prismana Visual Identifier:** Animated rainbow accents for Prismana variants and circular avatar badges.
- **🎛️ Multi-Filter Navigation:** Filter dynamically by Evolution Stage (**Lumin**, **Gamma**, **Nova**), Combat Role (**DPS**, **BREAK**, **Support**, **Heal**, **REGEN**), Element, Game Version, or toggle Prismana-only.
- **📊 Interactive Upgrade Calculator:** Step-by-step progress tracking for stages 1 to 7. Computes exact remaining requirements across 850 Dewdrops, 42 Evolution Stones, and 2 Phenomena Crystals, with automatic Flux Crystal substitution math and persistent local storage.
- **🏆 Held Items & Artifacts Database:** Full showcase of all 9 unique artifacts with Alpha boss drop locations, stat scaling, and optimal Aniimo synergies.
- **🔐 Secure Git-Backed Admin CMS:** Protected by username & password via server-side session cookies. Allows managing, adding, and editing Aniimos & evolution stages directly, with automated image uploading and GitHub commit sync for instant Vercel redeploys.
- **🎨 Game-Accurate Visual Design:** Authentic dark glassmorphism palette sampled directly from the official card template with smooth micro-animations.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Search Engine:** Fuse.js
- **Icons:** Lucide React
- **Architecture:** 100% Static Site Generation (SSG) for instant page loads

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ or later
- npm, pnpm, or yarn

### Installation

```bash
git clone https://github.com/Yazan4HD/aniimopower.git
cd aniimopower
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
├── public/
│   ├── images/
│   │   ├── aniimos/     # Official circular avatars
│   │   ├── renders/     # Full-body transparent renders
│   │   ├── items/       # Artifact and crystal icons
│   │   └── logo.png     # Official high-resolution logo
├── src/
│   ├── app/             # Next.js App Router (Home, Calculator, Held Items)
│   ├── components/      # UI Components (AniimoCard, SearchFilter, Modal, Navbar)
│   ├── data/            # JSON databases (aniimos, held_items, upgrade_rules)
│   └── types/           # TypeScript interfaces
└── scripts/             # Data extraction and asset ingestion utilities
```

---

## 📄 License

MIT © [Yazan4HD](https://github.com/Yazan4HD)

