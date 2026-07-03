import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import RecentSessions from "./components/RecentSessions";
import Header from "./components/Header";
import Timer from "./components/Timer";
import ProjectPanel from "./components/ProjectPanel";
import StatsCard from "./components/StatsCard";
import TodayStats from "./components/TodayStats";
import WeeklyChart from "./components/WeeklyChart";
import SignInScreen from "./components/SignInScreen";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <SignInScreen />;
  }

  return (
    <main className="container">
      <Header />

      <div className="dashboardGrid">
        <div className="leftColumn">
          <Timer />
          <WeeklyChart />
          <RecentSessions />
        </div>

        <div className="rightColumn">
          <ProjectPanel />
          <TodayStats />
          <StatsCard />
        </div>
      </div>
    </main>
  );
}
