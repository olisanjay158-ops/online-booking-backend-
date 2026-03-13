"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("newuser@test.com");
  const [password, setPassword] = useState("StrongPass@123");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!base) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
      }

      const res = await fetch(`${base}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (typeof data?.detail === "string") {
          setMessage(data.detail);
        } else if (data?.detail) {
          setMessage(JSON.stringify(data.detail));
        } else {
          setMessage(JSON.stringify(data));
        }
        return;
      }

      setMessage("✅ Account created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 800);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`❌ ${err.message}`);
      } else {
        setMessage("❌ Network error. Could not connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-sky-500 to-emerald-500 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur">
        <h1 className="text-3xl font-extrabold text-center">Create Account</h1>
        <p className="mt-2 text-center text-white/80">
          Create your account to start booking.
        </p>

        {message && (
          <div className="mt-5 rounded-2xl border border-white/20 bg-black/20 p-4 text-sm break-words">
            {message}
          </div>
        )}

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/80">Full Name</label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white/40"
              placeholder="e.g. Sanjay Oli"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Phone</label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white/40"
              placeholder="e.g. 04xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white/40"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Password (min 8 chars)</label>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <div className="text-center text-sm text-white/80">
            Already have an account?{" "}
            <a className="underline hover:text-white" href="/login">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}