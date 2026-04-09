import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useApp } from "../Context/AppContex";
import { BottomNav } from "./HomePage";

// ─── Utility Functions ────────────────────────────────────────────────────────

/**
 * Generate a random ticket number
 * Format: TIX-XXXXX-XXXXX (e.g., TIX-A2F4K-9M2L7)
 */
function generateTicketNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "TIX-";
  
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 5; j++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i === 0) result += "-";
  }
  
  return result;
}

/**
 * Generate a random event code for QR encoding
 * Format: EVT-{timestamp}-{randomString}-{ticketNumber}
 */
function generateQRData(ticketNumber: string, eventId: string): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 11).toUpperCase();
  return `EVT-${eventId}-${timestamp}-${randomPart}-${ticketNumber}`;
}

/**
 * Generate QR code as data URL
 */
async function generateQRCodeDataUrl(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: "#0c0a09", // stone-950
        light: "#ffffff",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return "";
  }
}

// ─── Booking Confirmation ────────────────────────────────────────────────────
export function BookingConfirmPage() {
  const { tickets, navigate } = useApp();
  const [qrCode, setQrCode] = useState<string>("");
  const ticket = tickets[0];

  useEffect(() => {
    if (ticket && !ticket.ticketNumber) {
      // Generate QR code if ticket number doesn't exist
      const generateQR = async () => {
        const qrData = generateQRData(generateTicketNumber(), ticket.event.id);
        const dataUrl = await generateQRCodeDataUrl(qrData);
        setQrCode(dataUrl);
      };
      generateQR();
    } else if (ticket?.ticketNumber) {
      // Generate QR code from existing ticket number
      const generateQR = async () => {
        const qrData = generateQRData(ticket.ticketNumber, ticket.event.id);
        const dataUrl = await generateQRCodeDataUrl(qrData);
        setQrCode(dataUrl);
      };
      generateQR();
    }
  }, [ticket]);

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center px-4 py-8 lg:py-16">
      {/* Success animation */}
      <div className="mb-6 lg:mb-10 relative">
        <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-amber-400/10 border-2 border-amber-400 flex items-center justify-center animate-pulse">
          <svg className="w-10 h-10 lg:w-16 lg:h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-amber-400"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translateY(-48px)`,
              opacity: 0.6 - i * 0.05,
            }}
          />
        ))}
      </div>

      <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2 text-center">Booking Confirmed!</h1>
      <p className="text-stone-400 text-sm lg:text-base mb-8 lg:mb-12 text-center max-w-md">
        Your tickets are ready. Have an amazing time!
      </p>

      {/* Ticket Card */}
      <div className="w-full max-w-sm lg:max-w-md">
        <div className="bg-stone-900 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl">
          {/* Event Image */}
          <img
            src={ticket.event.image}
            alt={ticket.event.title}
            className="w-full h-40 lg:h-48 object-cover"
          />

          <div className="p-5 lg:p-6">
            {/* Event Details */}
            <h2 className="text-white font-bold text-lg lg:text-xl leading-tight">
              {ticket.event.title}
            </h2>
            <p className="text-stone-400 text-sm lg:text-base mt-1">
              {ticket.event.venue}
            </p>

            {/* Info Grid */}
            <div className="mt-4 lg:mt-6 grid grid-cols-2 gap-3 lg:gap-4">
              {[
                {
                  label: "Date",
                  value: new Date(ticket.event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                },
                { label: "Time", value: ticket.event.time },
                {
                  label: "Tickets",
                  value: `${ticket.quantity} person${ticket.quantity > 1 ? "s" : ""}`,
                },
                {
                  label: "Amount",
                  value: ticket.totalPrice === 0 ? "Free" : `₹${ticket.totalPrice}`,
                },
              ].map(({ label, value }) => (
                <div key={label} className="bg-stone-800/50 rounded-lg p-2.5 lg:p-3">
                  <p className="text-stone-500 text-xs lg:text-sm">{label}</p>
                  <p className="text-white text-sm lg:text-base font-semibold mt-1">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Decorative Divider with Notches */}
            <div className="flex items-center gap-2 my-5 lg:my-6">
              <div className="w-6 h-6 rounded-full bg-stone-950 -ml-9 lg:-ml-10 border-r border-stone-700" />
              <div className="flex-1 border-t border-dashed border-stone-600" />
              <div className="w-6 h-6 rounded-full bg-stone-950 -mr-9 lg:-mr-10 border-l border-stone-700" />
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 lg:w-48 lg:h-48 bg-white rounded-2xl flex items-center justify-center mb-3 lg:mb-4 p-2 border-4 border-stone-800">
                {qrCode ? (
                  <img src={qrCode} alt="QR Code" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-stone-200 animate-pulse rounded-lg" />
                )}
              </div>
              <p className="text-stone-500 text-xs lg:text-sm font-mono">
                {ticket.ticketNumber}
              </p>
              <p className="text-stone-600 text-xs mt-1 lg:mt-1.5">Show this at the venue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-8 w-full max-w-sm lg:max-w-md">
        <button
          onClick={() => navigate("my-tickets")}
          className="flex-1 bg-amber-400 text-stone-950 font-bold rounded-xl py-3 lg:py-4 text-sm lg:text-base hover:bg-amber-300 transition-colors duration-200"
        >
          View My Tickets
        </button>
        <button
          onClick={() => navigate("home")}
          className="flex-1 border border-stone-700 text-stone-300 rounded-xl py-3 lg:py-4 text-sm lg:text-base hover:bg-stone-900/50 transition-colors duration-200"
        >
          Go Home
        </button>
      </div>

      {/* Download/Share hint */}
      <p className="text-stone-600 text-xs mt-6 lg:mt-8 text-center">
        💡 Tip: Take a screenshot of your QR code or save it to your phone
      </p>
    </div>
  );
}

// ─── My Tickets ──────────────────────────────────────────────────────────────
export function MyTicketsPage() {
  const { tickets, navigate, cancelTicket } = useApp();
  const [activeTab, setActiveTab] = React.useState<"upcoming" | "attended" | "cancelled">(
    "upcoming"
  );
  const [qrCodes, setQrCodes] = React.useState<Record<string, string>>({});

  // Generate QR codes for all tickets
  useEffect(() => {
    const generateAllQRCodes = async () => {
      const codes: Record<string, string> = {};
      for (const ticket of tickets) {
        if (!codes[ticket.id]) {
          const qrData = generateQRData(ticket.ticketNumber, ticket.event.id);
          const dataUrl = await generateQRCodeDataUrl(qrData);
          codes[ticket.id] = dataUrl;
        }
      }
      setQrCodes(codes);
    };
    generateAllQRCodes();
  }, [tickets]);

  const filtered = tickets.filter((t) => t.status === activeTab);
  const upcomingCount = tickets.filter((t) => t.status === "upcoming").length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-24 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-stone-800 px-4 lg:px-8 py-3 lg:py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl lg:text-3xl font-bold text-white mb-4">My Tickets</h1>

          {/* Tabs */}
          <div className="flex gap-1 bg-stone-900 rounded-xl p-1 lg:w-fit">
            {(["upcoming", "attended", "cancelled"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-amber-400 text-stone-950"
                    : "text-stone-400 hover:text-stone-300"
                }`}
              >
                {tab}
                {tab === "upcoming" && upcomingCount > 0 && (
                  <span className="ml-2 bg-stone-800 text-stone-300 text-xs px-2 py-1 rounded-full font-bold">
                    {upcomingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 lg:pt-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-stone-900 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 lg:w-10 lg:h-10 text-stone-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"
                />
              </svg>
            </div>
            <p className="text-stone-300 font-medium text-lg">No {activeTab} tickets</p>
            <p className="text-stone-600 text-sm mt-1">
              Explore events to book your next experience
            </p>
            <button
              onClick={() => navigate("explore")}
              className="mt-6 bg-amber-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-sm lg:text-base hover:bg-amber-300 transition-colors"
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {filtered.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                qrCode={qrCodes[ticket.id]}
                navigate={navigate}
                cancelTicket={cancelTicket}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav - Mobile only */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

// ─── Ticket Card Component ────────────────────────────────────────────────────
interface TicketCardProps {
  ticket: any;
  qrCode: string;
  navigate: any;
  cancelTicket: any;
}

function TicketCard({ ticket, qrCode, navigate, cancelTicket }: TicketCardProps) {
  const [showQR, setShowQR] = React.useState(false);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden hover:border-stone-700 transition-colors">
      {/* Event Image Header */}
      <div className="relative h-36 lg:h-44">
        <img
          src={ticket.event.image}
          alt={ticket.event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3 lg:top-4 lg:right-4">
          <span
            className={`text-xs lg:text-sm font-bold px-3 py-1.5 rounded-full inline-block ${
              ticket.status === "upcoming"
                ? "bg-amber-400 text-stone-950"
                : ticket.status === "attended"
                  ? "bg-emerald-400 text-stone-950"
                  : "bg-stone-700 text-stone-300"
            }`}
          >
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </span>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
          <p className="text-white font-bold text-base lg:text-lg leading-tight line-clamp-2">
            {ticket.event.title}
          </p>
          <p className="text-stone-300 text-xs lg:text-sm mt-1">
            {ticket.event.venue}
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-5">
        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-2 lg:gap-3 mb-4 lg:mb-5">
          {[
            {
              label: "Date",
              value: new Date(ticket.event.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              }),
            },
            { label: "Tickets", value: `${ticket.quantity}x` },
            {
              label: "Paid",
              value: ticket.totalPrice === 0 ? "Free" : `₹${ticket.totalPrice}`,
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-stone-800/60 rounded-lg p-2.5 lg:p-3 text-center"
            >
              <p className="text-stone-500 text-xs lg:text-sm">{label}</p>
              <p className="text-white font-semibold text-sm lg:text-base mt-1">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Ticket ID with QR Preview */}
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full border border-dashed border-stone-700 rounded-xl p-3 lg:p-4 flex items-center justify-between hover:bg-stone-800/50 transition-colors mb-3 lg:mb-4"
        >
          <div className="text-left">
            <p className="text-stone-500 text-xs lg:text-sm">Ticket ID</p>
            <p className="text-white text-xs lg:text-sm font-mono font-bold mt-1">
              {ticket.ticketNumber}
            </p>
          </div>
          {qrCode ? (
            <img
              src={qrCode}
              alt="QR Code"
              className="w-14 h-14 lg:w-16 lg:h-16 rounded-lg object-contain bg-white p-1"
            />
          ) : (
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-stone-700 rounded-lg animate-pulse" />
          )}
        </button>

        {/* Expanded QR Code */}
        {showQR && qrCode && (
          <div className="mb-4 lg:mb-5 bg-stone-800/50 rounded-xl p-4 lg:p-5 border border-stone-700">
            <div className="bg-white rounded-lg p-4 flex items-center justify-center mb-3">
              <img src={qrCode} alt="QR Code" className="w-32 h-32 lg:w-40 lg:h-40" />
            </div>
            <p className="text-stone-400 text-xs lg:text-sm text-center">
              Show this QR code at the venue for entry
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {ticket.status === "upcoming" && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate("event-detail", ticket.event.id)}
              className="flex-1 border border-stone-700 text-stone-300 rounded-xl py-2.5 lg:py-3 text-xs lg:text-sm font-medium hover:bg-stone-800/50 transition-colors"
            >
              View Event
            </button>
            <button
              onClick={() => cancelTicket(ticket.id)}
              className="flex-1 border border-red-900/50 text-red-400 rounded-xl py-2.5 lg:py-3 text-xs lg:text-sm font-medium hover:bg-red-950/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}