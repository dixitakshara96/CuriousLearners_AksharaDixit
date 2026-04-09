import React, { useState } from "react";
import { useApp } from "../Context/AppContex";

const CATEGORY_OPTIONS = [
  { value: "college-fest", label: "College Fest", icon: "🎓" },
  { value: "popup", label: "Pop-Up", icon: "🛍" },
  { value: "community", label: "Community", icon: "🤝" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "food", label: "Food", icon: "🍜" },
  { value: "tech", label: "Tech", icon: "💻" },
  { value: "sports", label: "Sports", icon: "⚡" },
];

export default function CreateEventPage() {
  const { navigate } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    venue: "",
    location: "",
    price: "",
    capacity: "",
    description: "",
    tags: "",
    isFree: false,
  });

  const update = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const steps = [
    { num: 1, label: "Basics" },
    { num: 2, label: "Details" },
    { num: 3, label: "Preview" },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-stone-800 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => navigate("profile")} className="p-2 rounded-xl bg-stone-800">
            <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M19 12H5m7-7-7 7 7 7"/>
            </svg>
          </button>
          <h1 className="text-lg font-bold text-white flex-1">Create Event</h1>
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= s.num ? "bg-amber-400 text-stone-950" : "bg-stone-800 text-stone-500"}`}>
                  {step > s.num ? "✓" : s.num}
                </div>
                {i < steps.length - 1 && <div className={`w-6 h-0.5 ${step > s.num ? "bg-amber-400" : "bg-stone-800"}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        {/* Step label */}
        <div className="mb-5">
          <h2 className="text-sm text-stone-400 uppercase tracking-wider">Step {step} of 3 — {steps[step - 1].label}</h2>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-stone-400 text-xs mb-1.5 block">Event Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="What's your event called?"
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-stone-400 text-xs mb-2 block">Category *</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORY_OPTIONS.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => update("category", value)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-colors ${form.category === value ? "border-amber-400 bg-amber-400/10 text-amber-400" : "border-stone-800 bg-stone-900 text-stone-400"}`}
                  >
                    <span className="text-xl">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-400 text-xs mb-1.5 block">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-stone-400 text-xs mb-1.5 block">Time *</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="text-stone-400 text-xs mb-1.5 block">Venue Name *</label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => update("venue", e.target.value)}
                placeholder="e.g. BBAU Auditorium"
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-stone-400 text-xs mb-1.5 block">Location / Area *</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="e.g. Gomti Nagar, Lucknow"
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {/* Pricing */}
            <div>
              <label className="text-stone-400 text-xs mb-2 block">Pricing</label>
              <div
                onClick={() => update("isFree", !form.isFree)}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer mb-3 ${form.isFree ? "border-emerald-400/30 bg-emerald-400/5" : "border-stone-800 bg-stone-900"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  <div>
                    <p className="text-white text-sm font-medium">Free Event</p>
                    <p className="text-stone-500 text-xs">No ticket price</p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full transition-colors relative ${form.isFree ? "bg-emerald-400" : "bg-stone-700"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.isFree ? "left-5" : "left-0.5"}`} />
                </div>
              </div>
              {!form.isFree && (
                <div>
                  <label className="text-stone-400 text-xs mb-1.5 block">Ticket Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="e.g. 299"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="text-stone-400 text-xs mb-1.5 block">Max Capacity</label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => update("capacity", e.target.value)}
                placeholder="e.g. 500"
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-stone-400 text-xs mb-1.5 block">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Tell attendees what to expect..."
                rows={4}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-stone-400 text-xs mb-1.5 block">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="e.g. Music, Dance, Outdoor"
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
              />
              {form.tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="bg-stone-800 text-stone-300 text-xs px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div>
              <label className="text-stone-400 text-xs mb-1.5 block">Cover Image</label>
              <div className="border-2 border-dashed border-stone-700 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-stone-500 transition-colors">
                <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/><circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2"/><polyline points="21 15 16 10 5 21" strokeWidth="2"/>
                </svg>
                <p className="text-stone-500 text-sm">Tap to upload image</p>
                <p className="text-stone-700 text-xs">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-stone-400 text-sm mb-4">Preview your event listing</h3>
            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden mb-4">
              <div className="h-36 bg-stone-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h2 className="text-white font-bold text-lg flex-1">{form.title || "Your Event Title"}</h2>
                  {form.category && (
                    <span className="bg-amber-400 text-stone-950 text-xs font-bold px-2 py-1 rounded-full ml-2 capitalize">
                      {form.category.replace("-", " ")}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    { icon: "📅", value: form.date ? new Date(form.date).toLocaleDateString("en-IN", { day: "numeric", month: "long" }) : "Date TBD" },
                    { icon: "⏰", value: form.time || "Time TBD" },
                    { icon: "📍", value: form.venue || "Venue TBD" },
                    { icon: "💰", value: form.isFree ? "Free" : form.price ? `₹${form.price}` : "Price TBD" },
                  ].map(({ icon, value }) => (
                    <div key={value} className="flex items-center gap-2 text-xs text-stone-400">
                      <span>{icon}</span> {value}
                    </div>
                  ))}
                </div>
                {form.description && (
                  <p className="text-stone-500 text-xs mt-3 leading-relaxed line-clamp-3">{form.description}</p>
                )}
                {form.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="bg-stone-800 text-stone-400 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 text-xs text-amber-400">
              ℹ️ Your event will be reviewed and published within 2 hours of submission.
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-stone-950 border-t border-stone-800 px-4 py-4">
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2)}
              className="border border-stone-700 text-stone-300 rounded-xl px-5 py-3 text-sm"
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < 3) setStep((s) => (s + 1) as 2 | 3);
              else navigate("home");
            }}
            className="flex-1 bg-amber-400 text-stone-950 font-bold rounded-xl py-3 text-sm"
          >
            {step < 3 ? "Next →" : "Publish Event 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}