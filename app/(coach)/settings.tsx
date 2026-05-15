import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";

export default function CoachSettingsScreen() {
  const { t } = useTranslation();
  const resetAuth = useAuthStore((state) => state.resetAuth);
  const logoutMutation = useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      resetAuth();
      router.replace("/welcome");
    }
  });

  return (
    <PlaceholderScreen titleKey="settings">
      <Card>
        <EmptyState title={t("settings")} body={t("placeholder.screenBody")} />
        <Button label={t("logout")} loading={logoutMutation.isPending} onPress={() => logoutMutation.mutate()} />
      </Card>
    </PlaceholderScreen>
  );
}
