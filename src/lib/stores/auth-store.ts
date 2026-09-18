import { create } from "zustand";
import {
  apiClient,
  ApiError,
  type BackendUser,
  type UserBusinessMembership,
  getStoredActiveBusinessId,
  setStoredActiveBusinessId,
  clearStoredActiveBusinessId,
} from "@/lib/api-client";

export interface AuthState {
  user: BackendUser | null;
  memberships: UserBusinessMembership[];
  activeBusinessId: string | null;
  activeBusiness: UserBusinessMembership | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;

  // Actions
  initialize: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    mobile?: string;
    businessName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  switchBusiness: (businessId: string) => void;
  refreshProfile: () => Promise<void>;
  setUser: (user: BackendUser | null) => void;
  setMemberships: (memberships: UserBusinessMembership[]) => void;
  setActiveBusinessId: (businessId: string | null) => void;
  reset: () => void;
}

function resolveActiveBusiness(
  memberships: UserBusinessMembership[],
  activeBusinessId: string | null
): UserBusinessMembership | null {
  if (!activeBusinessId || !memberships) return null;
  return memberships.find((m) => m.businessId === activeBusinessId) || null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  memberships: [],
  activeBusinessId: getStoredActiveBusinessId(),
  activeBusiness: null,
  isLoading: true,
  isInitialized: false,
  isAuthenticated: false,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const me = await apiClient.auth.getMe();
      const storedBizId = getStoredActiveBusinessId();
      const validStoredBiz = me.memberships?.find((m) => m.businessId === storedBizId);

      let targetBizId: string | null = null;
      if (validStoredBiz) {
        targetBizId = validStoredBiz.businessId;
      } else if (me.memberships && me.memberships.length > 0) {
        targetBizId = me.memberships[0].businessId;
        setStoredActiveBusinessId(targetBizId);
      } else {
        clearStoredActiveBusinessId();
      }

      set({
        user: me.user,
        memberships: me.memberships || [],
        activeBusinessId: targetBizId,
        activeBusiness: resolveActiveBusiness(me.memberships || [], targetBizId),
        isAuthenticated: Boolean(me.user),
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearStoredActiveBusinessId();
        set({
          user: null,
          memberships: [],
          activeBusinessId: null,
          activeBusiness: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      } else {
        set({
          isLoading: false,
          isInitialized: true,
        });
      }
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      await apiClient.auth.login(credentials);
      const me = await apiClient.auth.getMe();
      const storedBizId = getStoredActiveBusinessId();
      const validStoredBiz = me.memberships?.find((m) => m.businessId === storedBizId);

      let targetBizId: string | null = null;
      if (validStoredBiz) {
        targetBizId = validStoredBiz.businessId;
      } else if (me.memberships && me.memberships.length > 0) {
        targetBizId = me.memberships[0].businessId;
        setStoredActiveBusinessId(targetBizId);
      }

      set({
        user: me.user,
        memberships: me.memberships || [],
        activeBusinessId: targetBizId,
        activeBusiness: resolveActiveBusiness(me.memberships || [], targetBizId),
        isAuthenticated: Boolean(me.user),
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      await apiClient.auth.register(data);
      const me = await apiClient.auth.getMe();
      const firstBiz = me.memberships?.[0]?.businessId || null;
      if (firstBiz) setStoredActiveBusinessId(firstBiz);

      set({
        user: me.user,
        memberships: me.memberships || [],
        activeBusinessId: firstBiz,
        activeBusiness: resolveActiveBusiness(me.memberships || [], firstBiz),
        isAuthenticated: Boolean(me.user),
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiClient.auth.logout();
    } finally {
      clearStoredActiveBusinessId();
      set({
        user: null,
        memberships: [],
        activeBusinessId: null,
        activeBusiness: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  switchBusiness: (businessId: string) => {
    const { memberships } = get();
    const found = memberships.find((m) => m.businessId === businessId);
    if (found) {
      setStoredActiveBusinessId(businessId);
      set({
        activeBusinessId: businessId,
        activeBusiness: found,
      });
    }
  },

  refreshProfile: async () => {
    try {
      const me = await apiClient.auth.getMe();
      const currentActiveId = get().activeBusinessId || getStoredActiveBusinessId();
      const validStoredBiz = me.memberships?.find((m) => m.businessId === currentActiveId);
      const targetBizId = validStoredBiz
        ? validStoredBiz.businessId
        : me.memberships?.[0]?.businessId || null;

      set({
        user: me.user,
        memberships: me.memberships || [],
        activeBusinessId: targetBizId,
        activeBusiness: resolveActiveBusiness(me.memberships || [], targetBizId),
        isAuthenticated: Boolean(me.user),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearStoredActiveBusinessId();
        set({
          user: null,
          memberships: [],
          activeBusinessId: null,
          activeBusiness: null,
          isAuthenticated: false,
        });
      }
    }
  },

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),

  setMemberships: (memberships) =>
    set((state) => ({
      memberships,
      activeBusiness: resolveActiveBusiness(memberships, state.activeBusinessId),
    })),

  setActiveBusinessId: (activeBusinessId) => {
    if (activeBusinessId) {
      setStoredActiveBusinessId(activeBusinessId);
    } else {
      clearStoredActiveBusinessId();
    }
    set((state) => ({
      activeBusinessId,
      activeBusiness: resolveActiveBusiness(state.memberships, activeBusinessId),
    }));
  },

  reset: () => {
    clearStoredActiveBusinessId();
    set({
      user: null,
      memberships: [],
      activeBusinessId: null,
      activeBusiness: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
    });
  },
}));

// Granular selector hooks
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useActiveBusiness = () => useAuthStore((state) => state.activeBusiness);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useMemberships = () => useAuthStore((state) => state.memberships);
