import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const getApiUser = async () => {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true },
  });
};
