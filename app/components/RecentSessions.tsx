import { getSessions } from "../actions/session-actions";

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m`;
  }

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  return `${hours}h ${mins}m`;
}

export default async function RecentSessions() {
  const sessions = await getSessions();

  return (
    <div className="card">
      <h2>Recent Sessions</h2>

      {sessions.length === 0 && (
        <p style={{ opacity: 0.6 }}>
          No sessions logged yet — finish a focus session to see it here.
        </p>
      )}

      {sessions.slice(0, 15).map((session) => (
        <div key={session.id} className="sessionRow">
          <div>
            <div className="sessionProject">{session.project.name}</div>
            <div className="sessionDate">
              {new Date(session.createdAt).toLocaleDateString()}
            </div>
          </div>

          <strong>{formatDuration(session.duration)}</strong>
        </div>
      ))}
    </div>
  );
}
