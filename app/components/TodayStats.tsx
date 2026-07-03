import { getTodayStats } from "../actions/stats-actions";

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m`;
  }

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  return `${hours}h ${mins}m`;
}

export default async function TodayStats() {
  const { focusSeconds, sessionCount, streak } = await getTodayStats();

  return (
    <div className="card">
      <h2>Today&apos;s Stats</h2>

      <div className="stat">
        <span>Focus Time</span>
        <strong>{formatDuration(focusSeconds)}</strong>
      </div>

      <div className="stat">
        <span>Sessions</span>
        <strong>{sessionCount}</strong>
      </div>

      <div className="stat">
        <span>Streak</span>
        <strong className={streak > 0 ? "streakGlow" : ""}>
          {streak} {streak === 1 ? "Day" : "Days"}
        </strong>
      </div>
    </div>
  );
}
