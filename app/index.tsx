import { Redirect } from "expo-router";

import { getRoleHomeRoute } from "@/features/auth/routes";
import { useAuthStore } from "@/store/authStore";

export default function IndexRoute() {
  const session = useAuthStore((state) => state.session);
  const profile = useAuthStore((state) => state.profile);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  if (isBootstrapping) {
    return null;
  }

  if (session && profile?.role) {
    return <Redirect href={getRoleHomeRoute(profile.role)} />;
  }

  if (session) {
    return <Redirect href="/choose-role" />;
  }

  return <Redirect href="/welcome" />;
}
