import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { progressEntrySchema, type ProgressEntryFormValues } from "@/features/progress/progressSchemas";
import { profilesService } from "@/services/profiles";
import { progressService } from "@/services/progress";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";

const toOptionalNumber = (value: string) => (value.trim() ? Number(value) : null);

export default function ClientProgressScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);
  const userId = session?.user.id;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProgressEntryFormValues>({
    resolver: zodResolver(progressEntrySchema),
    defaultValues: {
      weightKg: "",
      waistCm: "",
      chestCm: "",
      hipsCm: "",
      armCm: "",
      energyLevel: "",
      notes: ""
    }
  });
  const clientProfileQuery = useQuery({
    queryKey: ["clientProfile", userId],
    queryFn: () => profilesService.getClientProfile(userId ?? ""),
    enabled: Boolean(userId)
  });
  const progressEntriesQuery = useQuery({
    queryKey: ["progressEntries"],
    queryFn: progressService.listProgressEntries
  });
  const progressPhotosQuery = useQuery({
    queryKey: ["progressPhotos"],
    queryFn: progressService.listProgressPhotos
  });
  const saveProgressMutation = useMutation({
    mutationFn: (values: ProgressEntryFormValues) => {
      const clientId = clientProfileQuery.data?.id;
      if (!clientId) {
        throw new Error(t("errors.generic"));
      }

      return progressService.createProgressEntry({
        clientId,
        weightKg: toOptionalNumber(values.weightKg),
        waistCm: toOptionalNumber(values.waistCm),
        chestCm: toOptionalNumber(values.chestCm),
        hipsCm: toOptionalNumber(values.hipsCm),
        armCm: toOptionalNumber(values.armCm),
        energyLevel: values.energyLevel ? Number(values.energyLevel) : null,
        notes: values.notes
      });
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["progressEntries"] });
    }
  });
  const uploadPhotoMutation = useMutation({
    mutationFn: async () => {
      const clientId = clientProfileQuery.data?.id;
      if (!clientId) {
        throw new Error(t("errors.generic"));
      }

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        throw new Error(t("photoPermissionDenied"));
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.75
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      return progressService.uploadProgressPhoto({
        clientId,
        uri: result.assets[0].uri,
        mimeType: result.assets[0].mimeType,
        photoType: "progress"
      });
    },
    onSuccess: (photo) => {
      if (photo) {
        queryClient.invalidateQueries({ queryKey: ["progressPhotos"] });
      }
    }
  });

  const onSubmit = (values: ProgressEntryFormValues) => {
    saveProgressMutation.mutate(values);
  };

  return (
    <PlaceholderScreen titleKey="progress">
      <Card>
        <View style={styles.form}>
          <Controller
            control={control}
            name="weightKg"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("weightKg")}
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.weightKg?.message ? t(errors.weightKg.message) : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="waistCm"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("waistCm")}
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.waistCm?.message ? t(errors.waistCm.message) : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="chestCm"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("chestCm")}
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.chestCm?.message ? t(errors.chestCm.message) : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="hipsCm"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("hipsCm")}
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.hipsCm?.message ? t(errors.hipsCm.message) : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="armCm"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("armCm")}
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.armCm?.message ? t(errors.armCm.message) : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="energyLevel"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("energyLevel")}
                keyboardType="number-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.energyLevel?.message ? t(errors.energyLevel.message) : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label={t("notes")} multiline onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          {saveProgressMutation.error ? <Text style={styles.error}>{saveProgressMutation.error.message}</Text> : null}
          {saveProgressMutation.isSuccess ? <Text style={styles.success}>{t("progressSaved")}</Text> : null}
          {clientProfileQuery.isError ? (
            <ErrorState
              title={t("errors.title")}
              message={clientProfileQuery.error.message}
              retryLabel={t("retry")}
              onRetry={() => clientProfileQuery.refetch()}
            />
          ) : null}
          <Button
            label={t("saveProgress")}
            disabled={!clientProfileQuery.data?.id}
            loading={saveProgressMutation.isPending}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </Card>
      <Card>
        <View style={styles.form}>
          <Text style={styles.name}>{t("progressPhotos")}</Text>
          {uploadPhotoMutation.error ? <Text style={styles.error}>{uploadPhotoMutation.error.message}</Text> : null}
          {uploadPhotoMutation.isSuccess ? <Text style={styles.success}>{t("photoUploaded")}</Text> : null}
          <Button
            label={t("uploadPhoto")}
            disabled={!clientProfileQuery.data?.id}
            loading={uploadPhotoMutation.isPending}
            onPress={() => uploadPhotoMutation.mutate()}
          />
        </View>
      </Card>
      {progressPhotosQuery.isLoading ? (
        <Card>
          <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} />
        </Card>
      ) : null}
      {progressPhotosQuery.isError ? (
        <Card>
          <ErrorState
            title={t("errors.title")}
            message={progressPhotosQuery.error.message}
            retryLabel={t("retry")}
            onRetry={() => progressPhotosQuery.refetch()}
          />
        </Card>
      ) : null}
      {!progressPhotosQuery.isLoading && !progressPhotosQuery.isError && !progressPhotosQuery.data?.length ? (
        <Card>
          <EmptyState title={t("noProgressPhotos")} body={t("placeholder.emptyBody")} />
        </Card>
      ) : null}
      <View style={styles.list}>
        {progressPhotosQuery.data?.map((photo) => (
          <Card key={photo.id}>
            <View style={styles.entry}>
              {photo.signed_url ? <Image source={{ uri: photo.signed_url }} style={styles.photo} /> : null}
              <Text style={styles.meta}>{new Date(photo.created_at).toLocaleDateString()}</Text>
            </View>
          </Card>
        ))}
      </View>
      {progressEntriesQuery.isLoading ? (
        <Card>
          <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} />
        </Card>
      ) : null}
      {progressEntriesQuery.isError ? (
        <Card>
          <ErrorState
            title={t("errors.title")}
            message={progressEntriesQuery.error.message}
            retryLabel={t("retry")}
            onRetry={() => progressEntriesQuery.refetch()}
          />
        </Card>
      ) : null}
      {!progressEntriesQuery.isLoading && !progressEntriesQuery.isError && !progressEntriesQuery.data?.length ? (
        <Card>
          <EmptyState title={t("noProgressEntries")} body={t("placeholder.emptyBody")} />
        </Card>
      ) : null}
      <View style={styles.list}>
        {progressEntriesQuery.data?.map((entry) => (
          <Card key={entry.id}>
            <View style={styles.entry}>
              <Text style={styles.name}>{new Date(entry.created_at).toLocaleDateString()}</Text>
              {entry.weight_kg ? <Text style={styles.meta}>{`${t("weightKg")}: ${entry.weight_kg}`}</Text> : null}
              {entry.waist_cm ? <Text style={styles.meta}>{`${t("waistCm")}: ${entry.waist_cm}`}</Text> : null}
              {entry.energy_level ? (
                <Text style={styles.meta}>{`${t("energyLevel")}: ${entry.energy_level}`}</Text>
              ) : null}
              {entry.notes ? <Text style={styles.meta}>{entry.notes}</Text> : null}
            </View>
          </Card>
        ))}
      </View>
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg
  },
  list: {
    gap: spacing.md
  },
  entry: {
    gap: spacing.xs
  },
  photo: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: colors.surface
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold
  },
  meta: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md
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
