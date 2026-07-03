"use client";

import { signIn } from "next-auth/react";

export default function SignInScreen() {
  return (
    <div className="signInScreen">
      <div className="signInCard">
        <h1>Focus Protocol</h1>
        <p>Deep Work Operating System</p>

        <button
          className="googleBtn"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C33.9 5.5 29.2 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5 44.5 35.3 44.5 24c0-1.2-.1-2.3-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 8 3l6-6C33.9 5.5 29.2 3.5 24 3.5c-7.7 0-14.4 4.4-17.7 11.2z"
            />
            <path
              fill="#4CAF50"
              d="M24 44.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.3 0-9.7-3.1-11.3-8l-6.5 5C9.5 39.9 16.2 44.5 24 44.5z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C40.7 36.3 44.5 30.7 44.5 24c0-1.2-.1-2.3-.4-3.5z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
