import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isProfileComplete } from "@/lib/user-profile";
import ProfileOnboardingForm from "@/components/ProfileOnboardingForm";

type OnboardingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      email: true,
      name: true,
      fullName: true,
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

  if (isProfileComplete({ ...user, fullName })) {
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
          fullName={fullName}
          defaultScreenName={user.screenName ?? ""}
          defaultCountry={user.country ?? ""}
          defaultCity={user.city ?? ""}
          error={error}
        />
      </div>
    </main>
  );
}
