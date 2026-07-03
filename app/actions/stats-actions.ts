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
  const user = await getCurrentUser();
  if (!user) return [];

  const sevenDaysAgo = startOfDay(new Date());
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const sessions: { duration: number; createdAt: Date }[] = await prisma.focusSession.findMany({
    where: {
      project: { userId: user.id },
      createdAt: { gte: sevenDaysAgo },
    },
    select: { duration: true, createdAt: true },
  });

  const buckets: { day: string; minutes: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const day = startOfDay(new Date());
    day.setDate(day.getDate() - i);

    const label = day.toLocaleDateString(undefined, { weekday: "short" });

    const minutes = sessions
      .filter((s) => startOfDay(s.createdAt).getTime() === day.getTime())
      .reduce((sum, s) => sum + s.duration, 0) / 60;

    buckets.push({ day: label, minutes: Math.round(minutes) });
  }

  return buckets;
}