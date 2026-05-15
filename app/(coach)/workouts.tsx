import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import {
  workoutTemplateExerciseSchema,
  workoutTemplateSchema,
  type WorkoutTemplateExerciseFormValues,
  type WorkoutTemplateFormValues
} from "@/features/workouts/workoutSchemas";
import { exercisesService } from "@/services/exercises";
import { profilesService } from "@/services/profiles";
import { workoutsService } from "@/services/workouts";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";

export default function CoachWorkoutsScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);
  const userId = session?.user.id;
  const [selectedWorkoutTemplateId, setSelectedWorkoutTemplateId] = useState<string | null>(null);
  const [editingWorkoutTemplateId, setEditingWorkoutTemplateId] = useState<string | null>(null);
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
  const {
    control: workoutControl,
    handleSubmit: handleWorkoutSubmit,
    reset: resetWorkout,
    formState: { errors: workoutErrors }
  } = useForm<WorkoutTemplateFormValues>({
    resolver: zodResolver(workoutTemplateSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });
  const {
    control: workoutExerciseControl,
    handleSubmit: handleWorkoutExerciseSubmit,
    formState: { errors: workoutExerciseErrors }
  } = useForm<WorkoutTemplateExerciseFormValues>({
    resolver: zodResolver(workoutTemplateExerciseSchema),
    defaultValues: {
      sets: "3",
      reps: "10",
      targetWeight: "",
      restSeconds: "90",
      tempo: "",
      notes: ""
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
  const workoutTemplatesQuery = useQuery({
    queryKey: ["workoutTemplates"],
    queryFn: workoutsService.listWorkoutTemplates
  });
  const workoutTemplateExercisesQuery = useQuery({
    queryKey: ["workoutTemplateExercises"],
    queryFn: workoutsService.listWorkoutTemplateExercises
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
  const createWorkoutMutation = useMutation({
    mutationFn: (values: WorkoutTemplateFormValues) => {
      const coachId = coachProfileQuery.data?.id;
      if (!coachId) {
        throw new Error(t("errors.generic"));
      }

      return workoutsService.createWorkoutTemplate({
        coachId,
        name: values.name,
        description: values.description
      });
    },
    onSuccess: () => {
      resetWorkout();
      queryClient.invalidateQueries({ queryKey: ["workoutTemplates"] });
    }
  });
  const updateWorkoutMutation = useMutation({
    mutationFn: (values: WorkoutTemplateFormValues) => {
      if (!editingWorkoutTemplateId) {
        throw new Error(t("errors.generic"));
      }

      return workoutsService.updateWorkoutTemplate({
        workoutTemplateId: editingWorkoutTemplateId,
        name: values.name,
        description: values.description
      });
    },
    onSuccess: () => {
      setEditingWorkoutTemplateId(null);
      resetWorkout();
      queryClient.invalidateQueries({ queryKey: ["workoutTemplates"] });
    }
  });
  const duplicateWorkoutMutation = useMutation({
    mutationFn: workoutsService.duplicateWorkoutTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutTemplates"] });
      queryClient.invalidateQueries({ queryKey: ["workoutTemplateExercises"] });
    }
  });
  const deleteWorkoutMutation = useMutation({
    mutationFn: workoutsService.deleteWorkoutTemplate,
    onSuccess: (_, workoutTemplateId) => {
      if (selectedWorkoutTemplateId === workoutTemplateId) {
        setSelectedWorkoutTemplateId(null);
      }
      if (editingWorkoutTemplateId === workoutTemplateId) {
        setEditingWorkoutTemplateId(null);
        resetWorkout();
      }
      queryClient.invalidateQueries({ queryKey: ["workoutTemplates"] });
      queryClient.invalidateQueries({ queryKey: ["workoutTemplateExercises"] });
    }
  });
  const addExerciseMutation = useMutation({
    mutationFn: ({
      exerciseId,
      values
    }: {
      exerciseId: string;
      values: WorkoutTemplateExerciseFormValues;
    }) => {
      if (!selectedWorkoutTemplateId) {
        throw new Error(t("selectWorkout"));
      }

      const currentExerciseCount =
        workoutTemplateExercisesQuery.data?.filter(
          (exercise) => exercise.workout_template_id === selectedWorkoutTemplateId
        ).length ?? 0;

      return workoutsService.addExerciseToWorkoutTemplate({
        workoutTemplateId: selectedWorkoutTemplateId,
        exerciseId,
        orderIndex: currentExerciseCount + 1,
        sets: Number(values.sets),
        reps: values.reps,
        targetWeight: values.targetWeight,
        restSeconds: values.restSeconds ? Number(values.restSeconds) : null,
        tempo: values.tempo,
        notes: values.notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutTemplateExercises"] });
    }
  });

  const onSubmit = (values: ExerciseFormValues) => {
    createExerciseMutation.mutate(values);
  };

  const onWorkoutSubmit = (values: WorkoutTemplateFormValues) => {
    if (editingWorkoutTemplateId) {
      updateWorkoutMutation.mutate(values);
      return;
    }

    createWorkoutMutation.mutate(values);
  };

  const editWorkoutTemplate = (templateId: string) => {
    const template = workoutTemplatesQuery.data?.find((candidate) => candidate.id === templateId);
    if (!template) {
      return;
    }

    setEditingWorkoutTemplateId(template.id);
    resetWorkout({
      name: template.name,
      description: template.description ?? ""
    });
  };

  const cancelWorkoutEdit = () => {
    setEditingWorkoutTemplateId(null);
    resetWorkout();
  };

  const addExerciseToSelectedWorkout = (exerciseId: string) => {
    handleWorkoutExerciseSubmit((values) => {
      addExerciseMutation.mutate({ exerciseId, values });
    })();
  };

  const selectedWorkoutTemplate = workoutTemplatesQuery.data?.find(
    (template) => template.id === selectedWorkoutTemplateId
  );

  return (
    <PlaceholderScreen titleKey="workouts">
      <Card>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>{t("workouts")}</Text>
          <Controller
            control={workoutControl}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("workoutName")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={workoutErrors.name?.message ? t(workoutErrors.name.message) : undefined}
              />
            )}
          />
          <Controller
            control={workoutControl}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label={t("description")} multiline onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          {createWorkoutMutation.error ? <Text style={styles.error}>{createWorkoutMutation.error.message}</Text> : null}
          {updateWorkoutMutation.error ? <Text style={styles.error}>{updateWorkoutMutation.error.message}</Text> : null}
          {createWorkoutMutation.isSuccess ? <Text style={styles.success}>{t("workoutSaved")}</Text> : null}
          {updateWorkoutMutation.isSuccess ? <Text style={styles.success}>{t("workoutUpdated")}</Text> : null}
          <Button
            label={editingWorkoutTemplateId ? t("save") : t("createWorkout")}
            loading={createWorkoutMutation.isPending || updateWorkoutMutation.isPending}
            onPress={handleWorkoutSubmit(onWorkoutSubmit)}
          />
          {editingWorkoutTemplateId ? (
            <Button label={t("cancel")} onPress={cancelWorkoutEdit} variant="ghost" />
          ) : null}
        </View>
      </Card>
      {workoutTemplatesQuery.isLoading ? (
        <Card>
          <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} />
        </Card>
      ) : null}
      {!workoutTemplatesQuery.isLoading && !workoutTemplatesQuery.data?.length ? (
        <Card>
          <EmptyState title={t("noWorkoutTemplates")} body={t("placeholder.emptyBody")} />
        </Card>
      ) : null}
      <View style={styles.list}>
        {workoutTemplatesQuery.data?.map((template) => (
          <Card key={template.id}>
            <View style={styles.exercise}>
              <Text style={styles.name}>{template.name}</Text>
              {template.description ? <Text style={styles.meta}>{template.description}</Text> : null}
              <Button
                label={t("selectWorkout")}
                onPress={() => setSelectedWorkoutTemplateId(template.id)}
                variant={selectedWorkoutTemplateId === template.id ? "primary" : "secondary"}
              />
              <View style={styles.actions}>
                <Button label={t("edit")} onPress={() => editWorkoutTemplate(template.id)} variant="secondary" />
                <Button
                  label={t("duplicate")}
                  loading={duplicateWorkoutMutation.isPending}
                  onPress={() => duplicateWorkoutMutation.mutate(template.id)}
                  variant="secondary"
                />
                <Button
                  label={t("delete")}
                  loading={deleteWorkoutMutation.isPending}
                  onPress={() => deleteWorkoutMutation.mutate(template.id)}
                  variant="ghost"
                />
              </View>
              {workoutTemplateExercisesQuery.data
                ?.filter((exercise) => exercise.workout_template_id === template.id)
                .map((exercise) => (
                  <View key={exercise.id} style={styles.templateExercise}>
                    <Text style={styles.meta}>
                      {exercise.order_index}. {exercise.exercises?.name ?? t("exerciseName")}
                    </Text>
                    <Text style={styles.meta}>
                      {exercise.sets} x {exercise.reps}
                    </Text>
                  </View>
                ))}
            </View>
          </Card>
        ))}
      </View>
      <Card>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>{t("selectedWorkout")}</Text>
          <Text style={styles.meta}>{selectedWorkoutTemplate?.name ?? t("selectWorkout")}</Text>
          {duplicateWorkoutMutation.isSuccess ? <Text style={styles.success}>{t("workoutDuplicated")}</Text> : null}
          {deleteWorkoutMutation.isSuccess ? <Text style={styles.success}>{t("workoutDeleted")}</Text> : null}
          {duplicateWorkoutMutation.error ? (
            <Text style={styles.error}>{duplicateWorkoutMutation.error.message}</Text>
          ) : null}
          {deleteWorkoutMutation.error ? <Text style={styles.error}>{deleteWorkoutMutation.error.message}</Text> : null}
          <Controller
            control={workoutExerciseControl}
            name="sets"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("sets")}
                keyboardType="number-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={workoutExerciseErrors.sets?.message ? t(workoutExerciseErrors.sets.message) : undefined}
              />
            )}
          />
          <Controller
            control={workoutExerciseControl}
            name="reps"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("reps")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={workoutExerciseErrors.reps?.message ? t(workoutExerciseErrors.reps.message) : undefined}
              />
            )}
          />
          <Controller
            control={workoutExerciseControl}
            name="targetWeight"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label={t("targetWeight")} onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          <Controller
            control={workoutExerciseControl}
            name="restSeconds"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("restSeconds")}
                keyboardType="number-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={
                  workoutExerciseErrors.restSeconds?.message
                    ? t(workoutExerciseErrors.restSeconds.message)
                    : undefined
                }
              />
            )}
          />
          {addExerciseMutation.error ? <Text style={styles.error}>{addExerciseMutation.error.message}</Text> : null}
          {addExerciseMutation.isSuccess ? <Text style={styles.success}>{t("exerciseAdded")}</Text> : null}
        </View>
      </Card>
      <Card>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>{t("exerciseName")}</Text>
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
              <Button
                label={t("addToWorkout")}
                loading={addExerciseMutation.isPending}
                onPress={() => addExerciseToSelectedWorkout(exercise.id)}
                variant="secondary"
              />
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
  templateExercise: {
    gap: spacing.xs,
    paddingTop: spacing.sm
  },
  actions: {
    gap: spacing.sm
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold
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
