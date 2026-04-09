import React, { useEffect, useState } from "react";
import { useApp, MOCK_EVENTS } from "../Context/AppContex";

export default function CheckoutPage() {
  const { cartEventId, cartQuantity, navigate, confirmBooking } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: "Arjun Sharma", email: "arjun.sharma@gmail.com", phone: "9876543210" });
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "wallet">("upi");
  const [loading, setLoading] = useState(false);

  const event = MOCK_EVENTS.find((e) => e.id === cartEventId);
  if (!event) return null;

  const subtotal = event.price * cartQuantity;
  const fee = event.price > 0 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + fee;

  const handlePay = () => {
    setLoading(true);
    const ticket = {
        id: event.id + "-" + Date.now(),
        eventId: event.id,
        event: event,
        quantity: cartQuantity,
        totalPrice: total,
        bookingDate:new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) ,
        status: "upcoming" as const,
        qrCode: "",
        ticketNumber: Math.random().toString(36).substring(2, 10).toUpperCase(),
    }
    setTimeout(() => {
      confirmBooking(ticket);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {

    console.log(event)
  }
  
  ,)
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-stone-800 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("event-detail", event.id)} className="p-2 rounded-xl bg-stone-800">
          <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" d="M19 12H5m7-7-7 7 7 7"/>
          </svg>
        </button>
        <h1 className="text-lg font-bold text-white flex-1">Checkout</h1>
        <div className="flex items-center gap-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-amber-400 text-stone-950" : "bg-stone-800 text-stone-500"}`}>1</div>
          <div className={`w-8 h-0.5 ${step >= 2 ? "bg-amber-400" : "bg-stone-800"}`} />
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-amber-400 text-stone-950" : "bg-stone-800 text-stone-500"}`}>2</div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Event Summary Card */}
        <div className="flex gap-3 bg-stone-900 border border-stone-800 rounded-2xl p-3 mb-5">
          <img src={event.image} alt={event.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">{event.title}</p>
            <p className="text-stone-400 text-xs mt-0.5">{event.venue}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-stone-400 text-xs">{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              <span className="text-stone-700">•</span>
              <span className="text-stone-400 text-xs">{event.time}</span>
              <span className="text-stone-700">•</span>
              <span className="text-amber-400 text-xs font-semibold">×{cartQuantity}</span>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <>
            {/* Attendee Details */}
            <div className="mb-5">
              <h2 className="text-white font-semibold mb-3">Attendee Details</h2>
              <div className="space-y-3">
                {["name", "email", "phone"].map((field) => (
                  <div key={field}>
                    <label className="text-stone-400 text-xs mb-1.5 block capitalize">{field === "phone" ? "Mobile Number" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      value={form[field as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder={field === "phone" ? "10-digit mobile number" : `Enter your ${field}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 mb-4">
              <h3 className="text-white font-semibold mb-3 text-sm">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-400">Ticket price × {cartQuantity}</span>
                  <span className="text-white">{event.price === 0 ? "Free" : `₹${subtotal}`}</span>
                </div>
                {fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Convenience fee (5%)</span>
                    <span className="text-white">₹{fee}</span>
                  </div>
                )}
                <div className="border-t border-stone-800 pt-2 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-amber-400 font-bold text-base">{total === 0 ? "Free" : `₹${total}`}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-amber-400 text-stone-950 font-bold rounded-xl py-3.5 text-sm"
            >
              Continue to Payment →
            </button>
          </>
        ) : (
          <>
            {/* Payment Methods */}
            <div className="mb-5">
              <h2 className="text-white font-semibold mb-3">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { key: "upi" as const, label: "UPI", sub: "PhonePe, GPay, Paytm", icon: "📱" },
                  { key: "card" as const, label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", icon: "💳" },
                  { key: "wallet" as const, label: "Digital Wallet", sub: "Paytm Wallet, Amazon Pay", icon: "👛" },
                ].map(({ key, label, sub, icon }) => (
                  <div
                    key={key}
                    onClick={() => setPayMethod(key)}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${payMethod === key ? "border-amber-400 bg-amber-400/5" : "border-stone-800 bg-stone-900"}`}
                  >
                    <span className="text-2xl">{icon}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{label}</p>
                      <p className="text-stone-500 text-xs">{sub}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${payMethod === key ? "border-amber-400" : "border-stone-600"}`}>
                      {payMethod === key && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {payMethod === "upi" && (
              <div className="mb-5">
                <label className="text-stone-400 text-xs mb-1.5 block">UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Total */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 mb-4 flex justify-between items-center">
              <span className="text-stone-400 text-sm">Total to pay</span>
              <span className="text-amber-400 font-bold text-xl">{total === 0 ? "Free" : `₹${total}`}</span>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-amber-400 text-stone-950 font-bold rounded-xl py-3.5 text-sm disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Processing...
                </>
              ) : (
                `${total === 0 ? "Register Free" : `Pay ₹${total}`} — Confirm Booking`
              )}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-stone-400 text-sm mt-3">← Back to Details</button>
          </>
        )}
      </div>
    </div>
  );
}