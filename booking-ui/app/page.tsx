import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-sky-500 to-emerald-500 text-white">
      <div className="min-h-screen bg-black/20">
        
        {/* Navbar */}
        <header className="border-b border-white/20 bg-white/10 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
            <h1 className="text-2xl font-bold">GenZ Home page</h1>

            <nav className="flex gap-3">
              <Link
                href="/about"
                className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
              >
                About
              </Link>

              <Link
                href="/services"
                className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
              >
                Services
              </Link>

              <Link
                href="/login"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-black/30 px-4 py-2 text-sm font-semibold"
              >
                Create Account
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-10 md:grid-cols-2">

            {/* Left Side */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur">
              <h2 className="text-4xl font-bold leading-tight">
                Book your service in seconds
              </h2>

              <p className="mt-4 text-white/80">
                Simple online booking system built with FastAPI, PostgreSQL,
                and Next.js.
              </p>

              <div className="mt-8 flex gap-4">
                <Link
                  href="/signup"
                  className="rounded-2xl bg-white px-6 py-3 font-bold text-black"
                >
                  Get Started
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-2xl bg-white/10 px-6 py-3"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur">
              <h3 className="text-xl font-semibold">Features</h3>

              <ul className="mt-4 space-y-2 text-white/85">
                <li>✅ Secure login system (JWT)</li>
                <li>✅ Create bookings</li>
                <li>✅ View your bookings</li>
                <li>✅ Delete bookings</li>
                <li>✅ PostgreSQL database storage</li>
              </ul>

              <div className="mt-6 rounded-xl bg-black/30 p-4 text-sm">
                <div className="font-semibold">Demo Login</div>
                <div>Email: test2@example.com</div>
                <div>Password: StrongPass@123</div>
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-white/70">
          FastAPI • PostgreSQL • JWT • Next.js
        </footer>

      </div>
    </div>
  );
}