/**
 * Thin HTTP client for the FastAPI backend with MongoDB session authentication.
 */
const BASE_URL = import.meta.env["VITE_API_BASE_URL"] || "http://localhost:8000/api/v1";

export const isBackendConfigured = true;

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getSessionToken() {
  try {
    return localStorage.getItem("futureready_session_token") || null;
  } catch {
    return null;
  }
}

export function setSessionToken(token) {
  try {
    if (token) {
      localStorage.setItem("futureready_session_token", token);
    } else {
      localStorage.removeItem("futureready_session_token");
    }
  } catch {
    // ignore
  }
}

export async function apiRequest(path, options = {}) {
  const { json, headers, body, ...rest } = options;
  const token = getSessionToken();

  const isFormData = body instanceof FormData;

  const requestHeaders = {
    ...(token ? { "X-Session-Token": token } : {}),
    ...(headers ?? {}),
  };

  if (!isFormData && json !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: requestHeaders,
    body: isFormData ? body : json !== undefined ? JSON.stringify(json) : (body ?? null),
  });

  if (response.status === 401) {
    setSessionToken(null);
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }
  if (!response.ok) {
    let errorDetail = `Request failed (${response.status}).`;
    try {
      const errData = await response.json();
      if (errData?.detail) {
        errorDetail =
          typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail);
      }
    } catch {
      // ignore
    }
    throw new ApiError(response.status, errorDetail);
  }
  if (response.status === 204) return undefined;
  return await response.json();
}
