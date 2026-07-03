import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTodayStats } from "../actions/stats-actions";
import SignOutButton from "./SignOutButton";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const stats = session
    ? await getTodayStats()
    : { level: 1, levelProgress: 0, sessionsIntoLevel: 0 };

  return (
    <header className="header">
      <div>
        <h1>Focus Protocol</h1>
        <p>Deep Work Operating System</p>
      </div>

      {session?.user && (
        <div className="profile">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? "Profile"}
              className="avatarImg"
            />
          ) : (
            <div className="avatar">
              {session.user.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}

          <div className="profileInfo">
            <h3>{session.user.name}</h3>
            <p>Level {stats.level} Focuser</p>

            <div className="levelBarTrack">
              <div
                className="levelBarFill"
                style={{ width: `${stats.levelProgress * 100}%` }}
              />
            </div>
            <span className="levelBarLabel">
              {stats.sessionsIntoLevel}/10 to Level {stats.level + 1}
            </span>
          </div>

          <SignOutButton />
        </div>
      )}
    </header>
  );
}