import Link from "next/link";
import SocialSignInButton from "@/components/SocialSignInButton";

const allProviders = [
  {
    id: "google",
    name: "Google",
    helper: "Recommended for the fastest setup",
    envVars: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
  },
  {
    id: "facebook",
    name: "Facebook",
    helper: "Connect with your existing profile",
    envVars: ["FACEBOOK_CLIENT_ID", "FACEBOOK_CLIENT_SECRET"],
  },
  {
    id: "apple",
    name: "Apple",
    helper: "Private email forwarding supported",
    envVars: ["APPLE_CLIENT_ID", "APPLE_CLIENT_SECRET"],
  },
  {
    id: "github",
    name: "GitHub",
    helper: "For builders managing gear and projects",
    envVars: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
];

const getConfiguredProviders = () => {
  return allProviders.filter((provider) =>
    provider.envVars.every((envVar) => process.env[envVar])
  );
};

export default function SignInPage() {
  const providers = getConfiguredProviders();

  return (
    <main className="container section">
      <Link href="/">← Back to home</Link>
      <div className="card" style={{ marginTop: 24 }}>
        <h1 style={{ fontSize: 32 }}>Sign in to Gear DB</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Choose a provider to create or access your account. We never store
          passwords directly.
        </p>
        {providers.length > 0 ? (
          <>
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
              By continuing, you agree to our secure session policies and
              ownership checks for every gear record.
            </p>
          </>
        ) : (
          <p style={{ color: "var(--muted)", marginTop: 20 }}>
            No OAuth providers configured. Please add provider credentials to
            your .env file.
          </p>
        )}
      </div>
    </main>
  );
}
