import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchIssues as apiFetchIssues,
  createIssue as apiCreateIssue,
  updateIssue as apiUpdateIssue,
} from '../api/issues';
import { Issue, IssueFilters, SyncQueueItem } from '../types';
import { generateIssueId } from '../utils/idUtils';

const ISSUES_KEY = '@trace:issues';
const SYNC_KEY = '@trace:syncQueue';

const DEFAULT_FILTERS: IssueFilters = {
  search: '',
  status: [],
  priority: [],
  assignee: [],
};

interface IssueStore {
  issues: Issue[];
  filteredIssues: Issue[];
  filters: IssueFilters;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  syncQueue: SyncQueueItem[];
  isOnline: boolean;

  fetchIssues: () => Promise<void>;
  refreshIssues: () => Promise<void>;
  createIssue: (data: Partial<Issue>) => Promise<void>;
  updateIssue: (id: string, data: Partial<Issue>) => Promise<void>;
  resolveIssue: (id: string) => Promise<void>;
  closeIssue: (id: string) => Promise<void>;
  setFilters: (filters: Partial<IssueFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  setOnlineStatus: (online: boolean) => void;
  processSyncQueue: () => Promise<void>;
  persistIssues: () => Promise<void>;
  loadPersistedIssues: () => Promise<void>;
}

const applyFiltersToIssues = (issues: Issue[], filters: IssueFilters): Issue[] => {
  return issues.filter(issue => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!issue.title.toLowerCase().includes(q) && !issue.id.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filters.status.length > 0 && !filters.status.includes(issue.status)) return false;
    if (filters.priority.length > 0 && !filters.priority.includes(issue.priority)) return false;
    if (filters.assignee.length > 0) {
      if (!issue.assignee || !filters.assignee.includes(issue.assignee.id)) return false;
    }
    return true;
  });
};

export const useIssueStore = create<IssueStore>((set, get) => ({
  issues: [],
  filteredIssues: [],
  filters: DEFAULT_FILTERS,
  isLoading: false,
  isRefreshing: false,
  error: null,
  syncQueue: [],
  isOnline: true,

  fetchIssues: async () => {
    set({ isLoading: true, error: null });
    try {
      const issues = await apiFetchIssues();
      set(state => ({
        issues,
        filteredIssues: applyFiltersToIssues(issues, state.filters),
        isLoading: false,
      }));
      await get().persistIssues();
    } catch {
      set({ isLoading: false, error: 'Failed to fetch issues.' });
      await get().loadPersistedIssues();
    }
  },

  refreshIssues: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const issues = await apiFetchIssues();
      set(state => ({
        issues,
        filteredIssues: applyFiltersToIssues(issues, state.filters),
        isRefreshing: false,
      }));
      await get().persistIssues();
    } catch {
      set({ isRefreshing: false, error: 'Failed to refresh issues.' });
    }
  },

  createIssue: async (data) => {
    const { isOnline, filters } = get();
    const now = new Date().toISOString();

    if (!isOnline) {
      const id = generateIssueId();
      const optimistic: Issue = {
        id,
        title: data.title ?? '',
        description: data.description ?? '',
        status: data.status ?? 'Open',
        priority: data.priority ?? 'Medium',
        assignee: data.assignee ?? null,
        reporter: data.reporter!,
        createdAt: now,
        updatedAt: now,
        attachments: [],
        activity: [],
      };
      const queueItem: SyncQueueItem = { id, type: 'create', payload: optimistic, createdAt: now };
      set(state => {
        const issues = [optimistic, ...state.issues];
        return {
          issues,
          filteredIssues: applyFiltersToIssues(issues, filters),
          syncQueue: [...state.syncQueue, queueItem],
        };
      });
      await get().persistIssues();
      await AsyncStorage.setItem(SYNC_KEY, JSON.stringify(get().syncQueue));
      return;
    }

    const created = await apiCreateIssue(data);
    set(state => {
      const issues = [created, ...state.issues];
      return { issues, filteredIssues: applyFiltersToIssues(issues, state.filters) };
    });
    await get().persistIssues();
  },

  updateIssue: async (id, data) => {
    const { isOnline, filters } = get();
    const now = new Date().toISOString();

    // Optimistic local update
    set(state => {
      const issues = state.issues.map(i => i.id === id ? { ...i, ...data, updatedAt: now } : i);
      return { issues, filteredIssues: applyFiltersToIssues(issues, filters) };
    });

    if (!isOnline) {
      const queueItem: SyncQueueItem = { id, type: 'update', payload: data, createdAt: now };
      set(state => ({ syncQueue: [...state.syncQueue, queueItem] }));
      await get().persistIssues();
      await AsyncStorage.setItem(SYNC_KEY, JSON.stringify(get().syncQueue));
      return;
    }

    try {
      const updated = await apiUpdateIssue(id, data);
      set(state => {
        const issues = state.issues.map(i => i.id === id ? updated : i);
        return { issues, filteredIssues: applyFiltersToIssues(issues, state.filters) };
      });
      await get().persistIssues();
    } catch {
      // Keep optimistic update, will retry on next sync
    }
  },

  resolveIssue: async (id) => {
    await get().updateIssue(id, { status: 'Resolved' });
  },

  closeIssue: async (id) => {
    await get().updateIssue(id, { status: 'Closed' });
  },

  setFilters: (filters) => {
    set(state => {
      const merged = { ...state.filters, ...filters };
      return {
        filters: merged,
        filteredIssues: applyFiltersToIssues(state.issues, merged),
      };
    });
  },

  clearFilters: () => {
    set(state => ({
      filters: DEFAULT_FILTERS,
      filteredIssues: applyFiltersToIssues(state.issues, DEFAULT_FILTERS),
    }));
  },

  applyFilters: () => {
    set(state => ({
      filteredIssues: applyFiltersToIssues(state.issues, state.filters),
    }));
  },

  setOnlineStatus: (online) => {
    set({ isOnline: online });
    if (online) get().processSyncQueue();
  },

  processSyncQueue: async () => {
    const { isOnline, syncQueue } = get();
    if (!isOnline || syncQueue.length === 0) return;

    const remaining: SyncQueueItem[] = [];
    for (const item of syncQueue) {
      try {
        if (item.type === 'create') {
          await apiCreateIssue(item.payload);
        } else {
          await apiUpdateIssue(item.id, item.payload);
        }
      } catch {
        remaining.push(item);
      }
    }
    set({ syncQueue: remaining });
    await AsyncStorage.setItem(SYNC_KEY, JSON.stringify(remaining));
  },

  persistIssues: async () => {
    try {
      await AsyncStorage.setItem(ISSUES_KEY, JSON.stringify(get().issues));
    } catch {}
  },

  loadPersistedIssues: async () => {
    try {
      const raw = await AsyncStorage.getItem(ISSUES_KEY);
      if (raw) {
        const issues: Issue[] = JSON.parse(raw);
        set(state => ({
          issues,
          filteredIssues: applyFiltersToIssues(issues, state.filters),
        }));
      }
      const syncRaw = await AsyncStorage.getItem(SYNC_KEY);
      if (syncRaw) {
        set({ syncQueue: JSON.parse(syncRaw) });
      }
    } catch {}
  },
}));
