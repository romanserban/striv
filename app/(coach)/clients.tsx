import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { workoutAssignmentSchema, type WorkoutAssignmentFormValues } from "@/features/workouts/assignmentSchemas";
import { assignmentsService } from "@/services/assignments";
import { profilesService } from "@/services/profiles";
import { workoutsService } from "@/services/workouts";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";

export default function CoachClientsScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);
  const userId = session?.user.id;
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedWorkoutTemplateId, setSelectedWorkoutTemplateId] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<WorkoutAssignmentFormValues>({
    resolver: zodResolver(workoutAssignmentSchema),
    defaultValues: {
      scheduledDate: new Date().toISOString().slice(0, 10)
    }
  });
  const clientsQuery = useQuery({
    queryKey: ["assignedClients"],
    queryFn: profilesService.getAssignedClients
  });
  const coachProfileQuery = useQuery({
    queryKey: ["coachProfile", userId],
    queryFn: () => profilesService.getCoachProfile(userId ?? ""),
    enabled: Boolean(userId)
  });
  const workoutTemplatesQuery = useQuery({
    queryKey: ["workoutTemplates"],
    queryFn: workoutsService.listWorkoutTemplates
  });
  const assignedWorkoutsQuery = useQuery({
    queryKey: ["coachAssignedWorkouts"],
    queryFn: assignmentsService.listCoachAssignedWorkouts
  });
  const assignWorkoutMutation = useMutation({
    mutationFn: (values: WorkoutAssignmentFormValues) => {
      const coachId = coachProfileQuery.data?.id;

      if (!coachId || !selectedClientId || !selectedWorkoutTemplateId) {
        throw new Error(t("errors.generic"));
      }

      return assignmentsService.createAssignedWorkout({
        coachId,
        clientId: selectedClientId,
        workoutTemplateId: selectedWorkoutTemplateId,
        scheduledDate: values.scheduledDate
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coachAssignedWorkouts"] });
    }
  });

  const selectedClient = clientsQuery.data?.find((client) => client.client_profile_id === selectedClientId);
  const selectedWorkoutTemplate = workoutTemplatesQuery.data?.find(
    (template) => template.id === selectedWorkoutTemplateId
  );

  const onAssignWorkout = (values: WorkoutAssignmentFormValues) => {
    assignWorkoutMutation.mutate(values);
  };

  return (
    <PlaceholderScreen titleKey="clients">
      {clientsQuery.isLoading ? (
        <Card>
          <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} />
        </Card>
      ) : null}
      {!clientsQuery.isLoading && !clientsQuery.data?.length ? (
        <Card>
          <EmptyState title={t("noClients")} body={t("placeholder.emptyBody")} />
        </Card>
      ) : null}
      <View style={styles.list}>
        {clientsQuery.data?.map((client) => (
          <Card key={client.client_profile_id}>
            <View style={styles.client}>
              <Text style={styles.name}>{client.client_full_name}</Text>
              <Text style={styles.meta}>{client.goal ?? t("goal")}</Text>
              <Text style={styles.meta}>{client.training_level ?? t("trainingLevel")}</Text>
              <Button
                label={t("selectClient")}
                onPress={() => setSelectedClientId(client.client_profile_id)}
                variant={selectedClientId === client.client_profile_id ? "primary" : "secondary"}
              />
            </View>
          </Card>
        ))}
      </View>
      <Card>
        <View style={styles.client}>
          <Text style={styles.name}>{t("assignWorkout")}</Text>
          <Text style={styles.meta}>
            {t("selectedClient")}: {selectedClient?.client_full_name ?? t("selectClient")}
          </Text>
          <Text style={styles.meta}>
            {t("selectedWorkout")}: {selectedWorkoutTemplate?.name ?? t("selectWorkout")}
          </Text>
          <View style={styles.list}>
            {workoutTemplatesQuery.data?.map((template) => (
              <Button
                key={template.id}
                label={template.name}
                onPress={() => setSelectedWorkoutTemplateId(template.id)}
                variant={selectedWorkoutTemplateId === template.id ? "primary" : "secondary"}
              />
            ))}
          </View>
          <Controller
            control={control}
            name="scheduledDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("scheduledDate")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.scheduledDate?.message ? t(errors.scheduledDate.message) : undefined}
              />
            )}
          />
          {assignWorkoutMutation.error ? <Text style={styles.error}>{assignWorkoutMutation.error.message}</Text> : null}
          {assignWorkoutMutation.isSuccess ? <Text style={styles.success}>{t("workoutAssigned")}</Text> : null}
          <Button
            label={t("assignWorkout")}
            loading={assignWorkoutMutation.isPending}
            onPress={handleSubmit(onAssignWorkout)}
          />
        </View>
      </Card>
      <Card>
        <View style={styles.client}>
          <Text style={styles.name}>{t("assignedWorkouts")}</Text>
          {!assignedWorkoutsQuery.isLoading && !assignedWorkoutsQuery.data?.length ? (
            <Text style={styles.meta}>{t("noAssignedWorkouts")}</Text>
          ) : null}
          {assignedWorkoutsQuery.data?.map((workout) => (
            <View key={workout.id} style={styles.assignment}>
              <Text style={styles.meta}>{workout.workout_templates?.name ?? t("workouts")}</Text>
              <Text style={styles.meta}>
                {workout.client_profiles?.profiles?.full_name ?? t("client")} - {workout.scheduled_date}
              </Text>
              <Text style={styles.status}>{workout.status}</Text>
            </View>
          ))}
        </View>
      </Card>
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md
  },
  client: {
    gap: spacing.xs
  },
  assignment: {
    gap: spacing.xs,
    paddingTop: spacing.sm
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
  },
  status: {
    color: colors.primary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.semibold
  }
});
