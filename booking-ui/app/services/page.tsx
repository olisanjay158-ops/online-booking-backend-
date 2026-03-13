import Link from "next/link";

const SERVICES = [
  { title: "Consultation", desc: "General consultation and advice." },
  { title: "Follow-up", desc: "Review progress and next steps." },
  { title: "Premium Session", desc: "Extended session with extra support." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Link href="/" className="text-sm text-white/70 hover:text-white">
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-3xl font-bold">Services</h1>
        <p className="mt-2 text-white/75">
          Choose a service and book your preferred time from the dashboard after login.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
            >
              <div className="text-lg font-semibold">{s.title}</div>
              <div className="mt-2 text-sm text-white/70">{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:opacity-95"
          >
            Login to Book
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/15"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}