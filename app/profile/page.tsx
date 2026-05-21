import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireOnboardedUser } from "@/lib/current-user";

export default async function ProfilePage() {
  const user = await requireOnboardedUser();

  const gearItems = await prisma.gearItem.findMany({
    where: {
      ownerId: user.id,
      deletedAt: null,
    },
    select: {
      id: true,
      brand: true,
      model: true,
      category: true,
      estimatedValue: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
              {user.fullName} · @{user.screenName}
            </p>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              {user.city}, {user.country}
            </p>
          </div>
          <div className="card">
            <strong>Inventory</strong>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              {gearItems.length} items tracked
            </p>
            <ul style={{ marginTop: 10, paddingLeft: 18, color: "var(--muted)" }}>
              {gearItems.slice(0, 5).map((item) => (
                <li key={item.id} style={{ marginBottom: 8 }}>
                  <Link href={`/gear/${item.id}/edit`}>
                    {item.brand} {item.model}
                  </Link>{" "}
                  ({item.category.toLowerCase()})
                </li>
              ))}
              {gearItems.length === 0 ? <li>No gear yet.</li> : null}
            </ul>
          </div>
          <div className="card">
            <strong>Insurance exports</strong>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              No exports generated yet.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <Link className="button primary" href="/gear/new">
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
