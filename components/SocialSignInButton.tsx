"use client";

import { signIn } from "next-auth/react";

type SocialSignInButtonProps = {
  providerId: string;
  provider: string;
  helper: string;
};

export default function SocialSignInButton({
  providerId,
  provider,
  helper,
}: SocialSignInButtonProps) {
  return (
    <button
      className="social-button"
      type="button"
      onClick={() => signIn(providerId, { callbackUrl: "/profile" })}
    >
      <div>
        Continue with {provider}
        <div>
          <span>{helper}</span>
        </div>
      </div>
      <span aria-hidden>→</span>
    </button>
  );
}
