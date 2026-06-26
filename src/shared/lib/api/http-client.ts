import { env } from "@/shared/lib/env";
import type { ApiEnvelope } from "@/shared/types/api";

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

type RequestOptions = RequestInit & {
  token?: string | null;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? ((await response.json()) as ApiEnvelope<T> | T) : null;

  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String(body.message)
        : `Request failed with status ${response.status}`;

    throw new HttpError(message, response.status, body);
  }

  if (body && typeof body === "object" && "data" in body) {
    return (body as ApiEnvelope<T>).data as T;
  }

  return body as T;
}

export async function apiClient<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  return parseResponse<T>(response);
}
