import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  scheduledSessionSchema,
  toSessionDateTime,
  type ScheduledSessionFormValues
} from "@/features/calendar/sessionSchemas";
import { assignmentsService } from "@/services/assignments";
import { calendarService } from "@/services/calendar";
import { profilesService } from "@/services/profiles";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";
import type { ScheduledSession } from "@/types/scheduledSession";

export default function CoachCalendarScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);
  const userId = session?.user.id;
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<ScheduledSession | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ScheduledSessionFormValues>({
    resolver: zodResolver(scheduledSessionSchema),
    defaultValues: getDefaultFormValues()
  });
  const coachProfileQuery = useQuery({
    queryKey: ["coachProfile", userId],
    queryFn: () => profilesService.getCoachProfile(userId ?? ""),
    enabled: Boolean(userId)
  });
  const clientsQuery = useQuery({
    queryKey: ["assignedClients"],
    queryFn: profilesService.getAssignedClients
  });
  const sessionsQuery = useQuery({
    queryKey: ["coachSessions"],
    queryFn: calendarService.listCoachSessions
  });
  const assignedWorkoutsQuery = useQuery({
    queryKey: ["coachAssignedWorkouts"],
    queryFn: assignmentsService.listCoachAssignedWorkouts
  });
  const saveSessionMutation = useMutation({
    mutationFn: (values: ScheduledSessionFormValues) => {
      if (!selectedClientId || !coachProfileQuery.data?.id) {
        throw new Error(t("errors.generic"));
      }

      const payload = {
        title: values.title,
        description: values.description,
        sessionType: values.sessionType,
        startTime: toSessionDateTime(values.scheduledDate, values.startTime),
        endTime: toSessionDateTime(values.scheduledDate, values.endTime),
        location: values.location
      };

      if (editingSession) {
        return calendarService.updateSession({
          sessionId: editingSession.id,
          ...payload
        });
      }

      return calendarService.createSession({
        coachId: coachProfileQuery.data.id,
        clientId: selectedClientId,
        ...payload
      });
    },
    onSuccess: () => {
      reset(getDefaultFormValues());
      setEditingSession(null);
      queryClient.invalidateQueries({ queryKey: ["coachSessions"] });
    }
  });
  const cancelSessionMutation = useMutation({
    mutationFn: calendarService.cancelSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coachSessions"] });
    }
  });

  useEffect(() => {
    if (editingSession) {
      setSelectedClientId(editingSession.client_id);
      reset({
        title: editingSession.title,
        description: editingSession.description ?? "",
        sessionType: editingSession.session_type ?? "",
        scheduledDate: editingSession.start_time.slice(0, 10),
        startTime: formatTimeInput(editingSession.start_time),
        endTime: formatTimeInput(editingSession.end_time),
        location: editingSession.location ?? ""
      });
    }
  }, [editingSession, reset]);

  const onSubmit = (values: ScheduledSessionFormValues) => {
    saveSessionMutation.mutate(values);
  };

  return (
    <PlaceholderScreen titleKey="calendar">
      <Card>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{editingSession ? t("rescheduleSession") : t("createSession")}</Text>
          <Text style={styles.meta}>
            {t("selectedClient")}:{" "}
            {clientsQuery.data?.find((client) => client.client_profile_id === selectedClientId)?.client_full_name ??
              t("selectClient")}
          </Text>
          <View style={styles.buttonList}>
            {clientsQuery.isLoading ? <LoadingSkeleton count={2} accessibilityLabel={t("placeholder.loading")} /> : null}
            {clientsQuery.isError ? (
              <ErrorState
                title={t("errors.title")}
                message={clientsQuery.error.message}
                retryLabel={t("retry")}
                onRetry={() => clientsQuery.refetch()}
              />
            ) : null}
            {clientsQuery.data?.map((client) => (
              <Button
                key={client.client_profile_id}
                label={client.client_full_name}
                onPress={() => setSelectedClientId(client.client_profile_id)}
                variant={selectedClientId === client.client_profile_id ? "primary" : "secondary"}
              />
            ))}
          </View>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("sessionTitle")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.title?.message ? t(errors.title.message) : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="sessionType"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label={t("sessionType")} onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
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
          <View style={styles.timeRow}>
            <Controller
              control={control}
              name="startTime"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t("startTime")}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.startTime?.message ? t(errors.startTime.message) : undefined}
                  style={styles.timeInput}
                />
              )}
            />
            <Controller
              control={control}
              name="endTime"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t("endTime")}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.endTime?.message ? t(errors.endTime.message) : undefined}
                  style={styles.timeInput}
                />
              )}
            />
          </View>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label={t("location")} onBlur={onBlur} onChangeText={onChange} value={value} />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("description")}
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {saveSessionMutation.error ? <Text style={styles.error}>{saveSessionMutation.error.message}</Text> : null}
          {saveSessionMutation.isSuccess ? <Text style={styles.success}>{t("sessionSaved")}</Text> : null}
          <Button
            label={editingSession ? t("save") : t("createSession")}
            disabled={!selectedClientId || !coachProfileQuery.data?.id}
            loading={saveSessionMutation.isPending}
            onPress={handleSubmit(onSubmit)}
          />
          {editingSession ? (
            <Button
              label={t("cancel")}
              onPress={() => {
                setEditingSession(null);
                reset(getDefaultFormValues());
              }}
              variant="ghost"
            />
          ) : null}
        </View>
      </Card>
      <Card>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("scheduledSessions")}</Text>
          {sessionsQuery.isLoading ? <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} /> : null}
          {sessionsQuery.isError ? (
            <ErrorState
              title={t("errors.title")}
              message={sessionsQuery.error.message}
              retryLabel={t("retry")}
              onRetry={() => sessionsQuery.refetch()}
            />
          ) : null}
          {!sessionsQuery.isLoading && !sessionsQuery.isError && !sessionsQuery.data?.length ? (
            <EmptyState title={t("noScheduledSessions")} body={t("placeholder.emptyBody")} />
          ) : null}
          {sessionsQuery.data?.map((scheduledSession) => (
            <View key={scheduledSession.id} style={styles.item}>
              <Text style={styles.name}>{scheduledSession.title}</Text>
              <Text style={styles.meta}>{scheduledSession.client_profiles?.profiles?.full_name ?? t("client")}</Text>
              <Text style={styles.meta}>{formatSessionWindow(scheduledSession.start_time, scheduledSession.end_time)}</Text>
              {scheduledSession.location ? <Text style={styles.meta}>{scheduledSession.location}</Text> : null}
              <StatusBadge status={scheduledSession.status} />
              <View style={styles.actions}>
                <Button label={t("reschedule")} onPress={() => setEditingSession(scheduledSession)} variant="secondary" />
                {scheduledSession.status !== "cancelled" ? (
                  <Button
                    label={t("cancelSession")}
                    loading={
                      cancelSessionMutation.isPending && cancelSessionMutation.variables === scheduledSession.id
                    }
                    onPress={() => cancelSessionMutation.mutate(scheduledSession.id)}
                    variant="ghost"
                  />
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </Card>
      <Card>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("scheduledWorkouts")}</Text>
          {assignedWorkoutsQuery.isLoading ? <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} /> : null}
          {assignedWorkoutsQuery.isError ? (
            <ErrorState
              title={t("errors.title")}
              message={assignedWorkoutsQuery.error.message}
              retryLabel={t("retry")}
              onRetry={() => assignedWorkoutsQuery.refetch()}
            />
          ) : null}
          {!assignedWorkoutsQuery.isLoading && !assignedWorkoutsQuery.isError && !assignedWorkoutsQuery.data?.length ? (
            <EmptyState title={t("noAssignedWorkouts")} body={t("placeholder.emptyBody")} />
          ) : null}
          {assignedWorkoutsQuery.data?.map((workout) => (
            <View key={workout.id} style={styles.item}>
              <Text style={styles.name}>{workout.workout_templates?.name ?? t("workouts")}</Text>
              <Text style={styles.meta}>{workout.client_profiles?.profiles?.full_name ?? t("client")}</Text>
              <Text style={styles.meta}>{workout.scheduled_date}</Text>
              <StatusBadge status={workout.status} />
            </View>
          ))}
        </View>
      </Card>
    </PlaceholderScreen>
  );
}

function getDefaultFormValues(): ScheduledSessionFormValues {
  return {
    title: "",
    description: "",
    sessionType: "",
    scheduledDate: new Date().toISOString().slice(0, 10),
    startTime: "09:00",
    endTime: "10:00",
    location: ""
  };
}

function formatTimeInput(value: string) {
  return new Date(value).toTimeString().slice(0, 5);
}

function formatSessionWindow(startTime: string, endTime: string) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });

  return `${formatter.format(new Date(startTime))} - ${timeFormatter.format(new Date(endTime))}`;
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold
  },
  buttonList: {
    gap: spacing.md
  },
  timeRow: {
    gap: spacing.md
  },
  timeInput: {
    minWidth: 120
  },
  item: {
    gap: spacing.xs,
    paddingTop: spacing.sm
  },
  actions: {
    gap: spacing.sm,
    paddingTop: spacing.sm
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.weight.semibold
  },
  meta: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
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
