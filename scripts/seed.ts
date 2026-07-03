import { prisma } from "../lib/prisma";

async function main() {
  await prisma.user.upsert({
    where: { email: "demo@focusprotocol.com" },
    update: {},
    create: {
      email: "demo@focusprotocol.com",
      name: "Anshumaan",
    },
  });
}

main().finally(() => prisma.$disconnect());
