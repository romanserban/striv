import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { assignmentsService } from "@/services/assignments";
import { workoutLogsService } from "@/services/workoutLogs";
import { colors, spacing, typography } from "@/theme";
import type { WorkoutSetLog } from "@/types/workoutLog";

type SetDraft = {
  actualReps: string;
  actualWeight: string;
};

type SetKeyInput = {
  exerciseId: string;
  setNumber: number;
};

function createSetKey({ exerciseId, setNumber }: SetKeyInput) {
  return `${exerciseId}:${setNumber}`;
}

function parseOptionalNumber(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export default function ClientWorkoutDetailScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ assignedWorkoutId?: string | string[] }>();
  const assignedWorkoutId = Array.isArray(params.assignedWorkoutId)
    ? params.assignedWorkoutId[0]
    : params.assignedWorkoutId;
  const [drafts, setDrafts] = useState<Record<string, SetDraft>>({});

  const workoutQuery = useQuery({
    enabled: Boolean(assignedWorkoutId),
    queryKey: ["clientAssignedWorkoutDetail", assignedWorkoutId],
    queryFn: () => assignmentsService.getClientAssignedWorkoutDetail(assignedWorkoutId ?? "")
  });
  const setLogsQuery = useQuery({
    enabled: Boolean(assignedWorkoutId),
    queryKey: ["workoutSetLogs", assignedWorkoutId],
    queryFn: () => workoutLogsService.listSetLogs(assignedWorkoutId ?? "")
  });
  const saveSetMutation = useMutation({
    mutationFn: workoutLogsService.saveSetLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutSetLogs", assignedWorkoutId] });
      queryClient.invalidateQueries({ queryKey: ["clientAssignedWorkouts"] });
    }
  });

  const setLogsByKey = useMemo(() => {
    const logs = new Map<string, WorkoutSetLog>();
    setLogsQuery.data?.forEach((log) => {
      logs.set(createSetKey({ exerciseId: log.exercise_id, setNumber: log.set_number }), log);
    });
    return logs;
  }, [setLogsQuery.data]);

  useEffect(() => {
    if (!setLogsQuery.data?.length) {
      return;
    }

    setDrafts((currentDrafts) => {
      const nextDrafts = { ...currentDrafts };
      setLogsQuery.data.forEach((log) => {
        const setKey = createSetKey({ exerciseId: log.exercise_id, setNumber: log.set_number });
        nextDrafts[setKey] = {
          actualReps: log.actual_reps?.toString() ?? nextDrafts[setKey]?.actualReps ?? "",
          actualWeight: log.actual_weight?.toString() ?? nextDrafts[setKey]?.actualWeight ?? ""
        };
      });
      return nextDrafts;
    });
  }, [setLogsQuery.data]);

  function updateDraft(setKey: string, field: keyof SetDraft, value: string) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [setKey]: {
        actualReps: currentDrafts[setKey]?.actualReps ?? "",
        actualWeight: currentDrafts[setKey]?.actualWeight ?? "",
        [field]: value
      }
    }));
  }

  function saveSet(exerciseId: string, setNumber: number) {
    if (!assignedWorkoutId) {
      return;
    }

    const setKey = createSetKey({ exerciseId, setNumber });
    const draft = drafts[setKey] ?? { actualReps: "", actualWeight: "" };
    saveSetMutation.mutate({
      assignedWorkoutId,
      exerciseId,
      setNumber,
      actualReps: parseOptionalNumber(draft.actualReps),
      actualWeight: parseOptionalNumber(draft.actualWeight),
      completed: true
    });
  }

  const exercises = workoutQuery.data?.workout_templates?.workout_template_exercises ?? [];

  return (
    <PlaceholderScreen titleKey="workoutDetails">
      {workoutQuery.isLoading || setLogsQuery.isLoading ? (
        <Card>
          <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} />
        </Card>
      ) : null}
      {!assignedWorkoutId || workoutQuery.isError ? (
        <Card>
          <EmptyState title={t("errors.generic")} body={t("placeholder.emptyBody")} />
        </Card>
      ) : null}
      {workoutQuery.data ? (
        <Card>
          <View style={styles.header}>
            <Text style={styles.title}>{workoutQuery.data.workout_templates?.name ?? t("workouts")}</Text>
            {workoutQuery.data.workout_templates?.description ? (
              <Text style={styles.meta}>{workoutQuery.data.workout_templates.description}</Text>
            ) : null}
            <Text style={styles.meta}>{workoutQuery.data.scheduled_date}</Text>
          </View>
        </Card>
      ) : null}
      {!workoutQuery.isLoading && !exercises.length ? (
        <Card>
          <EmptyState title={t("placeholder.emptyTitle")} body={t("placeholder.emptyBody")} />
        </Card>
      ) : null}
      <View style={styles.list}>
        {exercises.map((exercise) => (
          <Card key={exercise.id}>
            <View style={styles.exercise}>
              <View style={styles.header}>
                <Text style={styles.exerciseName}>{exercise.exercises?.name ?? t("exerciseName")}</Text>
                <Text style={styles.meta}>
                  {t("targetSets", { count: exercise.sets })} - {t("targetReps", { reps: exercise.reps })}
                </Text>
                {exercise.target_weight ? (
                  <Text style={styles.meta}>{t("targetWeightValue", { weight: exercise.target_weight })}</Text>
                ) : null}
              </View>
              {Array.from({ length: exercise.sets }, (_, index) => {
                const setNumber = index + 1;
                const setKey = createSetKey({ exerciseId: exercise.exercise_id, setNumber });
                const draft = drafts[setKey] ?? { actualReps: "", actualWeight: "" };
                const savedLog = setLogsByKey.get(setKey);

                return (
                  <View key={setKey} style={styles.setRow}>
                    <View style={styles.setHeader}>
                      <Text style={styles.setTitle}>{t("setNumber", { number: setNumber })}</Text>
                      {savedLog?.completed ? <Text style={styles.saved}>{t("setSaved")}</Text> : null}
                    </View>
                    <View style={styles.inputs}>
                      <Input
                        label={t("actualReps")}
                        keyboardType="number-pad"
                        value={draft.actualReps}
                        onChangeText={(value) => updateDraft(setKey, "actualReps", value)}
                      />
                      <Input
                        label={t("actualWeight")}
                        keyboardType="decimal-pad"
                        value={draft.actualWeight}
                        onChangeText={(value) => updateDraft(setKey, "actualWeight", value)}
                      />
                    </View>
                    <Button
                      label={t("saveSet")}
                      loading={saveSetMutation.isPending}
                      onPress={() => saveSet(exercise.exercise_id, setNumber)}
                      variant="secondary"
                    />
                  </View>
                );
              })}
            </View>
          </Card>
        ))}
      </View>
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md
  },
  header: {
    gap: spacing.xs
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold
  },
  meta: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  exercise: {
    gap: spacing.lg
  },
  exerciseName: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.weight.bold
  },
  setRow: {
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md
  },
  setHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  setTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.weight.semibold
  },
  saved: {
    color: colors.success,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.semibold
  },
  inputs: {
    gap: spacing.md
  }
});
