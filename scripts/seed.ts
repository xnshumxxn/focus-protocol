import { prisma } from "../lib/prisma";

async function main() {

  await prisma.user.create({
    data: {
      email: "demo@focusprotocol.com",
      name: "Anshumaan",
    },
  });

}

main();