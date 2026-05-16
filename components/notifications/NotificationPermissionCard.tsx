import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { colors, spacing, typography } from "@/theme";

type NotificationPermissionCardProps = {
  userId?: string;
};

export function NotificationPermissionCard({ userId }: NotificationPermissionCardProps) {
  const { t } = useTranslation();
  const {
    permissionStatus,
    pushTokens,
    isPushTokenLoading,
    registerForPushNotifications,
    isRegistering,
    registerResult,
    registerError
  } = usePushNotifications(userId);

  const registeredToken = pushTokens[0];
  const statusLabel = registeredToken
    ? t("notifications.enabled")
    : permissionStatus
      ? t(`notifications.status.${permissionStatus}`)
      : t("placeholder.loading");

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("notifications.title")}</Text>
          <Text style={styles.status}>{statusLabel}</Text>
        </View>
        <Text style={styles.body}>{t("notifications.body")}</Text>
        {registeredToken ? (
          <Text style={styles.detail}>
            {t("notifications.deviceRegistered", { platform: registeredToken.platform })}
          </Text>
        ) : null}
        {registerResult?.status === "unavailable" ? (
          <Text style={styles.error}>{t("notifications.deviceUnavailable")}</Text>
        ) : null}
        {registerResult?.status === "missing-project-id" ? (
          <Text style={styles.error}>{t("notifications.missingProjectId")}</Text>
        ) : null}
        {registerError ? <Text style={styles.error}>{registerError.message}</Text> : null}
        <Button
          label={registeredToken ? t("notifications.refreshToken") : t("notifications.enable")}
          disabled={!userId}
          loading={isRegistering || isPushTokenLoading}
          onPress={() => registerForPushNotifications()}
          variant={registeredToken ? "secondary" : "primary"}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md
  },
  header: {
    gap: spacing.xs
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold
  },
  status: {
    color: colors.primary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.medium
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md
  },
  detail: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  error: {
    color: colors.error,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  }
});
