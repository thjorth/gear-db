"use client";

import { signOut } from "next-auth/react";

type SignOutButtonProps = {
  className?: string;
};

export default function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => signOut({ callbackUrl: "/sign-in" })}
    >
      Sign out
    </button>
  );
}
