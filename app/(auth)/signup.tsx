import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { getRoleHomeRoute } from "@/features/auth/routes";
import { signupSchema, type SignupFormValues } from "@/features/auth/schemas";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";
import type { UserRole } from "@/types/user";

export default function SignupScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ role?: UserRole }>();
  const role = params.role === "coach" || params.role === "client" ? params.role : null;
  const setSession = useAuthStore((state) => state.setSession);
  const setProfile = useAuthStore((state) => state.setProfile);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });

  const signupMutation = useMutation({
    mutationFn: (values: SignupFormValues) => {
      if (!role) {
        throw new Error(t("auth.selectRoleFirst"));
      }

      return authService.signup({
        ...values,
        role
      });
    },
    onSuccess: async (data) => {
      setSession(data.session);

      if (!data.session || !data.user) {
        router.replace("/login");
        return;
      }

      const profile = await authService.getProfile(data.user.id);
      setProfile(profile);
      router.replace(getRoleHomeRoute(profile?.role ?? role ?? "client"));
    }
  });

  const onSubmit = (values: SignupFormValues) => {
    signupMutation.mutate(values);
  };

  return (
    <Screen>
      <Text style={styles.title}>{t("auth.signupTitle")}</Text>
      <View style={styles.form}>
        {!role ? <Text style={styles.helper}>{t("auth.selectRoleFirst")}</Text> : null}
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t("fullName")}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.fullName?.message ? t(errors.fullName.message) : undefined}
            />
          )}
        />
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
        {signupMutation.error ? <Text style={styles.error}>{signupMutation.error.message}</Text> : null}
        <Button
          label={role ? t("signup") : t("chooseRole")}
          loading={signupMutation.isPending}
          onPress={role ? handleSubmit(onSubmit) : () => router.push("/choose-role")}
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
  helper: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md
  },
  error: {
    color: colors.error,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  }
});
