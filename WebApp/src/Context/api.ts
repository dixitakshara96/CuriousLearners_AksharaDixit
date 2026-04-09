// api.ts  —  all HTTP calls to the lokl backend
// Drop this in your src/ folder alongside AppContext.tsx

const BASE = "http://localhost:5000/api";

// ─── Token helpers ────────────────────────────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem("lokl_token");
}

export function setToken(token: string) {
  localStorage.setItem("lokl_token", token);
}

export function clearToken() {
  localStorage.removeItem("lokl_token");
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  auth = false
): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export interface AuthResponse {
  success: boolean;
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  college?: string;
  location: string;
  interests: string[];
  createdAt: string;
}

export const authApi = {
  signup: (payload: { name: string; email: string; password: string; college?: string; location?: string; interests?: string[] }) =>
    request<AuthResponse>("POST", "/auth/signup", payload),

  login: (email: string, password: string) =>
    request<AuthResponse>("POST", "/auth/login", { email, password }),

  me: () => request<{ success: boolean; user: UserProfile }>("GET", "/auth/me", undefined, true),

  updateProfile: (updates: Partial<UserProfile>) =>
    request<{ success: boolean; user: UserProfile }>("PUT", "/auth/me", updates, true),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ success: boolean; message: string }>("PUT", "/auth/change-password", { currentPassword, newPassword }, true),
};

// ─── Events API ───────────────────────────────────────────────────────────────
export interface ApiEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  distance: string;
  price: number;
  image: string;
  tags: string[];
  organizer: string;
  organizerId: string;
  attendees: number;
  capacity: number;
  description: string;
  isFeatured: boolean;
  createdAt: string;
}

export const eventsApi = {
  list: (params?: { category?: string; search?: string; priceMax?: number; sort?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string> || {}).toString();
    return request<{ success: boolean; events: ApiEvent[] }>("GET", `/events${qs ? "?" + qs : ""}`);
  },

  featured: () => request<{ success: boolean; events: ApiEvent[] }>("GET", "/events/featured"),

  get: (id: string) => request<{ success: boolean; event: ApiEvent }>("GET", `/events/${id}`),

  create: (payload: Partial<ApiEvent>) =>
    request<{ success: boolean; event: ApiEvent }>("POST", "/events", payload, true),

  update: (id: string, payload: Partial<ApiEvent>) =>
    request<{ success: boolean; event: ApiEvent }>("PUT", `/events/${id}`, payload, true),

  delete: (id: string) =>
    request<{ success: boolean }>("DELETE", `/events/${id}`, undefined, true),
};

// ─── Tickets API ──────────────────────────────────────────────────────────────
export interface ApiTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  eventId: string;
  event: ApiEvent;
  quantity: number;
  totalPrice: number;
  bookingDate: string;
  status: "upcoming" | "attended" | "cancelled";
  qrCode: string;
}

export const ticketsApi = {
  list: (status?: string) =>
    request<{ success: boolean; tickets: ApiTicket[] }>("GET", `/tickets${status ? "?status=" + status : ""}`, undefined, true),

  get: (id: string) =>
    request<{ success: boolean; ticket: ApiTicket }>("GET", `/tickets/${id}`, undefined, true),

  book: (eventId: string, quantity: number, paymentMethod?: string) =>
    request<{ success: boolean; ticket: ApiTicket }>("POST", "/tickets", { eventId, quantity, paymentMethod }, true),

  cancel: (id: string) =>
    request<{ success: boolean; ticket: ApiTicket }>("PATCH", `/tickets/${id}/cancel`, undefined, true),

  attend: (id: string) =>
    request<{ success: boolean; ticket: ApiTicket }>("PATCH", `/tickets/${id}/attend`, undefined, true),
};

// ─── Saved API ────────────────────────────────────────────────────────────────
export const savedApi = {
  list: () =>
    request<{ success: boolean; saved: { id: string; eventId: string; event: ApiEvent }[] }>("GET", "/saved", undefined, true),

  toggle: (eventId: string) =>
    request<{ success: boolean; saved: boolean }>("POST", "/saved", { eventId }, true),

  remove: (eventId: string) =>
    request<{ success: boolean }>("DELETE", `/saved/${eventId}`, undefined, true),
};