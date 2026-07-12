import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Focus Protocol",
};

export default function TermsPage() {
  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 800, margin: "40px auto" }}>
        <h1 style={{ marginBottom: 24 }}>Terms of Service</h1>

        <p style={{ marginBottom: 16, opacity: 0.8, lineHeight: 1.6 }}>
          Last updated: [date]
        </p>

        {/* ...your actual terms here... */}

        <Link href="/" className="glassButton" style={{ display: "inline-block", marginTop: 24 }}>
          ← Back to Focus Protocol
        </Link>
      </div>
    </main>
  );
}