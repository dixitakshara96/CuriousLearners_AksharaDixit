import React, { useState } from "react";
import { MOCK_EVENTS, useApp, type Category } from "../Context/AppContex";
import { BottomNav } from "./HomePage";

// ─── Search Page ─────────────────────────────────────────────────────────────
export function SearchPage() {
  const { navigate } = useApp();
  const [query, setQuery] = useState("");
  const [recent] = useState(["Techfest", "Food Festival", "Yoga", "Music"]);

  const results = query.length > 1
    ? MOCK_EVENTS.filter(
        (e) =>
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          e.location.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-stone-800 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => navigate("home")} className="p-2 rounded-xl bg-stone-800 flex-shrink-0">
            <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M19 12H5m7-7-7 7 7 7"/>
            </svg>
          </button>
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="m21 21-4.35-4.35" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Events, venues, categories..."
              className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {query.length === 0 ? (
          <>
            {/* Recent searches */}
            <div className="mb-6">
              <h3 className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQuery(r)}
                    className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-2 rounded-full text-sm text-stone-300"
                  >
                    <svg className="w-3 h-3 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <polyline points="12 8 12 12 14 14" strokeWidth="2"/><circle cx="12" cy="12" r="9" strokeWidth="2"/>
                    </svg>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h3 className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">Trending Near You</h3>
              <div className="space-y-3">
                {MOCK_EVENTS.slice(0, 4).map((event, i) => (
                  <div
                    key={event.id}
                    onClick={() => navigate("event-detail", event.id)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span className="text-stone-700 font-bold text-lg w-6 flex-shrink-0">{i + 1}</span>
                    <img src={event.image} alt={event.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{event.title}</p>
                      <p className="text-stone-500 text-xs">{event.distance} · {event.attendees} going</p>
                    </div>
                    <span className="text-amber-400 text-xs font-bold flex-shrink-0">{event.price === 0 ? "Free" : `₹${event.price}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-stone-500 text-xs mb-3">{results.length} results for "{query}"</p>
            {results.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <svg className="w-12 h-12 text-stone-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="m21 21-4.35-4.35" strokeWidth="2"/>
                </svg>
                <p className="text-stone-400 font-medium">No events found</p>
                <p className="text-stone-600 text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => navigate("event-detail", event.id)}
                    className="flex gap-3 bg-stone-900 border border-stone-800 rounded-2xl p-3 cursor-pointer"
                  >
                    <img src={event.image} alt={event.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm leading-tight">{event.title}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{event.venue} · {event.distance}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-amber-400 text-xs font-bold">{event.price === 0 ? "Free" : `₹${event.price}`}</span>
                        {event.tags.slice(0, 2).map((t) => (
                          <span key={t} className="bg-stone-800 text-stone-400 text-xs px-1.5 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Notifications Page ───────────────────────────────────────────────────────
export function NotificationsPage() {
  const { notifications, markNotificationRead, navigate } = useApp();

  const iconMap = {
    reminder: "⏰",
    booking: "🎟",
    promo: "🔥",
    update: "📍",
  };

  const colorMap = {
    reminder: "bg-amber-400/10 text-amber-400",
    booking: "bg-emerald-400/10 text-emerald-400",
    promo: "bg-red-400/10 text-red-400",
    update: "bg-blue-400/10 text-blue-400",
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-24">
      <div className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-stone-800 px-4 py-3 flex items-center gap-3 max-w-lg mx-auto">
        <button onClick={() => navigate("home")} className="p-2 rounded-xl bg-stone-800">
          <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" d="M19 12H5m7-7-7 7 7 7"/>
          </svg>
        </button>
        <h1 className="text-lg font-bold text-white flex-1">Notifications</h1>
        <span className="text-xs text-stone-500">{notifications.filter((n) => !n.read).length} unread</span>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`flex gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${n.read ? "bg-stone-900 border-stone-800" : "bg-stone-900 border-amber-400/20"}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${colorMap[n.type]}`}>
              {iconMap[n.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-medium leading-tight ${n.read ? "text-stone-300" : "text-white"}`}>{n.title}</p>
                {!n.read && <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />}
              </div>
              <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">{n.body}</p>
              <p className="text-stone-700 text-xs mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
export function ProfilePage() {
  const { user, tickets, savedEvents, navigate } = useApp();
  const [editMode, setEditMode] = useState(false);

  const interests: { key: Category; label: string; icon: string }[] = [
    { key: "tech", label: "Tech", icon: "💻" },
    { key: "music", label: "Music", icon: "🎵" },
    { key: "food", label: "Food", icon: "🍜" },
    { key: "community", label: "Community", icon: "🤝" },
    { key: "college-fest", label: "College Fests", icon: "🎓" },
    { key: "sports", label: "Sports", icon: "⚡" },
  ];

  const stats = [
    { label: "Events Attended", value: tickets.filter((t) => t.status === "attended").length },
    { label: "Upcoming", value: tickets.filter((t) => t.status === "upcoming").length },
    { label: "Saved", value: savedEvents.length },
  ];

  const menuItems = [
    { icon: "🎟", label: "My Tickets", action: () => navigate("my-tickets") },
    { icon: "🔔", label: "Notifications", action: () => navigate("notifications") },
    { icon: "🗺", label: "Saved Events", action: () => navigate("explore") },
    { icon: "➕", label: "Create an Event", action: () => navigate("create-event") },
    { icon: "⚙", label: "Account Settings", action: () => {} },
    { icon: "❓", label: "Help & Support", action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-24">
      {/* Header */}
      <div className="bg-stone-900 border-b border-stone-800 px-4 pt-12 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 flex items-center justify-center">
                <span className="text-stone-950 font-bold text-xl">{user.avatar}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{user.name}</h1>
                <p className="text-stone-400 text-sm">{user.email}</p>
                {user.college && <p className="text-stone-500 text-xs mt-0.5">📚 {user.college}</p>}
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="p-2 rounded-xl bg-stone-800 border border-stone-700"
            >
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path strokeWidth="2" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-1 text-stone-400 text-xs mb-5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" strokeWidth="2"/>
            </svg>
            {user.location}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ label, value }) => (
              <div key={label} className="bg-stone-800 rounded-xl p-3 text-center">
                <p className="text-white font-bold text-xl">{value}</p>
                <p className="text-stone-500 text-xs mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Interests */}
        <div className="mb-6">
          <h3 className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">Your Interests</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map(({ key, label, icon }) => (
              <span
                key={key}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${user.interests.includes(key) ? "bg-amber-400/10 text-amber-400 border border-amber-400/30" : "bg-stone-900 text-stone-500 border border-stone-800"}`}
              >
                {icon} {label}
              </span>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-1">
          {menuItems.map(({ icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-600 transition-colors text-left"
            >
              <span className="text-lg w-6 text-center">{icon}</span>
              <span className="text-white text-sm font-medium flex-1">{label}</span>
              <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          ))}
        </div>

        {/* Sign out */}
        <button className="w-full mt-4 border border-red-900/50 text-red-400 rounded-xl py-3 text-sm font-medium">
          Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}