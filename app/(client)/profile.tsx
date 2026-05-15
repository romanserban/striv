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
import { clientProfileSchema, type ClientProfileFormValues } from "@/features/settings/profileSchemas";
import { authService } from "@/services/auth";
import { profilesService } from "@/services/profiles";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";

const toOptionalNumber = (value: string) => (value.trim() ? Number(value) : null);

export default function ClientProfileScreen() {
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
  } = useForm<ClientProfileFormValues>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      fullName: profile?.full_name ?? "",
      goal: "",
      trainingLevel: "",
      heightCm: "",
      startingWeightKg: ""
    }
  });
  const clientProfileQuery = useQuery({
    queryKey: ["clientProfile", userId],
    queryFn: () => profilesService.getClientProfile(userId ?? ""),
    enabled: Boolean(userId)
  });
  const saveMutation = useMutation({
    mutationFn: (values: ClientProfileFormValues) => {
      if (!userId) {
        throw new Error(t("errors.generic"));
      }

      return profilesService.updateClientProfile({
        userId,
        fullName: values.fullName,
        goal: values.goal,
        trainingLevel: values.trainingLevel,
        heightCm: toOptionalNumber(values.heightCm),
        startingWeightKg: toOptionalNumber(values.startingWeightKg)
      });
    },
    onSuccess: ({ profile: updatedProfile }) => {
      setProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["clientProfile", userId] });
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
      goal: clientProfileQuery.data?.goal ?? "",
      trainingLevel: clientProfileQuery.data?.training_level ?? "",
      heightCm: clientProfileQuery.data?.height_cm?.toString() ?? "",
      startingWeightKg: clientProfileQuery.data?.starting_weight_kg?.toString() ?? ""
    });
  }, [clientProfileQuery.data, profile?.full_name, reset]);

  const onSubmit = (values: ClientProfileFormValues) => {
    saveMutation.mutate(values);
  };

  return (
    <PlaceholderScreen titleKey="profile">
      <Card>
        {clientProfileQuery.isLoading ? (
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
              name="goal"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t("goal")}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.goal?.message ? t(errors.goal.message) : undefined}
                />
              )}
            />
            <Controller
              control={control}
              name="trainingLevel"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t("trainingLevel")}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.trainingLevel?.message ? t(errors.trainingLevel.message) : undefined}
                />
              )}
            />
            <Controller
              control={control}
              name="heightCm"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t("heightCm")}
                  keyboardType="decimal-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.heightCm?.message ? t(errors.heightCm.message) : undefined}
                />
              )}
            />
            <Controller
              control={control}
              name="startingWeightKg"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t("startingWeightKg")}
                  keyboardType="decimal-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.startingWeightKg?.message ? t(errors.startingWeightKg.message) : undefined}
                />
              )}
            />
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
