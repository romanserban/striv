import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing, typography } from "@/theme";

export default function ChooseRoleScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <Text style={styles.title}>{t("auth.chooseRoleTitle")}</Text>
      <View style={styles.actions}>
        <Link href="/(coach)/dashboard" asChild>
          <Button label={t("coach")} />
        </Link>
        <Link href="/(client)/today" asChild>
          <Button label={t("client")} variant="secondary" />
        </Link>
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
  }
});
