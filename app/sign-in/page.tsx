import Link from "next/link";
import SocialSignInButton from "@/components/SocialSignInButton";

const providers = [
  {
    id: "google",
    name: "Google",
    helper: "Recommended for the fastest setup",
  },
  {
    id: "facebook",
    name: "Facebook",
    helper: "Connect with your existing profile",
  },
  {
    id: "apple",
    name: "Apple",
    helper: "Private email forwarding supported",
  },
  {
    id: "github",
    name: "GitHub",
    helper: "For builders managing gear and projects",
  },
];

export default function SignInPage() {
  return (
    <main className="container section">
      <Link href="/">← Back to home</Link>
      <div className="card" style={{ marginTop: 24 }}>
        <h1 style={{ fontSize: 32 }}>Sign in to Gear DB</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Choose a provider to create or access your account. We never store
          passwords directly.
        </p>
        <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
          {providers.map((provider) => (
            <SocialSignInButton
              key={provider.id}
              providerId={provider.id}
              provider={provider.name}
              helper={provider.helper}
            />
          ))}
        </div>
        <p style={{ color: "var(--muted)", marginTop: 20 }}>
          By continuing, you agree to our secure session policies and ownership
          checks for every gear record.
        </p>
      </div>
    </main>
  );
}
