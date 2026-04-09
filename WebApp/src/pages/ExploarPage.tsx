import React, { useState } from "react";
import { useApp, MOCK_EVENTS, type Category } from "../Context/AppContex";
import { BottomNav } from "./HomePage";

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "⬡" },
  { key: "college-fest", label: "College Fests", icon: "🎓" },
  { key: "popup", label: "Pop-Ups", icon: "🛍" },
  { key: "community", label: "Community", icon: "🤝" },
  { key: "music", label: "Music", icon: "🎵" },
  { key: "food", label: "Food", icon: "🍜" },
  { key: "tech", label: "Tech", icon: "💻" },
  { key: "sports", label: "Sports", icon: "⚡" },
];

const SORT_OPTIONS = ["Nearest", "This Weekend", "Price: Low", "Price: High", "Most Popular"];
const PRICE_OPTIONS = ["Any", "Free", "Under ₹100", "Under ₹500", "₹500+"];

export default function ExplorePage() {
  const { navigate, toggleSaveEvent, savedEvents, activeCategory, setActiveCategory } = useApp();
  const [sort, setSort] = useState("Nearest");
  const [priceFilter, setPriceFilter] = useState("Any");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = MOCK_EVENTS
    .filter((e) => activeCategory === "all" || e.category === activeCategory)
    .filter((e) => {
      if (priceFilter === "Free") return e.price === 0;
      if (priceFilter === "Under ₹100") return e.price < 100;
      if (priceFilter === "Under ₹500") return e.price < 500;
      if (priceFilter === "₹500+") return e.price >= 500;
      return true;
    })
    .sort((a, b) => {
      if (sort === "Price: Low") return a.price - b.price;
      if (sort === "Price: High") return b.price - a.price;
      if (sort === "Most Popular") return b.attendees - a.attendees;
      return 0;
    });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-stone-800 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => navigate("home")} className="p-2 rounded-xl bg-stone-800">
            <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M19 12H5m7-7-7 7 7 7"/>
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">Explore Events</h1>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-colors ${showFilters ? "bg-amber-400" : "bg-stone-800"}`}
          >
            <svg className={`w-5 h-5 ${showFilters ? "text-stone-950" : "text-stone-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polygon strokeWidth="2" points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
          </button>
          <div className="flex rounded-xl overflow-hidden bg-stone-800">
            <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-amber-400" : ""}`}>
              <svg className={`w-4 h-4 ${viewMode === "grid" ? "text-stone-950" : "text-stone-400"}`} fill="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-amber-400" : ""}`}>
              <svg className={`w-4 h-4 ${viewMode === "list" ? "text-stone-950" : "text-stone-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="8" y1="6" x2="21" y2="6" strokeWidth="2"/><line x1="8" y1="12" x2="21" y2="12" strokeWidth="2"/><line x1="8" y1="18" x2="21" y2="18" strokeWidth="2"/><line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2"/><line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2"/><line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="max-w-lg mx-auto mt-3 pt-3 border-t border-stone-800 space-y-3">
            <div>
              <p className="text-xs text-stone-400 font-medium mb-2">Sort By</p>
              <div className="flex gap-2 flex-wrap">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSort(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sort === s ? "bg-amber-400 text-stone-950" : "bg-stone-800 text-stone-300"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-stone-400 font-medium mb-2">Price</p>
              <div className="flex gap-2 flex-wrap">
                {PRICE_OPTIONS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${priceFilter === p ? "bg-amber-400 text-stone-950" : "bg-stone-800 text-stone-300"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Category scroll */}
        <div className="flex gap-2 overflow-x-auto py-4 -mx-4 px-4 scrollbar-none">
          {CATEGORIES.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors ${activeCategory === key ? "bg-amber-400 text-stone-950" : "bg-stone-900 text-stone-400 border border-stone-800"}`}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-stone-400 text-xs mb-4">{filtered.length} events found</p>

        {/* Events */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate("event-detail", event.id)}
                className="rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 cursor-pointer hover:border-stone-600 transition-all"
              >
                <div className="relative h-32">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSaveEvent(event.id); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/50 backdrop-blur rounded-full flex items-center justify-center"
                  >
                    <svg className={`w-3.5 h-3.5 ${savedEvents.includes(event.id) ? "fill-amber-400 stroke-amber-400" : "fill-none stroke-white"}`} viewBox="0 0 24 24">
                      <path strokeWidth="2" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
                <div className="p-2.5">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2 mb-1">{event.title}</p>
                  <p className="text-stone-500 text-xs">{event.distance}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-amber-400 text-xs font-bold">{event.price === 0 ? "Free" : `₹${event.price}`}</p>
                    <p className="text-stone-600 text-xs">{event.attendees} going</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate("event-detail", event.id)}
                className="flex gap-3 bg-stone-900 border border-stone-800 rounded-2xl p-3 cursor-pointer hover:border-stone-600 transition-colors"
              >
                <img src={event.image} alt={event.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight">{event.title}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{event.venue}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-amber-400 text-xs font-bold">{event.price === 0 ? "Free" : `₹${event.price}`}</span>
                    <span className="text-stone-700">•</span>
                    <span className="text-stone-400 text-xs">{event.distance}</span>
                    <span className="text-stone-700">•</span>
                    <span className="text-stone-400 text-xs">{event.attendees} going</span>
                  </div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {event.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="bg-stone-800 text-stone-400 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSaveEvent(event.id); }}
                  className="flex-shrink-0 p-1"
                >
                  <svg className={`w-4 h-4 ${savedEvents.includes(event.id) ? "fill-amber-400 stroke-amber-400" : "fill-none stroke-stone-500"}`} viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}