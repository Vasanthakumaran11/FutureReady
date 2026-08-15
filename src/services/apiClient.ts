/**
 * Thin HTTP client for the future FastAPI backend.
 *
 * Configure the backend origin with VITE_API_BASE_URL. No API keys (Gemini,
 * job providers, database credentials) are ever read or stored on the client —
 * every external call must be proxied by FastAPI.
 */
const BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "";

export const isBackendConfigured = Boolean(BASE_URL);

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Options = RequestInit & { json?: unknown };

export async function apiRequest<T>(path: string, options: Options = {}): Promise<T> {
  const { json, headers, ...rest } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    // Session cookies are set by FastAPI (httpOnly); nothing sensitive is
    // kept in localStorage.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : (rest.body ?? null),
  });

  if (response.status === 401) {
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Request failed (${response.status}).`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/** Simulated latency for mock responses so loading states are exercised. */
export function mockDelay<T>(value: T, ms = 550): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
