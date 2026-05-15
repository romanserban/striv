import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { exerciseSchema, type ExerciseFormValues } from "@/features/workouts/exerciseSchemas";
import { exercisesService } from "@/services/exercises";
import { profilesService } from "@/services/profiles";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";

export default function CoachWorkoutsScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);
  const userId = session?.user.id;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      muscleGroup: "",
      equipment: "",
      instructions: "",
      mediaUrl: ""
    }
  });
  const coachProfileQuery = useQuery({
    queryKey: ["coachProfile", userId],
    queryFn: () => profilesService.getCoachProfile(userId ?? ""),
    enabled: Boolean(userId)
  });
  const exercisesQuery = useQuery({
    queryKey: ["exercises"],
    queryFn: () => exercisesService.listExercises()
  });
  const createExerciseMutation = useMutation({
    mutationFn: (values: ExerciseFormValues) => {
      const coachId = coachProfileQuery.data?.id;
      if (!coachId) {
        throw new Error(t("errors.generic"));
      }

      return exercisesService.createCustomExercise({
        coachId,
        name: values.name,
        muscleGroup: values.muscleGroup,
        equipment: values.equipment,
        instructions: values.instructions,
        mediaUrl: values.mediaUrl
      });
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    }
  });

  const onSubmit = (values: ExerciseFormValues) => {
    createExerciseMutation.mutate(values);
  };

  return (
    <PlaceholderScreen titleKey="workouts">
      <Card>
        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("exerciseName")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message ? t(errors.name.message) : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="muscleGroup"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("muscleGroup")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.muscleGroup?.message ? t(errors.muscleGroup.message) : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="equipment"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label={t("equipment")} onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          <Controller
            control={control}
            name="instructions"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label={t("instructions")} multiline onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          {createExerciseMutation.error ? (
            <Text style={styles.error}>{createExerciseMutation.error.message}</Text>
          ) : null}
          {createExerciseMutation.isSuccess ? <Text style={styles.success}>{t("exerciseSaved")}</Text> : null}
          <Button
            label={t("createExercise")}
            loading={createExerciseMutation.isPending}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </Card>
      {exercisesQuery.isLoading ? (
        <Card>
          <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} />
        </Card>
      ) : null}
      {!exercisesQuery.isLoading && !exercisesQuery.data?.length ? (
        <Card>
          <EmptyState title={t("noExercises")} body={t("placeholder.emptyBody")} />
        </Card>
      ) : null}
      <View style={styles.list}>
        {exercisesQuery.data?.map((exercise) => (
          <Card key={exercise.id}>
            <View style={styles.exercise}>
              <Text style={styles.name}>{exercise.name}</Text>
              <Text style={styles.meta}>{exercise.muscle_group}</Text>
              {exercise.equipment ? <Text style={styles.meta}>{exercise.equipment}</Text> : null}
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
  exercise: {
    gap: spacing.xs
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
