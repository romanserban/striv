import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { coachProfileSchema, type CoachProfileFormValues } from "@/features/settings/profileSchemas";
import { authService } from "@/services/auth";
import { profilesService } from "@/services/profiles";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";

export default function CoachSettingsScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);
  const resetAuth = useAuthStore((state) => state.resetAuth);
  const userId = session?.user.id;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CoachProfileFormValues>({
    resolver: zodResolver(coachProfileSchema),
    defaultValues: {
      fullName: profile?.full_name ?? "",
      bio: "",
      specialty: ""
    }
  });
  const coachProfileQuery = useQuery({
    queryKey: ["coachProfile", userId],
    queryFn: () => profilesService.getCoachProfile(userId ?? ""),
    enabled: Boolean(userId)
  });
  const saveMutation = useMutation({
    mutationFn: (values: CoachProfileFormValues) => {
      if (!userId) {
        throw new Error(t("errors.generic"));
      }

      return profilesService.updateCoachProfile({
        userId,
        ...values
      });
    },
    onSuccess: ({ profile: updatedProfile }) => {
      setProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["coachProfile", userId] });
    }
  });
  const logoutMutation = useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      resetAuth();
      router.replace("/welcome");
    }
  });

  useEffect(() => {
    reset({
      fullName: profile?.full_name ?? "",
      bio: coachProfileQuery.data?.bio ?? "",
      specialty: coachProfileQuery.data?.specialty ?? ""
    });
  }, [coachProfileQuery.data, profile?.full_name, reset]);

  const onSubmit = (values: CoachProfileFormValues) => {
    saveMutation.mutate(values);
  };

  return (
    <PlaceholderScreen titleKey="settings">
      <Card>
        {coachProfileQuery.isLoading ? (
          <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} />
        ) : (
          <View style={styles.form}>
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
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label={t("bio")} multiline onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
            <Controller
              control={control}
              name="specialty"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label={t("specialty")} onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
            {coachProfileQuery.data?.invite_code ? (
              <View style={styles.inviteBox}>
                <Text style={styles.inviteLabel}>{t("inviteCode")}</Text>
                <Text style={styles.inviteCode}>{coachProfileQuery.data.invite_code}</Text>
              </View>
            ) : null}
            {saveMutation.error ? <Text style={styles.error}>{saveMutation.error.message}</Text> : null}
            {saveMutation.isSuccess ? <Text style={styles.success}>{t("profileSaved")}</Text> : null}
            <Button label={t("save")} loading={saveMutation.isPending} onPress={handleSubmit(onSubmit)} />
            <Button
              label={t("logout")}
              loading={logoutMutation.isPending}
              onPress={() => logoutMutation.mutate()}
              variant="ghost"
            />
          </View>
        )}
      </Card>
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg
  },
  inviteBox: {
    gap: spacing.xs
  },
  inviteLabel: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.medium
  },
  inviteCode: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold
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
