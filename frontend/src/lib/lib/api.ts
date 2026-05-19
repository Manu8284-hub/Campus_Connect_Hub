export type Club = {
  id: string;
  name: string;
  category: 'technical' | 'arts' | 'sports' | 'social';
  members: number;
  description: string;
  image: string;
  logo?: string;
  color: string;
  tagline: string;
  founded?: number;
  awards?: number;
  memberCount?: number;
  head?: { id: string; name?: string; email?: string } | null;
  joinRequests?: Array<{ id: string; name?: string; email?: string; avatar?: string }> | number;
};

export type EventItem = {
  id: string;
  title: string;
  club: string;
  clubId?: string;
  date: string;
  rawDate?: string;
  time: string;
  venue: string;
  category: string;
  capacity: number;
  registered: number;
  image: string;
  description: string;
  isPast?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'clubHead' | 'admin';
  department?: string;
  year?: number;
};

export type DashboardStats = {
  role: 'student' | 'clubHead' | 'admin';
  joinedClubs?: number;
  registrations?: number;
  clubs?: Array<{ id: string; name: string; category: string; image: string }>;
  events?: Array<{ id: string; title: string; date: string; time: string; venue: string; club: string; status: string }>;
  notifications?: Array<{ id: string; title: string; message: string; type: string; read: boolean; createdAt: string }>;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('CampusHub_token');
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...options?.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options,
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.message ?? 'API request failed');
  return body as T;
}

export const api = {
  auth: {
    login: (credentials: any) => request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (userData: any) => request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    me: () => request<{ user: User }>('/auth/me'),
  },
  clubs: () => request<Club[]>('/clubs'),
  club: (id: string) => request<Club>(`/clubs/${id}`),
  events: (clubId?: string) => request<EventItem[]>(clubId ? `/events?club=${clubId}` : '/events'),
  event: (id: string) => request<EventItem>(`/events/${id}`),
  joinClub: (id: string) => request<{ message: string }>(`/clubs/${id}/join`, { method: 'POST' }),
  registerEvent: (id: string) => request<{ id: string; status: string }>(`/events/${id}/register`, { method: 'POST' }),
  cancelEventRegistration: (id: string) => request<{ message: string }>(`/events/${id}/register`, { method: 'DELETE' }),
  dashboardStats: () => request<DashboardStats>('/dashboard/stats'),
  createClub: (club: Partial<Club>) => request<Club>('/clubs', {
    method: 'POST',
    body: JSON.stringify({ ...club, logo: club.image }),
  }),
  createEvent: (event: any) => request<EventItem>('/events', {
    method: 'POST',
    body: JSON.stringify(event),
  }),
};
