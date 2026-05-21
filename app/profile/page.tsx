import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <main className="container section">
      <Link href="/">← Back to home</Link>
      <div className="card" style={{ marginTop: 24 }}>
        <h1 style={{ fontSize: 32 }}>Your profile</h1>
        {session ? (
          <p style={{ color: "var(--muted)", marginTop: 8 }}>
            Signed in as <em>{session.user?.email ?? "Unknown user"}</em>.
          </p>
        ) : (
          <p style={{ color: "var(--muted)", marginTop: 8 }}>
            Sign in to see your account details and gear stats.
          </p>
        )}

        <div className="profile-grid">
          <div className="card">
            <strong>Account</strong>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              {session?.user?.name ?? "Gear DB member"}
            </p>
          </div>
          <div className="card">
            <strong>Inventory</strong>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              0 items tracked · Add your first guitar or synth.
            </p>
          </div>
          <div className="card">
            <strong>Insurance exports</strong>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              No exports generated yet.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <Link className="button primary" href="/">
            Add gear item
          </Link>
          <Link className="button" href="/sign-in">
            {session ? "Switch account" : "Sign in"}
          </Link>
        </div>
      </div>
    </main>
  );
}
