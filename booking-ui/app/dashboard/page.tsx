"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, clearToken, getToken } from "../../src/lib/api";

type Booking = {
  id: number;
  service_name: string;
  booking_time: string;
  notes?: string | null;
  contact_email?: string | null;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function DashboardPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [contactEmail, setContactEmail] = useState("");

  const [serviceName, setServiceName] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);

  const [query, setQuery] = useState("");

  const filteredBookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) =>
      `${b.service_name} ${b.notes ?? ""} ${b.contact_email ?? ""} ${b.id}`
        .toLowerCase()
        .includes(q)
    );
  }, [bookings, query]);

  async function loadBookings() {
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch("/bookings/me");
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  // OPTIONAL: auto-fill email from logged-in user
  async function loadMeAndAutofillEmail() {
    try {
      const me = await apiFetch("/auth/me");
      if (me?.email && typeof me.email === "string") {
        setContactEmail(me.email);
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    loadBookings();
    loadMeAndAutofillEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createBooking(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!serviceName.trim()) return setError("Service name is required.");
    if (!bookingTime) return setError("Booking time is required.");
    if (!contactEmail.trim()) return setError("Contact email is required.");
    if (!isValidEmail(contactEmail)) return setError("Please enter a valid email address.");

    setCreating(true);
    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          service_name: serviceName.trim(),
          booking_time: bookingTime,
          notes: notes.trim() ? notes.trim() : null,
          contact_email: contactEmail.trim(),
        }),
      });

      setServiceName("");
      setBookingTime("");
      setNotes("");
      // keep contactEmail filled (nice UX)

      await loadBookings();
    } catch (err: any) {
      setError(err?.message ?? "Failed to create booking");
    } finally {
      setCreating(false);
    }
  }

  async function deleteBooking(id: number) {
    const ok = window.confirm("Delete this booking? This cannot be undone.");
    if (!ok) return;

    setError(null);
    try {
      await apiFetch(`/bookings/${id}`, { method: "DELETE" });
      await loadBookings();
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete booking");
    }
  }

  function logout() {
    clearToken();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      {/* top bar */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Booking Dashboard</h1>
            <p className="text-sm text-white/70">Create, view, and manage bookings.</p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200/20 bg-rose-500/15 px-4 py-3 text-sm text-white">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Create */}
          <section className="lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
              <h2 className="text-lg font-semibold">Create Booking</h2>
              <p className="mt-1 text-sm text-white/70">Fill in details and submit.</p>

              <form onSubmit={createBooking} className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90">Service Name</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-sky-400/40"
                    placeholder="e.g. Consultation"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90">Contact Email</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-sky-400/40"
                    placeholder="e.g. customer@gmail.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    type="email"
                    required
                  />
                  <p className="mt-1 text-xs text-white/60">
                    We’ll send the booking confirmation to this email.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90">Booking Time</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-400/40"
                    type="datetime-local"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    required
                  />
                  <p className="mt-1 text-xs text-white/60">Local time (Sydney).</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90">Notes (optional)</label>
                  <textarea
                    className="mt-1 w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-sky-400/40"
                    placeholder="Any extra notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <button
                  disabled={creating}
                  className="w-full rounded-2xl bg-gradient-to-r from-sky-400 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:opacity-95 disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Booking"}
                </button>
              </form>
            </div>
          </section>

          {/* List */}
          <section className="lg:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">My Bookings</h2>
                  <p className="mt-1 text-sm text-white/70">
                    Showing {filteredBookings.length} booking(s)
                  </p>
                </div>

                <input
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-sky-400/40 sm:w-64"
                  placeholder="Search (service, notes, email, id)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="mt-5">
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-20 animate-pulse rounded-2xl bg-white/10" />
                    <div className="h-20 animate-pulse rounded-2xl bg-white/10" />
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-8 text-center">
                    <p className="text-sm font-semibold">No bookings found</p>
                    <p className="mt-1 text-sm text-white/70">Create one using the form.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBookings.map((b) => (
                      <div
                        key={b.id}
                        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div>
                          <div className="text-base font-semibold">{b.service_name}</div>
                          <div className="mt-1 text-sm text-white/80">
                            <span className="font-medium text-white/90">Time:</span>{" "}
                            {formatTime(b.booking_time)}
                          </div>

                          {b.contact_email && (
                            <div className="mt-1 text-sm text-white/80">
                              <span className="font-medium text-white/90">Email:</span>{" "}
                              {b.contact_email}
                            </div>
                          )}

                          {b.notes && (
                            <div className="mt-1 text-sm text-white/80">
                              <span className="font-medium text-white/90">Notes:</span> {b.notes}
                            </div>
                          )}

                          <div className="mt-2 text-xs text-white/60">ID: {b.id}</div>
                        </div>

                        <button
                          onClick={() => deleteBooking(b.id)}
                          className="rounded-xl bg-rose-500/20 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500/30"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-10 text-center text-xs text-white/60">
          Backend: FastAPI + PostgreSQL • Auth: JWT • UI: Next.js
        </footer>
      </main>
    </div>
  );
}