import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface ConsoleStore {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<ConsoleStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isAuthenticated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
