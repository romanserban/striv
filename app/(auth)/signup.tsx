import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing, typography } from "@/theme";

export default function SignupScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <Text style={styles.title}>{t("auth.signupTitle")}</Text>
      <View style={styles.form}>
        <Input label={t("name")} />
        <Input label={t("email")} autoCapitalize="none" keyboardType="email-address" />
        <Input label={t("password")} secureTextEntry />
        <Link href="/choose-role" asChild>
          <Button label={t("chooseRole")} />
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
  form: {
    gap: spacing.lg
  }
});
