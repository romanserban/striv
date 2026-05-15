import { useEffect } from "react";

import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";

export function useAuthBootstrap() {
  const setSession = useAuthStore((state) => state.setSession);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setIsBootstrapping = useAuthStore((state) => state.setIsBootstrapping);
  const resetAuth = useAuthStore((state) => state.resetAuth);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const { data } = await authService.getSession();
      if (!isMounted) {
        return;
      }

      setSession(data.session);

      if (data.session?.user.id) {
        const profile = await authService.getProfile(data.session.user.id);
        if (isMounted) {
          setProfile(profile);
        }
      }

      if (isMounted) {
        setIsBootstrapping(false);
      }
    }

    bootstrap().catch(() => {
      if (isMounted) {
        resetAuth();
      }
    });

    const {
      data: { subscription }
    } = authService.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (!session?.user.id) {
        setProfile(null);
        setIsBootstrapping(false);
        return;
      }

      const profile = await authService.getProfile(session.user.id);
      setProfile(profile);
      setIsBootstrapping(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [resetAuth, setIsBootstrapping, setProfile, setSession]);
}
