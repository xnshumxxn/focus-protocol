import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Focus Protocol",
};

export default function PrivacyPage() {
  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 800, margin: "40px auto" }}>
        <h1 style={{ marginBottom: 24 }}>Privacy Policy</h1>

        <p style={{ marginBottom: 16, opacity: 0.8, lineHeight: 1.6 }}>
          Last updated: [date]
        </p>

        <h2>What we collect</h2>
        <p style={{ marginBottom: 16, opacity: 0.8, lineHeight: 1.6 }}>
          When you sign in with Google, we store your name, email, and profile
          picture. We also store the focus sessions and projects you create
          while using Focus Protocol.
        </p>

        <h2>How we use it</h2>
        <p style={{ marginBottom: 16, opacity: 0.8, lineHeight: 1.6 }}>
          Your data is used to show your stats, streaks, and leaderboard
          ranking. We do not sell your data to third parties.
        </p>

        {/* ...add the rest of your actual policy here... */}

        <Link href="/" className="glassButton" style={{ display: "inline-block", marginTop: 24 }}>
          ← Back to Focus Protocol
        </Link>
      </div>
    </main>
  );
}