"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const clean = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const redirectWithError = (message: string) => {
  redirect(`/onboarding?error=${encodeURIComponent(message)}`);
};

export async function completeProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const screenName = clean(formData.get("screenName"));
  const country = clean(formData.get("country"));
  const city = clean(formData.get("city"));

  if (!screenName || !country || !city) {
    redirectWithError("Please fill out all fields.");
  }

  if (screenName.length < 3 || screenName.length > 40) {
    redirectWithError("Screen name must be between 3 and 40 characters.");
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        screenName,
        country,
        city,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirectWithError("This screen name is already taken.");
    }

    redirectWithError("Could not save your profile. Please try again.");
  }

  redirect("/profile");
}
