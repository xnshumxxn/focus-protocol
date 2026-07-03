import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTodayStats } from "../actions/stats-actions";
import SignOutButton from "./SignOutButton";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const { level } = session ? await getTodayStats() : { level: 1 };

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

          <div>
            <h3>{session.user.name}</h3>
            <p>Level {level} Focuser</p>
          </div>

          <SignOutButton />
        </div>
      )}
    </header>
  );
}
