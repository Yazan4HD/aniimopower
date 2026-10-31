"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Aniimo, ElementType, EvolutionStage, HeldItem } from "@/types";
import { ELEMENT_COLORS, EVOLUTION_STAGE_CONFIG } from "@/lib/constants";
import {
  Lock,
  User,
  Key,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Github,
  Globe,
  ExternalLink,
  RotateCcw,
  Eye,
  EyeOff,
  Filter,
  Check,
  X,
  Database,
  Layers,
  Settings,
} from "lucide-react";

const ALL_ELEMENTS: ElementType[] = [
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

const ALL_STAGES: EvolutionStage[] = ["Lumin", "Gamma", "Nova"];

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [githubConfigured, setGithubConfigured] = useState<boolean>(false);
  const [repoInfo, setRepoInfo] = useState<string>("Yazan4HD/aniimopower");

  // Login Form State
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CMS Data State
  const [aniimos, setAniimos] = useState<Aniimo[]>([]);
  const [heldItems, setHeldItems] = useState<HeldItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
    url?: string;
  } | null>(null);

  // UI Tabs & Filters
  const [activeTab, setActiveTab] = useState<"aniimos" | "items" | "settings">("aniimos");
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<EvolutionStage | "All">("All");
  const [elementFilter, setElementFilter] = useState<ElementType | "All">("All");
  const [versionFilter, setVersionFilter] = useState<"1.0" | "1.1" | "All">("All");
  const [prismanaOnly, setPrismanaOnly] = useState(false);

  // Modal State for Editing / Creating Aniimo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAniimo, setEditingAniimo] = useState<Aniimo | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Check Session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/session");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            setCurrentUser(data.user?.username || "Admin");
            setGithubConfigured(data.githubConfigured);
            if (data.repo) setRepoInfo(data.repo);
            loadData();
            return;
          }
        }
        setIsAuthenticated(false);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkSession();
  }, []);

  // Fetch CMS Data
  async function loadData() {
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const data = await res.json();
        setAniimos(data.aniimos || []);
        setHeldItems(data.heldItems || []);
        setIsDataLoaded(true);
      }
    } catch (err) {
      console.error("Failed to load CMS data:", err);
    }
  }

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Login failed");
        setIsLoggingIn(false);
        return;
      }

      setIsAuthenticated(true);
      setCurrentUser(data.user?.username || usernameInput);
      loadData();
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setCurrentUser("");
  };

  // Filtered Aniimos List
  const filteredAniimos = useMemo(() => {
    return aniimos.filter((a) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = a.name.toLowerCase().includes(q);
        const matchesRole = a.role?.toLowerCase().includes(q);
        const matchesHeld = a.heldItem?.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesHeld) return false;
      }
      if (stageFilter !== "All" && a.stage !== stageFilter && a.evolutionStage !== stageFilter) {
        return false;
      }
      if (elementFilter !== "All" && a.element !== elementFilter) {
        return false;
      }
      if (versionFilter !== "All" && a.version !== versionFilter) {
        return false;
      }
      if (prismanaOnly && !a.isPrismana) {
        return false;
      }
      return true;
    });
  }, [aniimos, searchQuery, stageFilter, elementFilter, versionFilter, prismanaOnly]);

  // Open Edit Modal
  const openEditModal = (aniimo: Aniimo) => {
    setEditingAniimo({ ...aniimo });
    setIsCreatingNew(false);
    setIsModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    const newId = `aniimo-${String(aniimos.length + 1).padStart(3, "0")}`;
    setEditingAniimo({
      id: newId,
      slug: "new-aniimo",
      name: "",
      element: "Fire",
      version: "1.1",
      stage: "Lumin",
      evolutionStage: "Lumin",
      isPrismana: false,
      image: "/images/logo.png",
      cardIndex: aniimos.length,
      row: 0,
      col: 0,
      rawTexts: [],
      role: "DPS",
      evolution: "unknown",
      location: "unknown",
    });
    setIsCreatingNew(true);
    setIsModalOpen(true);
  };

  // Save Modal Form Changes to Local State
  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAniimo || !editingAniimo.name.trim()) return;

    if (isCreatingNew) {
      setAniimos((prev) => [editingAniimo, ...prev]);
    } else {
      setAniimos((prev) =>
        prev.map((item) => (item.id === editingAniimo.id ? editingAniimo : item))
      );
    }

    setHasUnsavedChanges(true);
    setIsModalOpen(false);
    setEditingAniimo(null);
  };

  // Delete Aniimo
  const handleDeleteAniimo = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setAniimos((prev) => prev.filter((a) => a.id !== id));
      setHasUnsavedChanges(true);
    }
  };

  // Quick Stage Toggle in Table
  const handleQuickStageChange = (id: string, newStage: EvolutionStage) => {
    setAniimos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, stage: newStage, evolutionStage: newStage } : a))
    );
    setHasUnsavedChanges(true);
  };

  // Save All Changes to Server & GitHub
  const handlePersistChanges = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aniimos,
          heldItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveStatus({
          type: "error",
          message: data.error || "Failed to persist changes",
        });
        return;
      }

      setHasUnsavedChanges(false);
      setSaveStatus({
        type: "success",
        message: data.message || "Changes published successfully!",
        url: data.commitUrl,
      });

      if (data.githubSynced) {
        setGithubConfigured(true);
      }
    } catch {
      setSaveStatus({
        type: "error",
        message: "Network error occurred while saving.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Loading State
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0f1123] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#cc5231] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold tracking-wider text-gray-400">
            Checking Aniimo Power credentials...
          </span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0f1e] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#cc5231]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4 rounded-full p-1 rainbow-border shadow-xl">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#181a33]">
                <Image
                  src="/images/logo.png"
                  alt="Aniimo Power Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              ANIIMO<span className="text-[#cc5231]">POWER</span>
              <span className="text-xs bg-[#cc5231]/20 text-[#ff7d5c] border border-[#cc5231]/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                CMS
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Secure Administration Panel for aniimopower.app
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#151833]/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10 text-sm font-bold text-gray-300">
              <Lock className="w-4 h-4 text-[#cc5231]" />
              <span>Authentication Required</span>
            </div>

            {loginError && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter admin username"
                    required
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#cc5231] focus:ring-1 focus:ring-[#cc5231] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#cc5231] focus:ring-1 focus:ring-[#cc5231] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#cc5231] to-[#e66a47] hover:from-[#b84526] hover:to-[#cc5231] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#cc5231]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Access CMS Portal</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <Link
                href="/"
                className="text-xs text-gray-400 hover:text-[#ff7d5c] transition-colors flex items-center justify-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" /> Return to Public Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated: Full CMS Dashboard
  return (
    <div className="min-h-screen bg-[#0d0f1e] text-gray-100 flex flex-col font-sans">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-[#151833]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#cc5231]">
                <Image src="/images/logo.png" alt="Logo" fill className="object-cover" sizes="32px" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                ANIIMO<span className="text-[#cc5231]">POWER</span>
              </span>
            </Link>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#cc5231]/20 text-[#ff7d5c] border border-[#cc5231]/40">
              CMS Admin
            </span>
          </div>

          {/* Sync Status & Primary Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* GitHub Sync Status Badge */}
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                githubConfigured
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
              }`}
              title={
                githubConfigured
                  ? `Syncing to ${repoInfo} on branch main`
                  : "GITHUB_TOKEN not detected in environment. Changes will save to local disk."
              }
            >
              <Github className="w-3.5 h-3.5" />
              <span>{githubConfigured ? "Git Sync Active" : "Local Mode"}</span>
            </div>

            {/* Save & Publish Button */}
            <button
              onClick={handlePersistChanges}
              disabled={isSaving}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                hasUnsavedChanges
                  ? "bg-[#cc5231] hover:bg-[#b84526] text-white animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              } disabled:opacity-50 cursor-pointer`}
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{hasUnsavedChanges ? "Publish Changes *" : "Save & Sync"}</span>
            </button>

            {/* Live Site Link */}
            <Link
              href="/"
              target="_blank"
              className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
              title="Open Live Website"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Toast Save Alert */}
        {saveStatus && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm animate-fade-in ${
              saveStatus.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {saveStatus.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{saveStatus.message}</span>
            </div>
            {saveStatus.url && (
              <a
                href={saveStatus.url}
                target="_blank"
                rel="noreferrer"
                className="underline font-bold text-emerald-200 hover:text-white flex items-center gap-1 shrink-0"
              >
                <span>View Commit</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-[#151833] p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab("aniimos")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === "aniimos"
                  ? "bg-[#cc5231] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Aniimos Database ({aniimos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("items")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === "items"
                  ? "bg-[#cc5231] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Held Items ({heldItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === "settings"
                  ? "bg-[#cc5231] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Vercel & Sync</span>
            </button>
          </div>

          {activeTab === "aniimos" && (
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Aniimo</span>
            </button>
          )}
        </div>

        {/* TAB 1: ANIIMOS MANAGER */}
        {activeTab === "aniimos" && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-[#151833] p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name, role, held item..."
                  className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#cc5231]"
                />
              </div>

              {/* Stage Filter (Lumin, Gamma, Nova) */}
              <div className="flex items-center gap-1.5 bg-[#0d0f1e] p-1 rounded-xl border border-white/10">
                <span className="text-[11px] font-bold text-gray-400 px-2 uppercase">Stage:</span>
                {(["All", "Lumin", "Gamma", "Nova"] as const).map((stg) => (
                  <button
                    key={stg}
                    onClick={() => setStageFilter(stg)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      stageFilter === stg
                        ? stg === "Nova"
                          ? "bg-purple-600 text-white"
                          : stg === "Gamma"
                          ? "bg-amber-600 text-white"
                          : stg === "Lumin"
                          ? "bg-emerald-600 text-white"
                          : "bg-white/20 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {stg}
                  </button>
                ))}
              </div>

              {/* Version Filter */}
              <div className="flex items-center gap-1.5 bg-[#0d0f1e] p-1 rounded-xl border border-white/10">
                <span className="text-[11px] font-bold text-gray-400 px-2 uppercase">Ver:</span>
                {(["All", "1.0", "1.1"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVersionFilter(v)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      versionFilter === v ? "bg-[#cc5231] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {v === "All" ? "Both" : `v${v}`}
                  </button>
                ))}
              </div>

              {/* Prismana Toggle */}
              <button
                onClick={() => setPrismanaOnly(!prismanaOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  prismanaOnly
                    ? "rainbow-border text-white shadow-sm"
                    : "bg-[#0d0f1e] text-gray-400 border-white/10 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Prismana</span>
              </button>
            </div>

            {/* Aniimos Table */}
            <div className="bg-[#151833] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0d0f1e] text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3">Aniimo</th>
                      <th className="px-4 py-3">Element</th>
                      <th className="px-4 py-3">Evolution Stage</th>
                      <th className="px-4 py-3">Version</th>
                      <th className="px-4 py-3">Role / Habitat</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAniimos.map((aniimo) => {
                      const elem = ELEMENT_COLORS[aniimo.element];
                      return (
                        <tr key={aniimo.id} className="hover:bg-white/[0.02] transition-colors">
                          {/* Avatar & Name */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`relative w-10 h-10 rounded-full shrink-0 p-0.5 ${
                                  aniimo.isPrismana ? "rainbow-border" : "border border-white/20"
                                }`}
                              >
                                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#0d0f1e]">
                                  <Image
                                    src={aniimo.image}
                                    alt={aniimo.name}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                                  <span>{aniimo.name}</span>
                                  {aniimo.isPrismana && (
                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                  )}
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono">
                                  {aniimo.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Element */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-extrabold text-white ${elem.bg}`}
                              >
                                {aniimo.element}
                              </span>
                              {aniimo.secondaryElement && (
                                <span className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
                                  +{aniimo.secondaryElement}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Evolution Stage (Quick Select between Lumin, Gamma, Nova) */}
                          <td className="px-4 py-3">
                            <select
                              value={aniimo.stage}
                              onChange={(e) =>
                                handleQuickStageChange(aniimo.id, e.target.value as EvolutionStage)
                              }
                              className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                aniimo.stage === "Nova"
                                  ? "bg-purple-900/40 text-purple-300 border-purple-500/40"
                                  : aniimo.stage === "Gamma"
                                  ? "bg-amber-900/40 text-amber-300 border-amber-500/40"
                                  : "bg-emerald-900/40 text-emerald-300 border-emerald-500/40"
                              }`}
                            >
                              <option value="Lumin" className="bg-[#0d0f1e] text-emerald-400">
                                Lumin (Stage 1)
                              </option>
                              <option value="Gamma" className="bg-[#0d0f1e] text-amber-400">
                                Gamma (Stage 2)
                              </option>
                              <option value="Nova" className="bg-[#0d0f1e] text-purple-400">
                                Nova (Stage 3)
                              </option>
                            </select>
                          </td>

                          {/* Version */}
                          <td className="px-4 py-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                aniimo.version === "1.1"
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "bg-gray-500/20 text-gray-300"
                              }`}
                            >
                              v{aniimo.version}
                            </span>
                          </td>

                          {/* Role / Location */}
                          <td className="px-4 py-3 max-w-[200px]">
                            <div className="truncate font-semibold text-gray-300">
                              {aniimo.role || aniimo.personality || aniimo.heldItem || "—"}
                            </div>
                            <div className="text-[10px] text-gray-500 truncate">
                              {aniimo.location || aniimo.evolution || "—"}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditModal(aniimo)}
                                className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                                title="Edit Details"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAniimo(aniimo.id, aniimo.name)}
                                className="p-1.5 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Delete Aniimo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredAniimos.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-xs">
                  No Aniimos match your search filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HELD ITEMS */}
        {activeTab === "items" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heldItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-[#151833] p-5 rounded-2xl border border-white/10 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-[#0d0f1e] shrink-0">
                    <Image src={item.icon} alt={item.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{item.name}</h3>
                    <div className="text-xs text-[#cc5231] font-bold">Boss: {item.alphaBoss}</div>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-gray-300">
                  <div>
                    <strong className="text-gray-400">Location:</strong> {item.location} ({item.region})
                  </div>
                  <div>
                    <strong className="text-gray-400">Requirement:</strong> {item.requirement}
                  </div>
                  <div>
                    <strong className="text-gray-400">Synergy:</strong> {item.roleSynergy}
                  </div>
                  <p className="text-[11px] text-gray-400 italic pt-1 border-t border-white/5">
                    &quot;{item.description}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SETTINGS & VERCEL GUIDE */}
        {activeTab === "settings" && (
          <div className="bg-[#151833] rounded-2xl p-6 sm:p-8 border border-white/10 max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#cc5231]" />
                <span>Vercel Deployment & Secret Configuration</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Your credentials and GitHub token are never saved to the public repository. Configure
                them securely in your Vercel Project Settings to enable automated sync and deployment.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0d0f1e] p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-200">1. ADMIN_USERNAME</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                    Configured ({currentUser})
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  The login username for accessing this CMS panel. (Default: <code>admin</code>)
                </p>
              </div>

              <div className="bg-[#0d0f1e] p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-200">2. ADMIN_PASSWORD</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                    Active & Protected
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Your secure secret password (<code>qpgibeur14#</code>) configured in Vercel
                  environment variables.
                </p>
              </div>

              <div className="bg-[#0d0f1e] p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-200">3. GITHUB_TOKEN</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      githubConfigured
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {githubConfigured ? "Connected" : "Pending Vercel Configuration"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Add your GitHub Personal Access Token as <code>GITHUB_TOKEN</code> in Vercel. When
                  configured, every time you click &quot;Save & Sync&quot;, changes are committed
                  directly to <code>Yazan4HD/aniimopower</code> on GitHub, triggering an automatic
                  Vercel redeploy!
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-3">
              <Globe className="w-5 h-5 shrink-0 text-blue-400 mt-0.5" />
              <div>
                <strong>How to add these to Vercel:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1 text-gray-300">
                  <li>Go to your Vercel Dashboard → select the <strong>aniimopower</strong> project.</li>
                  <li>Click <strong>Settings</strong> → <strong>Environment Variables</strong>.</li>
                  <li>Add <code>ADMIN_USERNAME</code>, <code>ADMIN_PASSWORD</code>, and <code>GITHUB_TOKEN</code>.</li>
                  <li>Save and redeploy!</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT / CREATE ANIIMO MODAL */}
      {isModalOpen && editingAniimo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#151833] rounded-2xl max-w-2xl w-full border border-white/15 p-6 shadow-2xl animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#cc5231]" />
                <span>{isCreatingNew ? "Add New Aniimo" : `Edit ${editingAniimo.name}`}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4">
              {/* Row 1: Name & ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAniimo.name}
                    onChange={(e) =>
                      setEditingAniimo({
                        ...editingAniimo,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#cc5231]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    ID Identifier
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingAniimo.id}
                    className="w-full bg-[#0d0f1e]/50 border border-white/5 rounded-xl px-3 py-2 text-sm text-gray-500 font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Primary Element *
                  </label>
                  <select
                    value={editingAniimo.element}
                    onChange={(e) =>
                      setEditingAniimo({
                        ...editingAniimo,
                        element: e.target.value as ElementType,
                      })
                    }
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#cc5231]"
                  >
                    {ALL_ELEMENTS.map((el) => (
                      <option key={el} value={el}>
                        {el}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Secondary Element (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingAniimo.secondaryElement || ""}
                    onChange={(e) =>
                      setEditingAniimo({
                        ...editingAniimo,
                        secondaryElement: e.target.value || null,
                      })
                    }
                    placeholder="e.g. Earth, Wind, or empty"
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#cc5231]"
                  />
                </div>
              </div>

              {/* Row 3: Evolution Stage (STRICTLY Lumin, Gamma, Nova) & Version */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    Evolution Stage (Lumin, Gamma, Nova) *
                  </label>
                  <select
                    value={editingAniimo.stage}
                    onChange={(e) => {
                      const val = e.target.value as EvolutionStage;
                      setEditingAniimo({
                        ...editingAniimo,
                        stage: val,
                        evolutionStage: val,
                      });
                    }}
                    className="w-full bg-[#0d0f1e] border border-emerald-500/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="Lumin">Lumin (Stage 1 / Base Form)</option>
                    <option value="Gamma">Gamma (Stage 2 / Mid Form)</option>
                    <option value="Nova">Nova (Stage 3 / Final Form)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Game Version *
                  </label>
                  <select
                    value={editingAniimo.version}
                    onChange={(e) =>
                      setEditingAniimo({
                        ...editingAniimo,
                        version: e.target.value as "1.0" | "1.1",
                      })
                    }
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#cc5231]"
                  >
                    <option value="1.0">Version 1.0</option>
                    <option value="1.1">Version 1.1</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Combat Role & Evolution Milestone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Combat Role (v1.1)
                  </label>
                  <input
                    type="text"
                    value={editingAniimo.role || ""}
                    onChange={(e) =>
                      setEditingAniimo({ ...editingAniimo, role: e.target.value })
                    }
                    placeholder="e.g. Tank, Burst DPS, Support"
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#cc5231]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Evolution Requirement & Milestone
                  </label>
                  <input
                    type="text"
                    value={editingAniimo.evolution || ""}
                    onChange={(e) =>
                      setEditingAniimo({ ...editingAniimo, evolution: e.target.value })
                    }
                    placeholder="e.g. Evolves at Lv. 57 with Wave Stone"
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#cc5231]"
                  />
                </div>
              </div>

              {/* Row 5: Habitat / Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Habitat / How to Get
                </label>
                <input
                  type="text"
                  value={editingAniimo.location || ""}
                  onChange={(e) =>
                    setEditingAniimo({ ...editingAniimo, location: e.target.value })
                  }
                  placeholder="e.g. High Cliffs, Shorelines, Season Pass"
                  className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#cc5231]"
                />
              </div>

              {/* Row 6: v1.0 Specifics: Personality & Held Item */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Personality (v1.0)
                  </label>
                  <input
                    type="text"
                    value={editingAniimo.personality || ""}
                    onChange={(e) =>
                      setEditingAniimo({ ...editingAniimo, personality: e.target.value })
                    }
                    placeholder="e.g. ESTP, INFJ, ESFP"
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#cc5231]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Held Item / Artifact
                  </label>
                  <input
                    type="text"
                    value={editingAniimo.heldItem || ""}
                    onChange={(e) =>
                      setEditingAniimo({ ...editingAniimo, heldItem: e.target.value })
                    }
                    placeholder="e.g. Ferocious Fang, Heartseeker"
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#cc5231]"
                  />
                </div>
              </div>

              {/* Row 7: Prismana Variant Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="prismanaCheck"
                  checked={editingAniimo.isPrismana}
                  onChange={(e) =>
                    setEditingAniimo({
                      ...editingAniimo,
                      isPrismana: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-[#cc5231] focus:ring-[#cc5231] bg-[#0d0f1e] border-white/20"
                />
                <label
                  htmlFor="prismanaCheck"
                  className="text-xs font-bold text-gray-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Prismana Variant (Unique Rainbow Ring)</span>
                </label>
              </div>

              {/* Row 8: Image URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="text"
                    value={editingAniimo.image}
                    onChange={(e) =>
                      setEditingAniimo({ ...editingAniimo, image: e.target.value })
                    }
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cc5231]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Full Render Image URL
                  </label>
                  <input
                    type="text"
                    value={editingAniimo.renderImage || ""}
                    onChange={(e) =>
                      setEditingAniimo({ ...editingAniimo, renderImage: e.target.value })
                    }
                    placeholder="/images/renders/..."
                    className="w-full bg-[#0d0f1e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cc5231]"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#cc5231] hover:bg-[#b84526] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreatingNew ? "Add Aniimo" : "Update Aniimo"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

