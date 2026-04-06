/**
 * Lightweight cookie helper for client-side state recovery.
 * Used for non-sensitive UI state persistence (like timers).
 */
export const cookies = {
  get(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
    return null;
  },

  remove(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
  },
};
