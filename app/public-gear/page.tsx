import Link from "next/link";
import { prisma } from "@/lib/prisma";

const buildPublicImageUrl = (imageId: string, size: "thumb" | "full") =>
  `/public-gear/image/${imageId}?size=${size}`;

export default async function PublicGearPage() {
  const gearItems = await prisma.gearItem.findMany({
    where: {
      isPublic: true,
      deletedAt: null,
    },
    select: {
      id: true,
      brand: true,
      model: true,
      category: true,
      year: true,
      condition: true,
      description: true,
      tags: true,
      images: {
        select: {
          id: true,
        },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const items = gearItems.map((item) => {
    const imageId = item.images[0]?.id;
    return {
      ...item,
      thumbUrl: imageId ? buildPublicImageUrl(imageId, "thumb") : null,
      fullUrl: imageId ? buildPublicImageUrl(imageId, "full") : null,
    };
  });

  return (
    <>
      <header className="container">
        <nav>
          <strong>Gear DB</strong>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/sign-in">Sign in</Link>
          </div>
        </nav>
      </header>

      <main className="container section">
        <div style={{ display: "grid", gap: 16, marginBottom: 32 }}>
          <h1 style={{ fontSize: 36 }}>Public gear showcase</h1>
          <p style={{ color: "var(--muted)", maxWidth: 720 }}>
            Explore instruments shared by Gear DB members. Specifications,
            condition notes, and descriptions are visible while sensitive
            purchase details remain private.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="card">No public gear yet.</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {items.map((item) => (
              <div key={item.id} className="card" style={{ padding: 20 }}>
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #e2e8f0, #f8fafc)",
                    aspectRatio: "4 / 3",
                    display: "grid",
                    placeItems: "center",
                    marginBottom: 16,
                  }}
                >
                  {item.thumbUrl ? (
                    <a href={item.fullUrl ?? item.thumbUrl} target="_blank" rel="noreferrer">
                      <img
                        src={item.thumbUrl}
                        alt={`${item.brand} ${item.model}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </a>
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: 14 }}>
                      No photo yet
                    </span>
                  )}
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <div>
                    <strong style={{ fontSize: 18 }}>
                      {item.brand} {item.model}
                    </strong>
                    <p style={{ color: "var(--muted)", marginTop: 4 }}>
                      {item.category.toLowerCase()}
                      {item.year ? ` · ${item.year}` : ""}
                    </p>
                  </div>

                  {item.description ? (
                    <p style={{ color: "var(--muted)" }}>{item.description}</p>
                  ) : null}

                  {item.condition ? (
                    <p style={{ fontSize: 14, color: "var(--muted)" }}>
                      Condition: {item.condition}
                    </p>
                  ) : null}

                  {item.tags.length ? (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 12,
                            padding: "4px 8px",
                            borderRadius: 999,
                            background: "#eef2ff",
                            color: "#3730a3",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="container">
        <span>© 2026 Gear DB. Public inventory showcase.</span>
      </footer>
    </>
  );
}
