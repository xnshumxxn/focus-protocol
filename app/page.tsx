import Header from "./components/HeaderTemp";
import Timer from "./components/Timer";
import ProjectPanel from "./components/ProjectPanel";
import StatsCard from "./components/StatsCard";

export default function Home() {
  return (
    <main className="container">
      <Header />

      <div className="grid">
        <div>
          <Timer />
        </div>

        <div className="sidebar">
          <ProjectPanel />
          <StatsCard />
        </div>
      </div>
    </main>
  );
}