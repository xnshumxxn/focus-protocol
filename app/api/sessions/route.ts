import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json();
  const { projectId, duration } = body;

  if (!projectId || !duration) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== user.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const session = await prisma.focusSession.create({
    data: {
      projectId,
      duration,
      startedAt: new Date(Date.now() - duration * 1000),
      endedAt: new Date(),
    },
  });

  return NextResponse.json(session);
}
