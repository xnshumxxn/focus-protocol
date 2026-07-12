import { getFocusChart } from "../actions/stats-actions";
import WeeklyChartClient from "./WeeklyChartClient";

export default async function WeeklyChart() {
  const data = await getFocusChart("week");

  return <WeeklyChartClient initialData={data} />;
}
