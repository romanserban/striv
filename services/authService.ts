import { supabase } from "@/lib/supabase";

export const authService = {
  getSession: () => supabase.auth.getSession(),
  signOut: () => supabase.auth.signOut()
};
