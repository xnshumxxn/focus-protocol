"use client";

import { useState } from "react";
import type { LeaderboardEntry, LeaderboardPeriod } from "../actions/stats-actions";

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m`;
  }

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  return `${hours}h ${mins}m`;
}

export default function LeaderboardClient({
  week,
  month,
  currentUserId,
}: {
  week: LeaderboardEntry[];
  month: LeaderboardEntry[];
  currentUserId: string | null;
}) {
  const [period, setPeriod] = useState<LeaderboardPeriod>("week");

  const entries = period === "week" ? week : month;

  return (
    <div className="card leaderboardCard">
      <div className="chartHeaderRow">
        <h2>Leaderboard</h2>

        <div className="tabRow">
          <button
            className={`tabButton ${period === "week" ? "tabButtonActive" : ""}`}
            onClick={() => setPeriod("week")}
          >
            Week
          </button>
          <button
            className={`tabButton ${period === "month" ? "tabButtonActive" : ""}`}
            onClick={() => setPeriod("month")}
          >
            Month
          </button>
        </div>
      </div>

      {entries.length === 0 && (
        <p className="emptyState">
          No sessions logged by anyone in this period yet — be the first!
        </p>
      )}

      {entries.map((entry, i) => (
        <div
          key={entry.id}
          className={`leaderboardRow ${
            entry.id === currentUserId ? "leaderboardYou" : ""
          }`}
        >
          <span
            className={`leaderboardRank ${i < 3 ? "leaderboardRankTop" : ""}`}
          >
            #{i + 1}
          </span>

          {entry.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.image}
              alt={entry.name ?? "User"}
              className="leaderboardAvatarImg"
            />
          ) : (
            <div className="leaderboardAvatar">
              {entry.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}

          <span className="leaderboardName">
            {entry.name ?? "Anonymous"}
            {entry.id === currentUserId ? " (you)" : ""}
          </span>

          <span className="leaderboardMeta">
            {entry.sessionCount} {entry.sessionCount === 1 ? "session" : "sessions"}
            <div className="leaderboardMetaSub">
              {formatDuration(entry.focusSeconds)} focused
            </div>
          </span>
        </div>
      ))}
    </div>
  );
}
