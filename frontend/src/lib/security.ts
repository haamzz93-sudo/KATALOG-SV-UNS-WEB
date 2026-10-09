/**
 * Security utilities for input sanitization, CSRF tokens, and security defense.
 */

// Simple robust XSS sanitizer for user-entered strings
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "") // Strip raw HTML tag brackets
    .trim();
}

// Cookie helpers for client-side security
export function setSecureCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}

export function getSecureCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function deleteSecureCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

// Persistent "Remember Me" / Auto-Login Helpers
export function savePersistentAuth(email: string, pass: string): void {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      email,
      pass: btoa(encodeURIComponent(pass)),
      savedAt: Date.now(),
    });
    localStorage.setItem("vokasi_saved_auth", payload);
    localStorage.setItem("vokasi_remember_me", "true");
  } catch {}
}

export function getPersistentAuth(): { email: string; pass: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("vokasi_saved_auth");
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data.email || !data.pass) return null;
    return {
      email: data.email,
      pass: decodeURIComponent(atob(data.pass)),
    };
  } catch {
    return null;
  }
}

export function clearPersistentAuth(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("vokasi_saved_auth");
    localStorage.removeItem("vokasi_remember_me");
  } catch {}
}


// Rate Limiter for Login Brute Force Defense (Client side protection)
const RATE_LIMIT_KEY = "sv_uns_login_attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

export interface RateLimitStatus {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
}

export function checkLoginRateLimit(): RateLimitStatus {
  if (typeof window === "undefined") {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }

  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };

    const data = JSON.parse(raw);
    const now = Date.now();

    if (data.lockoutUntil && data.lockoutUntil > now) {
      const remainingSeconds = Math.ceil((data.lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
    }

    // Reset if window passed (more than 10 minutes)
    if (data.firstAttempt && now - data.firstAttempt > 10 * 60 * 1000) {
      localStorage.removeItem(RATE_LIMIT_KEY);
      return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
    }

    const attempts = data.count || 0;
    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsLeft: Math.max(0, MAX_ATTEMPTS - attempts),
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }
}

export function recordFailedLoginAttempt(): RateLimitStatus {
  if (typeof window === "undefined") {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }

  try {
    const now = Date.now();
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const data = raw ? JSON.parse(raw) : { count: 0, firstAttempt: now };

    data.count = (data.count || 0) + 1;

    if (data.count >= MAX_ATTEMPTS) {
      data.lockoutUntil = now + LOCKOUT_DURATION_MS;
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
      return { isLocked: true, remainingSeconds: 60, attemptsLeft: 0 };
    }

    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsLeft: MAX_ATTEMPTS - data.count,
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: 0 };
  }
}

export function resetLoginAttempts(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(RATE_LIMIT_KEY);
  }
}
