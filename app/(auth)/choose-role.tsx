import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { getRoleHomeRoute } from "@/features/auth/routes";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";
import type { UserRole } from "@/types/user";

export default function ChooseRoleScreen() {
  const { t } = useTranslation();
  const session = useAuthStore((state) => state.session);
  const setProfile = useAuthStore((state) => state.setProfile);

  const roleMutation = useMutation({
    mutationFn: async (role: UserRole) => {
      if (!session?.user.id) {
        return { role };
      }

      const profile = await authService.upsertProfile({
        userId: session.user.id,
        fullName: session.user.user_metadata.full_name ?? "",
        role
      });

      setProfile(profile);
      return profile;
    },
    onSuccess: (result) => {
      router.replace(getRoleHomeRoute(result.role));
    }
  });

  const chooseRole = (role: UserRole) => {
    if (!session) {
      router.push({ pathname: "/signup", params: { role } });
      return;
    }

    roleMutation.mutate(role);
  };

  return (
    <Screen>
      <Text style={styles.title}>{t("auth.chooseRoleTitle")}</Text>
      <View style={styles.actions}>
        {roleMutation.error ? <Text style={styles.error}>{roleMutation.error.message}</Text> : null}
        <Button label={t("coach")} loading={roleMutation.isPending} onPress={() => chooseRole("coach")} />
        <Button
          label={t("client")}
          loading={roleMutation.isPending}
          onPress={() => chooseRole("client")}
          variant="secondary"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    lineHeight: typography.lineHeight.xl,
    fontWeight: typography.weight.bold,
    paddingTop: spacing["2xl"]
  },
  actions: {
    gap: spacing.md
  },
  error: {
    color: colors.error,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  }
});
