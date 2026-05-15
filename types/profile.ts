import type { UserRole } from "@/types/user";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
};
