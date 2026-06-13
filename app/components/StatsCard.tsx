export default function StatsCard() {
  return (
    <div className="card">
      <h2>Today's Stats</h2>

      <div className="stat">
        <span>Focus Time</span>
        <strong>3h 45m</strong>
      </div>

      <div className="stat">
        <span>Sessions</span>
        <strong>7</strong>
      </div>

      <div className="stat">
        <span>Streak</span>
        <strong>12 Days</strong>
      </div>
    </div>
  );
}