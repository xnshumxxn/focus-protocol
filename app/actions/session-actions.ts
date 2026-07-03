"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function createFocusSession(projectId: string, duration: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== user.id) {
    throw new Error("Project not found");
  }

  await prisma.focusSession.create({
    data: {
      projectId,
      duration,
      startedAt: new Date(Date.now() - duration * 1000),
      endedAt: new Date(),
    },
  });
}

export async function getSessions() {
  const user = await getCurrentUser();
  if (!user) return [];

  return prisma.focusSession.findMany({
    where: {
      project: {
        userId: user.id,
      },
    },
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
