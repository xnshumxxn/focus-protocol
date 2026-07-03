"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function getProjects() {
  const user = await getCurrentUser();
  if (!user) return [];

  return await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createProject(name: string) {
  if (!name.trim()) return;

  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  await prisma.project.create({
    data: {
      name,
      userId: user.id,
    },
  });
}

export async function deleteProject(projectId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  // Make sure the project actually belongs to the caller before touching it.
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== user.id) {
    throw new Error("Project not found");
  }

  await prisma.focusSession.deleteMany({
    where: {
      projectId,
    },
  });

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
}
