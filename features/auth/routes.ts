import type { UserRole } from "@/types/user";

export const getRoleHomeRoute = (role: UserRole) =>
  role === "coach" ? "/(coach)/dashboard" : "/(client)/today";
