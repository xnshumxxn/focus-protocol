"use server";

import { prisma } from "@/lib/prisma";

const DEMO_USER_ID = "cmqc648870000ose8fjqc8ifj";

export async function getProjects() {
  return await prisma.project.findMany({
    where: {
      userId: DEMO_USER_ID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createProject(name: string) {
  if (!name.trim()) return;

  await prisma.project.create({
    data: {
      name,
      userId: DEMO_USER_ID,
    },
  });
}