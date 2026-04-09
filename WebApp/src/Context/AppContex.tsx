import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authApi, getToken, clearToken, type UserProfile } from "./api";

export type Category = "all" | "college-fest" | "popup" | "community" | "music" | "food" | "tech" | "sports";

export interface Event {
  id: string;
  title: string;
  category: Category;
  date: string;
  time: string;
  venue: string;
  location: string;
  distance: string;
  price: number;
  image: string;
  tags: string[];
  organizer: string;
  attendees: number;
  capacity: number;
  description: string;
  isFeatured?: boolean;
}

export interface Ticket {
  id: string;
  eventId: string;
  event: Event;
  quantity: number;
  totalPrice: number;
  bookingDate: string;
  status: "upcoming" | "attended" | "cancelled";
  qrCode: string;
  ticketNumber: string;
}

export type Page =
  | "login"
  | "signup"
  | "home"
  | "explore"
  | "event-detail"
  | "checkout"
  | "my-tickets"
  | "profile"
  | "notifications"
  | "search"
  | "create-event"
  | "booking-confirm";

interface Notification {
  id: string;
  type: "reminder" | "booking" | "promo" | "update";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

interface AppState {
  currentPage: Page;
  selectedEventId: string | null;
  user: UserProfile | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  tickets: Ticket[];
  savedEvents: string[];
  cartEventId: string | null;
  cartQuantity: number;
  activeCategory: Category;
  notifications: Notification[];
}

interface AppContextType extends AppState {
  navigate: (page: Page, eventId?: string) => void;
  loginUser: (user: UserProfile) => void;
  logout: () => void;
  toggleSaveEvent: (eventId: string) => void;
  addToCart: (eventId: string, quantity: number) => void;
  confirmBooking: (ticket: Ticket) => void;
  setActiveCategory: (c: Category) => void;
  markNotificationRead: (id: string) => void;
  cancelTicket: (ticketId: string) => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "reminder", title: "Techfest starts tomorrow!", body: "Your tickets are ready. Gates open at 9 AM.", time: "1h ago", read: false },
  { id: "n2", type: "promo", title: "New event near you", body: "Photography Walk — Old City just listed, only 15 spots left.", time: "3h ago", read: false },
  { id: "n3", type: "booking", title: "Booking confirmed", body: "Sunday Bazaar Pop-Up — 1 ticket successfully booked.", time: "1d ago", read: true },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentPage: "login",
    selectedEventId: null,
    user: null,
    isLoggedIn: false,
    authLoading: true,
    tickets: [],
    savedEvents: [],
    cartEventId: null,
    cartQuantity: 1,
    activeCategory: "all",
    notifications: MOCK_NOTIFICATIONS,
  });

  // Auto-login if token exists
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setState((s) => ({ ...s, authLoading: false, currentPage: "login" }));
      return;
    }
    authApi.me()
      .then((res) => {
        setState((s) => ({ ...s, user: res.user, isLoggedIn: true, authLoading: false, currentPage: "home" }));
      })
      .catch(() => {
        clearToken();
        setState((s) => ({ ...s, authLoading: false, currentPage: "login" }));
      });
  }, []);

  const navigate = useCallback((page: Page, eventId?: string) => {
    setState((s) => ({ ...s, currentPage: page, selectedEventId: eventId ?? s.selectedEventId }));
    window.scrollTo(0, 0);
  }, []);

  const loginUser = useCallback((user: UserProfile) => {
    setState((s) => ({ ...s, user, isLoggedIn: true }));
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setState((s) => ({ ...s, user: null, isLoggedIn: false, currentPage: "login", tickets: [], savedEvents: [] }));
  }, []);

  const toggleSaveEvent = useCallback((eventId: string) => {
    setState((s) => ({
      ...s,
      savedEvents: s.savedEvents.includes(eventId)
        ? s.savedEvents.filter((id) => id !== eventId)
        : [...s.savedEvents, eventId],
    }));
  }, []);

  const addToCart = useCallback((eventId: string, quantity: number) => {
    setState((s) => ({ ...s, cartEventId: eventId, cartQuantity: quantity }));
  }, []);

  const confirmBooking = useCallback((ticket: Ticket) => {
    setState((s) => ({ ...s, tickets: [ticket, ...s.tickets], cartEventId: null, currentPage: "booking-confirm" }));
  }, []);

  const setActiveCategory = useCallback((c: Category) => setState((s) => ({ ...s, activeCategory: c })), []);

  const markNotificationRead = useCallback((id: string) => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
  }, []);

  const cancelTicket = useCallback((ticketId: string) => {
    setState((s) => ({ ...s, tickets: s.tickets.map((t) => (t.id === ticketId ? { ...t, status: "cancelled" as const } : t)) }));
  }, []);

  if (state.authLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center">
            <span className="text-stone-950 font-black text-lg">LK</span>
          </div>
          <svg className="w-5 h-5 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ ...state, navigate, loginUser, logout, toggleSaveEvent, addToCart, confirmBooking, setActiveCategory, markNotificationRead, cancelTicket }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

export const MOCK_EVENTS: Event[] = [
  { id: "evt-001", title: "Techfest 2025 — IIT Lucknow", category: "college-fest", date: "2025-04-15", time: "10:00 AM", venue: "IIT Lucknow Campus", location: "Gomti Nagar, Lucknow", distance: "2.3 km", price: 299, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", tags: ["Tech", "Robotics", "AI", "Hackathon"], organizer: "IIT Lucknow", attendees: 1240, capacity: 2000, isFeatured: true, description: "Annual technology festival featuring robotics competitions, AI workshops, and startup pitches." },
  { id: "evt-002", title: "Sunday Bazaar Pop-Up", category: "popup", date: "2025-04-13", time: "11:00 AM", venue: "Hazratganj Central Park", location: "Hazratganj, Lucknow", distance: "1.1 km", price: 50, image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80", tags: ["Shopping", "Handmade", "Food", "Art"], organizer: "LKO Makers Collective", attendees: 320, capacity: 500, isFeatured: true, description: "A vibrant pop-up market with 60+ local artisans, handmade crafts, and street food." },
  { id: "evt-003", title: "Indie Nights — Live Music", category: "music", date: "2025-04-18", time: "7:00 PM", venue: "Oudh 1590 Rooftop", location: "Vipin Khand, Lucknow", distance: "3.7 km", price: 499, image: "https://images.unsplash.com/photo-1501386761578-eaa54b41f1eb?w=800&q=80", tags: ["Music", "Indie", "Live", "Rooftop"], organizer: "Rhythm House Events", attendees: 180, capacity: 250, isFeatured: false, description: "Intimate rooftop evening with 4 indie artists performing original music." },
  { id: "evt-004", title: "Flavours of Awadh Food Fest", category: "food", date: "2025-04-20", time: "12:00 PM", venue: "Janeshwar Mishra Park", location: "Gomti Nagar, Lucknow", distance: "4.2 km", price: 149, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", tags: ["Food", "Awadhi", "Street Food", "Biryani"], organizer: "Lucknow Food Society", attendees: 860, capacity: 1500, isFeatured: true, description: "2-day Awadhi cuisine festival with 40+ food stalls and live cooking demos." },
  { id: "evt-005", title: "Campus Startup Summit", category: "tech", date: "2025-04-25", time: "9:00 AM", venue: "BBAU Auditorium", location: "Lucknow University Road", distance: "5.8 km", price: 0, image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80", tags: ["Startup", "Pitch", "Networking", "Free"], organizer: "BBAU E-Cell", attendees: 420, capacity: 600, isFeatured: false, description: "Free startup summit connecting student entrepreneurs with mentors and VCs." },
  { id: "evt-006", title: "Yoga & Wellness Morning", category: "community", date: "2025-04-14", time: "6:00 AM", venue: "Ambedkar Park", location: "Sector 6, Lucknow", distance: "0.8 km", price: 100, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80", tags: ["Wellness", "Yoga", "Morning", "Health"], organizer: "Lucknow Wellness Hub", attendees: 95, capacity: 150, isFeatured: false, description: "Guided 2-hour yoga and mindfulness session with a healthy breakfast social." },
  { id: "evt-007", title: "Inter-College Basketball Slam", category: "sports", date: "2025-04-22", time: "2:00 PM", venue: "KD Singh Babu Stadium", location: "Lalbagh, Lucknow", distance: "2.9 km", price: 80, image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80", tags: ["Basketball", "Sports", "College", "Competition"], organizer: "Lucknow Sports Federation", attendees: 540, capacity: 1200, isFeatured: false, description: "12 college teams in the ultimate inter-college basketball tournament." },
  { id: "evt-008", title: "Photography Walk — Old City", category: "community", date: "2025-04-19", time: "7:00 AM", venue: "Rumi Darwaza", location: "Chowk, Lucknow", distance: "3.4 km", price: 199, image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80", tags: ["Photography", "Heritage", "Walk", "Art"], organizer: "Lucknow Lens Club", attendees: 45, capacity: 60, isFeatured: false, description: "Guided 3-hour photography walk through Old Lucknow's heritage lanes." },
];