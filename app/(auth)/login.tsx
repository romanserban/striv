import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing, typography } from "@/theme";

export default function LoginScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{t("auth.loginTitle")}</Text>
      </View>
      <View style={styles.form}>
        <Input label={t("email")} autoCapitalize="none" keyboardType="email-address" />
        <Input label={t("password")} secureTextEntry />
        <Link href="/choose-role" asChild>
          <Button label={t("login")} />
        </Link>
        <Link href="/forgot-password" asChild>
          <Button label={t("forgotPassword")} variant="ghost" />
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing["2xl"]
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    lineHeight: typography.lineHeight.xl,
    fontWeight: typography.weight.bold
  },
  form: {
    gap: spacing.lg
  }
});
