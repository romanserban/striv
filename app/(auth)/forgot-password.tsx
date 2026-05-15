import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing, typography } from "@/theme";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <Text style={styles.title}>{t("auth.forgotTitle")}</Text>
      <View style={styles.form}>
        <Input label={t("email")} autoCapitalize="none" keyboardType="email-address" />
        <Button label={t("forgotPassword")} />
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
  form: {
    gap: spacing.lg
  }
});
