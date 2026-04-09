import React, { useState } from "react";
import { useApp, MOCK_EVENTS } from "../Context/AppContex";

export default function EventDetailPage() {
  const { selectedEventId, navigate, toggleSaveEvent, savedEvents, addToCart } = useApp();
  const [qty, setQty] = useState(1);

  const event = MOCK_EVENTS.find((e) => e.id === selectedEventId);
  if (!event) return null;

  const isSaved = savedEvents.includes(event.id);
  const pct = Math.round((event.attendees / event.capacity) * 100);

  const handleBook = () => {
    addToCart(event.id, qty);
    navigate("checkout");
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-32">
      {/* Hero Image */}
      <div className="relative h-64">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

        {/* Top actions */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-10">
          <button
            onClick={() => navigate("explore")}
            className="w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M19 12H5m7-7-7 7 7 7"/>
            </svg>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => toggleSaveEvent(event.id)}
              className="w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center"
            >
              <svg className={`w-5 h-5 ${isSaved ? "fill-amber-400 stroke-amber-400" : "fill-none stroke-white"}`} viewBox="0 0 24 24">
                <path strokeWidth="2" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
            <button className="w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3" strokeWidth="2"/><circle cx="6" cy="12" r="3" strokeWidth="2"/><circle cx="18" cy="19" r="3" strokeWidth="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeWidth="2"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-amber-400 text-stone-950 text-xs font-bold px-3 py-1 rounded-full capitalize">
            {event.category.replace("-", " ")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 -mt-2">
        <h1 className="text-2xl font-bold text-white leading-tight mt-4">{event.title}</h1>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-amber-400 font-bold text-sm">{event.price === 0 ? "Free Entry" : `₹${event.price}/person`}</span>
          <span className="text-stone-600">•</span>
          <span className="text-stone-400 text-sm">{event.distance} away</span>
          <span className="text-stone-600">•</span>
          <span className="text-stone-400 text-sm">{event.attendees} attending</span>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
              </svg>
              <span className="text-stone-400 text-xs">Date & Time</span>
            </div>
            <p className="text-white text-sm font-medium">
              {new Date(event.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" })}
            </p>
            <p className="text-stone-400 text-xs">{event.time}</p>
          </div>
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" strokeWidth="2"/>
              </svg>
              <span className="text-stone-400 text-xs">Venue</span>
            </div>
            <p className="text-white text-sm font-medium">{event.venue}</p>
            <p className="text-stone-400 text-xs">{event.location}</p>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mt-5 bg-stone-900 border border-stone-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone-300 text-sm font-medium">Filling up fast</span>
            <span className="text-amber-400 text-sm font-bold">{pct}% full</span>
          </div>
          <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-stone-500 text-xs mt-2">{event.capacity - event.attendees} spots remaining out of {event.capacity}</p>
        </div>

        {/* Organizer */}
        <div className="mt-4 flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-xl p-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
            <span className="text-amber-400 font-bold text-sm">{event.organizer.charAt(0)}</span>
          </div>
          <div>
            <p className="text-stone-400 text-xs">Organized by</p>
            <p className="text-white text-sm font-medium">{event.organizer}</p>
          </div>
          <button className="ml-auto text-amber-400 text-xs font-medium border border-amber-400/30 px-3 py-1.5 rounded-lg">Follow</button>
        </div>

        {/* Tags */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {event.tags.map((tag) => (
            <span key={tag} className="bg-stone-800 text-stone-300 text-xs px-3 py-1.5 rounded-full">{tag}</span>
          ))}
        </div>

        {/* Description */}
        <div className="mt-5">
          <h3 className="text-white font-semibold mb-2">About this event</h3>
          <p className="text-stone-400 text-sm leading-relaxed">{event.description}</p>
        </div>

        {/* Map placeholder */}
        <div className="mt-5 h-36 bg-stone-900 border border-stone-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "repeating-linear-gradient(0deg, #4b5563 0, #4b5563 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, #4b5563 0, #4b5563 1px, transparent 0, transparent 50%)",
            backgroundSize: "30px 30px"
          }} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-stone-950" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              </svg>
            </div>
            <p className="text-stone-400 text-xs">{event.venue}</p>
          </div>
        </div>
      </div>

      {/* Booking Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-stone-950 border-t border-stone-800 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {event.price > 0 && (
            <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center text-white font-bold"
              >−</button>
              <span className="text-white font-medium w-4 text-center">{qty}</span>
              <button
                onClick={() => setQty(Math.min(10, qty + 1))}
                className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center text-white font-bold"
              >+</button>
            </div>
          )}
          <button
            onClick={handleBook}
            className="flex-1 bg-amber-400 text-stone-950 font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
            </svg>
            {event.price === 0 ? "Register Free" : `Book — ₹${event.price * qty}`}
          </button>
        </div>
      </div>
    </div>
  );
}