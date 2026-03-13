import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Link href="/" className="text-sm text-white/70 hover:text-white">
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-3xl font-bold">About Us</h1>

        <p className="mt-4 text-white/80 leading-relaxed">
          This Online Booking System is a full-stack web application built using
          FastAPI (backend), PostgreSQL (database), and Next.js (frontend).  
          Users can securely login, create bookings, view their bookings, and manage them.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-semibold">Tech Stack</h2>
          <ul className="mt-3 space-y-2 text-white/80">
            <li>✅ Backend: FastAPI</li>
            <li>✅ Database: PostgreSQL + SQLAlchemy + Alembic</li>
            <li>✅ Auth: JWT</li>
            <li>✅ Frontend: Next.js</li>
          </ul>
        </div>
      </div>
    </div>
  );
}