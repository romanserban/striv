import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/features/auth/schemas";
import { authService } from "@/services/auth";
import { colors, spacing, typography } from "@/theme";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });
  const resetMutation = useMutation({
    mutationFn: authService.resetPassword
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    resetMutation.mutate(values);
  };

  return (
    <Screen>
      <Text style={styles.title}>{t("auth.forgotTitle")}</Text>
      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t("email")}
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message ? t(errors.email.message) : undefined}
            />
          )}
        />
        {resetMutation.error ? <Text style={styles.error}>{resetMutation.error.message}</Text> : null}
        {resetMutation.isSuccess ? <Text style={styles.success}>{t("auth.resetSent")}</Text> : null}
        <Button
          label={t("forgotPassword")}
          loading={resetMutation.isPending}
          onPress={handleSubmit(onSubmit)}
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
  form: {
    gap: spacing.lg
  },
  error: {
    color: colors.error,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  success: {
    color: colors.success,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  }
});
