import React, { useState } from "react";

import { authApi, setToken } from "../Context/api";
import { useApp } from "../Context/AppContex";

// ─── Shared brand logo ────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 mb-2">
      <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg">
        <span className="text-stone-950 font-black text-base">TA</span>
      </div>
      <span className="font-black text-3xl tracking-tight text-white">TixArena</span>
    </div>
  );
}

// ─── Input component ──────────────────────────────────────────────────────────
function Field({
  label, type = "text", value, onChange, placeholder, icon,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; icon?: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="text-stone-400 text-xs mb-1.5 block">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">{icon}</div>
        )}
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-stone-900 border border-stone-700 rounded-xl py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors ${icon ? "pl-10" : "pl-4"} ${isPassword ? "pr-10" : "pr-4"}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2">
            {show ? (
              <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23" strokeWidth="2"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3" strokeWidth="2"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
export function LoginPage() {
  const { navigate, loginUser } = useApp();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      setToken(res.token);
      loginUser(res.user);
      navigate("home");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Top decorative bar */}
      <div className="h-1 bg-amber-400" />

      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-amber-400/5" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-400/5" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8 relative max-w-sm mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo />
          <p className="text-stone-400 text-sm mt-2">Your city. Your events.</p>
        </div>

        {/* Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
          <h2 className="text-white font-bold text-xl mb-1">Welcome back</h2>
          <p className="text-stone-500 text-sm mb-6">Sign in to your account</p>

          <div className="space-y-4">
            <Field
              label="Email address" type="email" value={email} onChange={setEmail}
              placeholder="you@example.com"
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline strokeWidth="2" points="22,6 12,13 2,6"/></svg>}
            />
            <Field
              label="Password" type="password" value={password} onChange={setPassword}
              placeholder="Enter your password"
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/><path strokeWidth="2" d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
            />
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-950/50 border border-red-900/50 rounded-xl px-3 py-2.5">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
              </svg>
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-5 bg-amber-400 text-stone-950 font-bold rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Signing in...</>
            ) : "Sign In →"}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-800"/></div>
            <div className="relative flex justify-center"><span className="bg-stone-900 px-3 text-stone-600 text-xs">or</span></div>
          </div>

          {/* Demo quick login */}
          <button
            onClick={() => { setEmail("demo@TixArena.in"); setPassword("demo123"); }}
            className="w-full border border-stone-700 text-stone-400 rounded-xl py-2.5 text-xs font-medium hover:border-stone-500 transition-colors"
          >
            Use demo account
          </button>
        </div>

        <p className="text-center text-stone-500 text-sm mt-6">
          Don't have an account?{" "}
          <button onClick={() => navigate("signup")} className="text-amber-400 font-semibold">
            Sign up free
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── SIGNUP PAGE ──────────────────────────────────────────────────────────────
const INTEREST_OPTIONS = [
  { key: "tech", label: "Tech", icon: "💻" },
  { key: "music", label: "Music", icon: "🎵" },
  { key: "food", label: "Food", icon: "🍜" },
  { key: "community", label: "Community", icon: "🤝" },
  { key: "college-fest", label: "College Fests", icon: "🎓" },
  { key: "popup", label: "Pop-Ups", icon: "🛍" },
  { key: "sports", label: "Sports", icon: "⚡" },
];

export function SignupPage() {
  const { navigate, loginUser } = useApp();
  const [step, setStep]           = useState<1 | 2>(1);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [college, setCollege]     = useState("");
  const [location, setLocation]   = useState("Lucknow");
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const toggleInterest = (key: string) => {
    setInterests((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const validateStep1 = () => {
    if (!name.trim()) { setError("Name is required"); return false; }
    if (!email.trim()) { setError("Email is required"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email"); return false; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return false; }
    if (password !== confirm) { setError("Passwords do not match"); return false; }
    return true;
  };

  const handleNext = () => {
    setError("");
    if (validateStep1()) setStep(2);
  };

  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await authApi.signup({ name, email, password, college, location, interests });
      setToken(res.token);
      loginUser(res.user);
      navigate("home");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      <div className="h-1 bg-amber-400" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-amber-400/5" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-400/5" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8 relative max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <Logo />
          <p className="text-stone-400 text-sm mt-2">Join thousands of event-goers in Lucknow</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? "bg-amber-400 text-stone-950" : "bg-stone-800 text-stone-500"}`}>
                {step > s ? "✓" : s}
              </div>
              {s < 2 && <div className={`h-0.5 w-10 transition-colors ${step > s ? "bg-amber-400" : "bg-stone-800"}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
          {step === 1 ? (
            <>
              <h2 className="text-white font-bold text-xl mb-1">Create account</h2>
              <p className="text-stone-500 text-sm mb-5">Tell us a bit about yourself</p>
              <div className="space-y-4">
                <Field label="Full Name" value={name} onChange={setName} placeholder="Arjun Sharma"
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" strokeWidth="2"/></svg>}
                />
                <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com"
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline strokeWidth="2" points="22,6 12,13 2,6"/></svg>}
                />
                <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 6 characters"
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/><path strokeWidth="2" d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                />
                <Field label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Re-enter password"
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline strokeWidth="2" points="22 4 12 14.01 9 11.01"/></svg>}
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-white font-bold text-xl mb-1">Almost there!</h2>
              <p className="text-stone-500 text-sm mb-5">Help us personalise your experience</p>
              <div className="space-y-4">
                <Field label="College / Institution (optional)" value={college} onChange={setCollege} placeholder="e.g. IET Lucknow"
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M22 10v6M2 10l10-5 10 5-10 5z"/><path strokeWidth="2" d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
                />
                <Field label="Your Area / Locality" value={location} onChange={setLocation} placeholder="e.g. Gomti Nagar"
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" strokeWidth="2"/></svg>}
                />
                <div>
                  <label className="text-stone-400 text-xs mb-2 block">What are you interested in?</label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map(({ key, label, icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleInterest(key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${interests.includes(key) ? "bg-amber-400/10 border-amber-400/40 text-amber-400" : "bg-stone-800 border-stone-700 text-stone-400"}`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-950/50 border border-red-900/50 rounded-xl px-3 py-2.5">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
              </svg>
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mt-5">
            {step === 2 && (
              <button onClick={() => { setStep(1); setError(""); }} className="border border-stone-700 text-stone-400 rounded-xl px-4 py-3 text-sm">
                ← Back
              </button>
            )}
            <button
              onClick={step === 1 ? handleNext : handleSignup}
              disabled={loading}
              className="flex-1 bg-amber-400 text-stone-950 font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Creating account...</>
              ) : step === 1 ? "Continue →" : "Create Account 🎉"}
            </button>
          </div>
        </div>

        <p className="text-center text-stone-500 text-sm mt-6">
          Already have an account?{" "}
          <button onClick={() => navigate("login")} className="text-amber-400 font-semibold">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}