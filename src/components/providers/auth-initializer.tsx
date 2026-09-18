"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

/**
 * Headless client component that triggers the initial auth session verification
 * via Zustand once on browser mount. Does not render any DOM elements or hold React Context.
 */
export function AuthInitializer() {
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return null;
}
