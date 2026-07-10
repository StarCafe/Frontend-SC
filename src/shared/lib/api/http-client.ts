import { env } from "@/shared/lib/env";
import type { ApiEnvelope, ApiFailure } from "@/shared/types/api";

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
  query?: Record<string, string | number | boolean | null | undefined>;
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

  if (body && typeof body === "object" && "success" in body && body.success === false) {
    const failure = body as ApiFailure;
    throw new HttpError(failure.message, response.status, body);
  }

  if (body && typeof body === "object" && "data" in body) {
    return (body as ApiEnvelope<T>).data as T;
  }

  return body as T;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(path, env.apiBaseUrl);

  if (!query) {
    return url.toString();
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export async function apiClient<T>(path: string, options: RequestOptions = {}) {
  const { query, token, ...requestInit } = options;
  const headers = new Headers(requestInit.headers);

  headers.set("Accept", "application/json");

  if (requestInit.body && !(requestInit.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, query), {
    ...requestInit,
    headers,
    cache: "no-store",
  });

  return parseResponse<T>(response);
}
