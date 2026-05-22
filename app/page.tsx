import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <header className="container">
        <nav>
          <strong>Gear DB</strong>
          <div className="nav-links">
            <Link href="/public-gear">Public gear</Link>
            <Link href="/sign-in">Sign in</Link>
            <Link href="/profile">Profile</Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="container hero">
          <div>
            <h1>Catalog every piece of gear with insurance-ready detail.</h1>
            <p>
              Keep ownership, photos, and valuation details organized so you can
              export documentation whenever you need it.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="button primary" href="/sign-in">
                Get started
              </Link>
              <Link className="button" href="/profile">
                View profile
              </Link>
            </div>
          </div>
          <div className="card">
            <h2>What you can store</h2>
            <ul style={{ marginTop: 12, paddingLeft: 20, color: "var(--muted)" }}>
              <li>Serial numbers, purchase info, and condition notes.</li>
              <li>Photos in multiple sizes with privacy controls.</li>
              <li>Exportable summaries for insurance policies.</li>
            </ul>
          </div>
        </section>

        <section className="section container">
          <h2>Built for trusted ownership</h2>
          <div className="grid" style={{ marginTop: 24 }}>
            <div className="card">
              <strong>Secure access</strong>
              <p>Social sign-in with persistent sessions and safe cookies.</p>
            </div>
            <div className="card">
              <strong>Private by default</strong>
              <p>Only you can access and export your inventory.</p>
            </div>
            <div className="card">
              <strong>Ready for reports</strong>
              <p>Export clean summaries for insurers or inventory audits.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="container">
        <span>© 2026 Gear DB. Secure your music gear inventory.</span>
      </footer>
    </>
  );
}
