import { getLeaderboard } from "../actions/stats-actions";
import { getCurrentUser } from "@/lib/getCurrentUser";
import LeaderboardClient from "./LeaderboardClient";

export default async function Leaderboard() {
  const [week, month, currentUser] = await Promise.all([
    getLeaderboard("week"),
    getLeaderboard("month"),
    getCurrentUser(),
  ]);

  return (
    <LeaderboardClient
      week={week}
      month={month}
      currentUserId={currentUser?.id ?? null}
    />
  );
}
