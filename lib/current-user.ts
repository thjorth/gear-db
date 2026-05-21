import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isProfileComplete } from "@/lib/user-profile";

export async function requireCurrentUser() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
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
      where: { id: user.id },
      data: { fullName },
    });
  }

  return {
    ...user,
    fullName,
  };
}

export async function requireOnboardedUser() {
  const user = await requireCurrentUser();

  if (!isProfileComplete(user)) {
    redirect("/onboarding");
  }

  return user;
}
