import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();

  return <Text style={styles.badge}>{t(`status.${status}`, { defaultValue: status })}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.primary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.semibold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs
  }
});

