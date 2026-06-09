const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  errors?: string[];
}

export class HttpError extends Error {
  readonly status: number;
  readonly errors?: string[];

  constructor(status: number, message: string, errors?: string[]) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const body: ApiError = await res.json().catch(() => ({
      status: res.status,
      message: res.statusText,
      timestamp: new Date().toISOString(),
    }));
    throw new HttpError(body.status, body.message, body.errors);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string) => request<T>(path, { method: "PATCH" }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
