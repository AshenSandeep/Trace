import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USERS } from '../api/issues';
import { User } from '../types';

const AUTH_KEY = '@trace:auth';

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      if (!email.includes('@')) throw new Error('Please enter a valid email address.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');

      await new Promise<void>(resolve => setTimeout(resolve, 800));

      const user = MOCK_USERS[3]; // Alex — the logged-in user
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
      set({ isAuthenticated: true, user, isLoading: false, error: null });
    } catch (e: any) {
      set({ isLoading: false, error: e.message ?? 'Login failed.' });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    set({ isAuthenticated: false, user: null, error: null });
  },

  restoreSession: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_KEY);
      if (raw) {
        const user: User = JSON.parse(raw);
        set({ isAuthenticated: true, user });
      }
    } catch {
      // No session to restore
    }
  },
}));
