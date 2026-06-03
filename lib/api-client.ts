export type ApiResult<T> = {
  code?: number;
  msg?: string;
  message?: string;
  data?: T;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isAuthStatus(status: number) {
  return status === 401 || status === 403;
}

function resolveToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

function resolveHeaders(initHeaders?: HeadersInit, body?: BodyInit | null) {
  const token = resolveToken();
  const headers = new Headers(initHeaders);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", token);
  }

  return headers;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: resolveHeaders(init.headers, init.body)
  });

  if (!response.ok) {
    throw new ApiError(`请求失败：${response.status}`, response.status);
  }

  const result = (await response.json()) as ApiResult<T> | T;

  if (result && typeof result === "object" && "code" in result) {
    const apiResult = result as ApiResult<T>;
    if (typeof apiResult.code === "number" && apiResult.code !== 200 && apiResult.code !== 0) {
      throw new ApiError(apiResult.msg ?? apiResult.message ?? "请求失败", response.status);
    }

    return apiResult.data as T;
  }

  return result as T;
}
