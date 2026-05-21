import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isProfileComplete } from "@/lib/user-profile";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      email: true,
      fullName: true,
      name: true,
      screenName: true,
      country: true,
      city: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const fullName = user.fullName ?? user.name ?? "";

  if (!user.fullName && fullName) {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { fullName },
    });
  }

  if (!isProfileComplete({ ...user, fullName })) {
    redirect("/onboarding");
  }

  return (
    <main className="container section">
      <Link href="/">← Back to home</Link>
      <div className="card" style={{ marginTop: 24 }}>
        <h1 style={{ fontSize: 32 }}>Your profile</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Signed in as <em>{user.email ?? "Unknown user"}</em>.
        </p>

        <div className="profile-grid">
          <div className="card">
            <strong>Account</strong>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              {fullName} · @{user.screenName}
            </p>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              {user.city}, {user.country}
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
            Switch account
          </Link>
        </div>
      </div>
    </main>
  );
}
