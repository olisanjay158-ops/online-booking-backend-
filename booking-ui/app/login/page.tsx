"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "../../src/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("test2@example.com");
  const [password, setPassword] = useState("StrongPass@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!base) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
      }

      const form = new URLSearchParams();
      form.append("username", email.trim());
      form.append("password", password);

      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
      });

      if (!res.ok) {
        let message = `${res.status} ${res.statusText}`;

        try {
          const errorData = await res.json();

          if (typeof errorData?.detail === "string") {
            message = `${res.status}: ${errorData.detail}`;
          } else if (errorData?.detail) {
            message = `${res.status}: ${JSON.stringify(errorData.detail)}`;
          } else {
            message = `${res.status}: ${JSON.stringify(errorData)}`;
          }
        } catch {
          const text = await res.text();
          if (text) {
            message = `${res.status}: ${text}`;
          }
        }

        throw new Error(message);
      }

      const data = await res.json();

      if (!data?.access_token) {
        throw new Error("No access token returned from server");
      }

      setToken(data.access_token);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-sky-500 to-emerald-500">
      <div className="min-h-screen bg-black/20">
        <header className="border-b border-white/20 bg-white/10 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 py-4 text-white">
            <h1 className="text-xl font-bold tracking-tight">
              Online Booking System
            </h1>
            <p className="text-sm text-white/80">
              Secure login to manage your bookings.
            </p>
          </div>
        </header>

        <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-14">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-white/20 bg-white/15 p-6 shadow-xl backdrop-blur">
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="mt-1 text-sm text-white/80">
                Login with your account to continue.
              </p>

              {error && (
                <div className="mt-4 rounded-2xl border border-red-200/30 bg-red-500/20 px-4 py-3 text-sm text-white">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90">
                    Email
                  </label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white/40"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90">
                    Password
                  </label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white/40"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-xs text-white/90">
                  <div className="font-semibold">Demo account</div>
                  <div className="mt-1">
                    Email:{" "}
                    <span className="font-mono text-white">
                      test2@example.com
                    </span>
                  </div>
                  <div>
                    Password:{" "}
                    <span className="font-mono text-white">
                      StrongPass@123
                    </span>
                  </div>
                </div>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-white/80">
              Backend: FastAPI + PostgreSQL • Auth: JWT • UI: Next.js
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}