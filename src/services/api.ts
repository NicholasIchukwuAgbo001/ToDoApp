const BASE_URL = "https://olakzride.duckdns.org/api";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  let body: any = null;
  try {
    body = await response.json();
  } catch {
    // non-JSON response
  }

  if (!response.ok) {
    const message =
      body?.message ?? body?.error ?? `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }

  return body as T;
}

export const api = {
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
};
