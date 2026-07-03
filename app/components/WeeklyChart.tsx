import { getWeeklyFocus } from "../actions/stats-actions";
import WeeklyChartClient from "./WeeklyChartClient";

export default async function WeeklyChart() {
  const data = await getWeeklyFocus();

  return <WeeklyChartClient data={data} />;
}
