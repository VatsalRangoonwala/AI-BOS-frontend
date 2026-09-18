import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
  });

  it("initializes with default empty unauthenticated state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.memberships).toEqual([]);
    expect(state.activeBusinessId).toBeNull();
    expect(state.activeBusiness).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("sets user and updates isAuthenticated flag", () => {
    const mockUser = {
      id: "usr_100",
      email: "retailer@example.com",
      fullName: "Anand Retail",
      status: "active" as const,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user?.fullName).toBe("Anand Retail");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("manages memberships and active business resolution", () => {
    const mockMemberships = [
      {
        businessId: "biz_1",
        businessName: "Mumbai Flagship Store",
        role: "owner" as const,
        status: "active" as const,
      },
      {
        businessId: "biz_2",
        businessName: "Pune Outlet",
        role: "admin" as const,
        status: "active" as const,
      },
    ];

    useAuthStore.getState().setMemberships(mockMemberships);
    useAuthStore.getState().setActiveBusinessId("biz_1");

    let state = useAuthStore.getState();
    expect(state.activeBusiness?.businessName).toBe("Mumbai Flagship Store");

    useAuthStore.getState().switchBusiness("biz_2");
    state = useAuthStore.getState();
    expect(state.activeBusinessId).toBe("biz_2");
    expect(state.activeBusiness?.businessName).toBe("Pune Outlet");
  });

  it("resets store state cleanly", () => {
    useAuthStore.getState().setUser({
      id: "usr_1",
      email: "user@test.com",
      fullName: "Test",
      status: "active",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    });
    useAuthStore.getState().setActiveBusinessId("biz_1");

    useAuthStore.getState().reset();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.activeBusinessId).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
