import type { User } from "@prisma/client";

export const isProfileComplete = (user: Pick<User, "screenName" | "fullName" | "country" | "city">) => {
  return Boolean(user.screenName && user.fullName && user.country && user.city);
};
