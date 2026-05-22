import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.BRANDIX_ADMIN_EMAIL || "hello@nebulixcloud.com";
  const password = process.env.BRANDIX_ADMIN_PASSWORD || "change-this-local-password";

  await prisma.adminSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" }
  });

  await prisma.user.upsert({
    where: { email },
    update: { role: "super_admin", status: "active" },
    create: {
      name: "Nebulix Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "super_admin",
      plan: "business"
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
