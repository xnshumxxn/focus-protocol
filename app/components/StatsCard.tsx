import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m`;
  }

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  return `${hours}h ${mins}m`;
}

export default async function StatsCard() {
  const user = await getCurrentUser();

  const sessions = user
    ? await prisma.focusSession.findMany({
        where: { project: { userId: user.id } },
      })
    : [];

  const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);

  const averageSeconds =
    sessions.length > 0 ? Math.floor(totalSeconds / sessions.length) : 0;

  const longestSession =
    sessions.length > 0 ? Math.max(...sessions.map((s) => s.duration)) : 0;

  return (
    <div className="card">
      <h2>All-Time Analytics</h2>

      <div className="stat">
        <span>Total Focus Time</span>
        <strong>{formatDuration(totalSeconds)}</strong>
      </div>

      <div className="stat">
        <span>Sessions</span>
        <strong>{sessions.length}</strong>
      </div>

      <div className="stat">
        <span>Average Session</span>
        <strong>{formatDuration(averageSeconds)}</strong>
      </div>

      <div className="stat">
        <span>Longest Session</span>
        <strong>{formatDuration(longestSession)}</strong>
      </div>
    </div>
  );
}
