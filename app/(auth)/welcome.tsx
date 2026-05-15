import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing, typography } from "@/theme";

export default function WelcomeScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.brand}>{t("welcome")}</Text>
        <Text style={styles.title}>{t("auth.welcomeTitle")}</Text>
        <Text style={styles.body}>{t("auth.welcomeBody")}</Text>
      </View>
      <Card>
        <View style={styles.actions}>
          <Link href="/login" asChild>
            <Button label={t("login")} />
          </Link>
          <Link href="/choose-role" asChild>
            <Button label={t("signup")} variant="secondary" />
          </Link>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg
  },
  brand: {
    color: colors.primary,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size["2xl"],
    lineHeight: typography.lineHeight["2xl"],
    fontWeight: typography.weight.bold
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md
  },
  actions: {
    gap: spacing.md
  }
});
