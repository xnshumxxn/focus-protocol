"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export async function getTodayStats() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      focusSeconds: 0,
      sessionCount: 0,
      streak: 0,
      level: 1,
      levelProgress: 0,
      sessionsIntoLevel: 0,
    };
  }

  const todayStart = startOfDay(new Date());

  const [todaySessions, allSessions] = await Promise.all([
    prisma.focusSession.findMany({
      where: {
        project: { userId: user.id },
        createdAt: { gte: todayStart },
      },
    }),
    prisma.focusSession.findMany({
      where: {
        project: { userId: user.id },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const focusSeconds = todaySessions.reduce((sum: any, s: { duration: any; }) => sum + s.duration, 0);
  const sessionCount = todaySessions.length;

  const activeDays = new Set(
    allSessions.map((s: { createdAt: Date; }) => startOfDay(s.createdAt).getTime())
  );

  let streak = 0;
  const cursor = startOfDay(new Date());

  if (!activeDays.has(cursor.getTime())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (activeDays.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const level = Math.floor(allSessions.length / 10) + 1;
  const sessionsIntoLevel = allSessions.length % 10;
  const levelProgress = sessionsIntoLevel / 10;

  return {
    focusSeconds,
    sessionCount,
    streak,
    level,
    levelProgress,
    sessionsIntoLevel,
  };
}

export async function getWeeklyFocus() {
  return getFocusChart("week");
}

export type ChartPeriod = "week" | "month" | "year";

// Returns { day, minutes }[] for the requested period:
// - "week": the last 7 days, bucketed per day.
// - "month": the current calendar month, bucketed per day.
// - "year": the current calendar year, bucketed per month.
export async function getFocusChart(period: ChartPeriod) {
  const user = await getCurrentUser();
  if (!user) return [];

  const now = new Date();

  if (period === "week") {
    const sevenDaysAgo = startOfDay(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const sessions = await prisma.focusSession.findMany({
      where: {
        project: { userId: user.id },
        createdAt: { gte: sevenDaysAgo },
      },
      select: { duration: true, createdAt: true },
    });

    const buckets: { day: string; minutes: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const day = startOfDay(now);
      day.setDate(day.getDate() - i);

      const label = day.toLocaleDateString(undefined, { weekday: "short" });

      const minutes =
        sessions
          .filter((s) => startOfDay(s.createdAt).getTime() === day.getTime())
          .reduce((sum, s) => sum + s.duration, 0) / 60;

      buckets.push({ day: label, minutes: Math.round(minutes) });
    }

    return buckets;
  }

  if (period === "month") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    const sessions = await prisma.focusSession.findMany({
      where: {
        project: { userId: user.id },
        createdAt: { gte: monthStart },
      },
      select: { duration: true, createdAt: true },
    });

    const buckets: { day: string; minutes: number }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const day = new Date(now.getFullYear(), now.getMonth(), d);

      const minutes =
        sessions
          .filter((s) => startOfDay(s.createdAt).getTime() === day.getTime())
          .reduce((sum, s) => sum + s.duration, 0) / 60;

      buckets.push({ day: String(d), minutes: Math.round(minutes) });
    }

    return buckets;
  }

  // period === "year"
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const sessions = await prisma.focusSession.findMany({
    where: {
      project: { userId: user.id },
      createdAt: { gte: yearStart },
    },
    select: { duration: true, createdAt: true },
  });

  const buckets: { day: string; minutes: number }[] = [];

  for (let m = 0; m <= now.getMonth(); m++) {
    const label = new Date(now.getFullYear(), m, 1).toLocaleDateString(
      undefined,
      { month: "short" }
    );

    const minutes =
      sessions
        .filter(
          (s) =>
            s.createdAt.getFullYear() === now.getFullYear() &&
            s.createdAt.getMonth() === m
        )
        .reduce((sum, s) => sum + s.duration, 0) / 60;

    buckets.push({ day: label, minutes: Math.round(minutes) });
  }

  return buckets;
}

export type LeaderboardPeriod = "week" | "month";

export type LeaderboardEntry = {
  id: string;
  name: string | null;
  image: string | null;
  sessionCount: number;
  focusSeconds: number;
};

// Ranks every registered user by number of focus sessions completed
// within the given period (week = last 7 days, month = last 30 days).
export async function getLeaderboard(
  period: LeaderboardPeriod
): Promise<LeaderboardEntry[]> {
  const start = startOfDay(new Date());
  start.setDate(start.getDate() - (period === "week" ? 6 : 29));

  const sessions = await prisma.focusSession.findMany({
    where: {
      createdAt: { gte: start },
    },
    select: {
      duration: true,
      project: {
        select: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
    },
  });

  const byUser = new Map<string, LeaderboardEntry>();

  for (const s of sessions) {
    const u = s.project.user;
    const existing = byUser.get(u.id);

    if (existing) {
      existing.sessionCount += 1;
      existing.focusSeconds += s.duration;
    } else {
      byUser.set(u.id, {
        id: u.id,
        name: u.name,
        image: u.image,
        sessionCount: 1,
        focusSeconds: s.duration,
      });
    }
  }

  return Array.from(byUser.values())
    .sort((a, b) => b.sessionCount - a.sessionCount)
    .slice(0, 10);
}