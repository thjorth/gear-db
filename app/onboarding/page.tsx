import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileOnboardingForm from "@/components/ProfileOnboardingForm";
import { requireCurrentUser } from "@/lib/current-user";
import { isProfileComplete } from "@/lib/user-profile";

type OnboardingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const user = await requireCurrentUser();

  if (isProfileComplete(user)) {
    redirect("/profile");
  }

  const params = await searchParams;
  const errorParam = params.error;
  const error = typeof errorParam === "string" ? errorParam : undefined;

  return (
    <main className="container section">
      <Link href="/sign-in">← Back to sign-in</Link>
      <div className="card" style={{ marginTop: 24, maxWidth: 560 }}>
        <h1 style={{ fontSize: 32 }}>Complete your profile</h1>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          We need a few details before you can access your profile page.
        </p>

        <ProfileOnboardingForm
          email={user.email ?? ""}
          fullName={user.fullName}
          defaultScreenName={user.screenName ?? ""}
          defaultCountry={user.country ?? ""}
          defaultCity={user.city ?? ""}
          error={error}
        />
      </div>
    </main>
  );
}
