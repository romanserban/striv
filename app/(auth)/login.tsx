import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { getRoleHomeRoute } from "@/features/auth/routes";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";

export default function LoginScreen() {
  const { t } = useTranslation();
  const setSession = useAuthStore((state) => state.setSession);
  const setProfile = useAuthStore((state) => state.setProfile);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      setSession(data.session);

      if (!data.user) {
        return;
      }

      const profile = await authService.getProfile(data.user.id);
      setProfile(profile);

      if (profile?.role) {
        router.replace(getRoleHomeRoute(profile.role));
        return;
      }

      router.replace("/choose-role");
    }
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{t("auth.loginTitle")}</Text>
      </View>
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
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t("password")}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message ? t(errors.password.message) : undefined}
            />
          )}
        />
        {loginMutation.error ? <Text style={styles.error}>{loginMutation.error.message}</Text> : null}
        <Button label={t("login")} loading={loginMutation.isPending} onPress={handleSubmit(onSubmit)} />
        <Button label={t("forgotPassword")} variant="ghost" onPress={() => router.push("/forgot-password")} />
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
  },
  error: {
    color: colors.error,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  }
});
