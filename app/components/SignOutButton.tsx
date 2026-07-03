"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button className="glassButton signOutBtn" onClick={() => signOut()}>
      Sign out
    </button>
  );
}
