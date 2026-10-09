"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  ChevronDown, Search, Check, GraduationCap, X, 
  Clock, TrendingUp, PlayCircle, Filter 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prodi } from "../../types/catalog";

// =========================================================================
// 1. SEARCHABLE CUSTOM PRODI DROPDOWN (UI/UX MODERN, 39 PRODI LENGKAP)
// =========================================================================

interface SearchableProdiDropdownProps {
  prodis: Prodi[];
  selectedProdi: string;
  onChange: (kode: string) => void;
  isEn?: boolean;
}

export function SearchableProdiDropdown({
  prodis,
  selectedProdi,
  onChange,
  isEn = false,
}: SearchableProdiDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [degreeFilter, setDegreeFilter] = useState<"all" | "S2" | "D4" | "D3">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedItem = prodis.find((p) => p.kode_prodi === selectedProdi);

  const filteredProdis = prodis.filter((p) => {
    const matchesDegree =
      degreeFilter === "all" ||
      (degreeFilter === "S2" && (p.jenjang?.includes("S2") || p.kode_prodi.startsWith("S2"))) ||
      (degreeFilter === "D4" && (p.jenjang?.includes("D4") || p.jenjang?.includes("Sarjana") || p.kode_prodi.startsWith("D4"))) ||
      (degreeFilter === "D3" && (p.jenjang?.includes("D3") || p.jenjang?.includes("Ahli") || p.kode_prodi.startsWith("D3")));

    const q = search.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      p.nama_prodi.toLowerCase().includes(q) ||
      p.kode_prodi.toLowerCase().includes(q);

    return matchesDegree && matchesSearch;
  });

  // Group prodis by degree
  const s2Prodis = filteredProdis.filter(p => p.kode_prodi.startsWith("S2") || p.jenjang?.includes("S2"));
  const d4Prodis = filteredProdis.filter(p => p.kode_prodi.startsWith("D4") || p.jenjang?.includes("D4") || p.jenjang?.includes("Sarjana"));
  const d3Prodis = filteredProdis.filter(p => p.kode_prodi.startsWith("D3") || p.jenjang?.includes("D3"));

  return (
    <div ref={containerRef} className="relative w-full text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 select-none cursor-pointer ${
          isOpen
            ? "border-[#000080] dark:border-sky-400 ring-2 ring-[#000080]/20 dark:ring-sky-400/20 bg-white dark:bg-slate-800 shadow-md"
            : "border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-750"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <GraduationCap className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span className="truncate">
            {selectedItem ? (
              <span className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-[#0F4C81] dark:text-sky-300 font-mono text-[10px] font-bold">
                  {selectedItem.kode_prodi}
                </span>
                <span className="truncate">{selectedItem.nama_prodi}</span>
              </span>
            ) : (
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {isEn ? `All Programs (${prodis.length} Prodi)` : `Semua Program Studi (${prodis.length} Prodi)`}
              </span>
            )}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#000080] dark:text-sky-400" : ""
          }`}
        />
      </button>

      {/* Floating Modern Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 right-0 sm:right-auto sm:w-[420px] top-full mt-2 z-50 rounded-2xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.25),0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-3 text-slate-900 dark:text-white"
          >
            {/* Search Input Box */}
            <div className="relative mb-2.5">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder={isEn ? "Search program name or code..." : "Cari prodi (misal: Informatika, D4, K3)..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000080] dark:focus:ring-sky-400 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Degree Filter Tabs */}
            <div className="flex items-center gap-1 pb-2 border-b border-slate-100 dark:border-white/10 mb-2 overflow-x-auto scrollbar-none">
              {(
                [
                  { key: "all", label: isEn ? "All" : "Semua" },
                  { key: "S2", label: "S2 Terapan" },
                  { key: "D4", label: "Sarjana Terapan (D4)" },
                  { key: "D3", label: "Ahli Madya (D3)" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setDegreeFilter(tab.key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition shrink-0 cursor-pointer ${
                    degreeFilter === tab.key
                      ? "bg-[#0F4C81] text-white shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Programs List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 text-xs">
              {/* Option: Reset to All */}
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left font-bold transition cursor-pointer ${
                  selectedProdi === ""
                    ? "bg-blue-50 dark:bg-blue-950/70 text-[#000080] dark:text-sky-300 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#000080] dark:bg-sky-400" />
                  <span>{isEn ? `All Programs (${prodis.length} Prodi)` : `Semua Program Studi (${prodis.length} Prodi)`}</span>
                </div>
                {selectedProdi === "" && <Check className="w-3.5 h-3.5 text-[#000080] dark:text-sky-300" />}
              </button>

              {/* Group: S2 */}
              {s2Prodis.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Magister Terapan (S2)
                  </div>
                  <div className="space-y-1">
                    {s2Prodis.map((p) => {
                      const isSelected = selectedProdi === p.kode_prodi;
                      return (
                        <button
                          key={p.kode_prodi}
                          type="button"
                          onClick={() => {
                            onChange(p.kode_prodi);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-950/70 text-[#000080] dark:text-sky-300 font-bold border border-blue-200 dark:border-blue-800"
                              : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 shrink-0">
                              {p.kode_prodi}
                            </span>
                            <span className="truncate">{p.nama_prodi}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#000080] dark:text-sky-300 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Group: D4 */}
              {d4Prodis.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#0F4C81] dark:text-sky-300">
                    Sarjana Terapan (D4)
                  </div>
                  <div className="space-y-1">
                    {d4Prodis.map((p) => {
                      const isSelected = selectedProdi === p.kode_prodi;
                      return (
                        <button
                          key={p.kode_prodi}
                          type="button"
                          onClick={() => {
                            onChange(p.kode_prodi);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-950/70 text-[#000080] dark:text-sky-300 font-bold border border-blue-200 dark:border-blue-800"
                              : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-sky-300 shrink-0">
                              {p.kode_prodi}
                            </span>
                            <span className="truncate">{p.nama_prodi}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#000080] dark:text-sky-300 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Group: D3 */}
              {d3Prodis.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Diploma Tiga (D3)
                  </div>
                  <div className="space-y-1">
                    {d3Prodis.map((p) => {
                      const isSelected = selectedProdi === p.kode_prodi;
                      return (
                        <button
                          key={p.kode_prodi}
                          type="button"
                          onClick={() => {
                            onChange(p.kode_prodi);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-950/70 text-[#000080] dark:text-sky-300 font-bold border border-blue-200 dark:border-blue-800"
                              : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shrink-0">
                              {p.kode_prodi}
                            </span>
                            <span className="truncate">{p.nama_prodi}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#000080] dark:text-sky-300 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredProdis.length === 0 && (
                <div className="py-6 text-center text-slate-400 dark:text-slate-500">
                  <p className="text-xs">Tidak ada program studi yang cocok.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================================
// 2. CUSTOM SORT DROPDOWN (UI/UX MODERN, BUKAN SELECT POLOSAN)
// =========================================================================

interface CustomSortDropdownProps {
  selectedSort: string;
  onChange: (sort: string) => void;
  isEn?: boolean;
}

export function CustomSortDropdown({
  selectedSort,
  onChange,
  isEn = false,
}: CustomSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const SORT_OPTIONS = [
    {
      key: "latest",
      label: isEn ? "Latest Innovations" : "Terbaru",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      key: "popular",
      label: isEn ? "Most Viewed" : "Paling Dilihat",
      icon: TrendingUp,
      color: "text-amber-500",
    },
    {
      key: "demo",
      label: isEn ? "Top Live Demo" : "Top Live Demo",
      icon: PlayCircle,
      color: "text-emerald-500",
    },
  ];

  const currentOption = SORT_OPTIONS.find((s) => s.key === selectedSort) || SORT_OPTIONS[0];
  const CurrentIcon = currentOption.icon;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 select-none cursor-pointer ${
          isOpen
            ? "border-[#000080] dark:border-sky-400 ring-2 ring-[#000080]/20 dark:ring-sky-400/20 bg-white dark:bg-slate-800 shadow-md"
            : "border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-750"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          <CurrentIcon className={`w-4 h-4 ${currentOption.color} shrink-0`} />
          <span className="truncate">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] mr-1 hidden sm:inline">
              {isEn ? "Sort:" : "Urutkan:"}
            </span>
            {currentOption.label}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#000080] dark:text-sky-400" : ""
          }`}
        />
      </button>

      {/* Floating Modern Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 right-0 sm:right-auto sm:w-56 top-full mt-2 z-50 rounded-2xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-2 text-slate-900 dark:text-white"
          >
            <div className="space-y-1">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = selectedSort === opt.key;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      onChange(opt.key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/70 text-[#000080] dark:text-sky-300 font-bold border border-blue-200 dark:border-blue-800"
                        : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${opt.color}`} />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#000080] dark:text-sky-300" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
