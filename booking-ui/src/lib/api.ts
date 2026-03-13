const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
}

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  if (!BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }

  const { auth = true, ...fetchOptions } = options;
  const token = getToken();

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  const isFormData =
    fetchOptions.body instanceof FormData ||
    fetchOptions.body instanceof URLSearchParams;

  if (fetchOptions.body && !headers["Content-Type"] && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (auth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;

    try {
      const errorData = await response.json();

      if (typeof errorData?.detail === "string") {
        message = `${response.status}: ${errorData.detail}`;
      } else if (errorData?.detail) {
        message = `${response.status}: ${JSON.stringify(errorData.detail)}`;
      } else if (errorData?.errors) {
        message = `${response.status}: ${JSON.stringify(errorData.errors)}`;
      } else {
        message = `${response.status}: ${JSON.stringify(errorData)}`;
      }
    } catch {
      const text = await response.text();
      if (text) {
        message = `${response.status}: ${text}`;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function signup(data: {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}) {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
    auth: false,
  });
}

export async function login(email: string, password: string) {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const result = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
    auth: false,
  });

  if (result?.access_token) {
    setToken(result.access_token);
  }

  return result;
}

export async function getMyBookings() {
  return apiFetch("/bookings/me", {
    method: "GET",
  });
}

export async function getAllBookings() {
  return apiFetch("/bookings", {
    method: "GET",
  });
}

export async function createBooking(data: {
  service_name: string;
  booking_time: string;
  notes?: string;
  contact_email?: string;
}) {
  return apiFetch("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBooking(
  id: number,
  data: Partial<{
    service_name: string;
    booking_time: string;
    notes: string;
    contact_email: string;
  }>
) {
  return apiFetch(`/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteBooking(id: number) {
  return apiFetch(`/bookings/${id}`, {
    method: "DELETE",
  });
}

export async function healthCheck() {
  return apiFetch("/healthz", {
    method: "GET",
    auth: false,
  });
}