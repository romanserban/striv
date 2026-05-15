import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { assignmentsService } from "@/services/assignments";
import { calendarService } from "@/services/calendar";
import { colors, spacing, typography } from "@/theme";

export default function ClientCalendarScreen() {
  const { t } = useTranslation();
  const sessionsQuery = useQuery({
    queryKey: ["clientSessions"],
    queryFn: calendarService.listClientSessions
  });
  const assignedWorkoutsQuery = useQuery({
    queryKey: ["clientAssignedWorkouts"],
    queryFn: assignmentsService.listClientAssignedWorkouts
  });

  return (
    <PlaceholderScreen titleKey="calendar">
      <Card>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("scheduledSessions")}</Text>
          {sessionsQuery.isLoading ? <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} /> : null}
          {!sessionsQuery.isLoading && !sessionsQuery.data?.length ? (
            <EmptyState title={t("noScheduledSessions")} body={t("placeholder.emptyBody")} />
          ) : null}
          {sessionsQuery.data?.map((scheduledSession) => (
            <View key={scheduledSession.id} style={styles.item}>
              <Text style={styles.name}>{scheduledSession.title}</Text>
              <Text style={styles.meta}>{scheduledSession.coach_profiles?.profiles?.full_name ?? t("coach")}</Text>
              <Text style={styles.meta}>{formatSessionWindow(scheduledSession.start_time, scheduledSession.end_time)}</Text>
              {scheduledSession.location ? <Text style={styles.meta}>{scheduledSession.location}</Text> : null}
              <Text style={styles.status}>{scheduledSession.status}</Text>
            </View>
          ))}
        </View>
      </Card>
      <Card>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("scheduledWorkouts")}</Text>
          {assignedWorkoutsQuery.isLoading ? <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} /> : null}
          {!assignedWorkoutsQuery.isLoading && !assignedWorkoutsQuery.data?.length ? (
            <EmptyState title={t("noAssignedWorkouts")} body={t("placeholder.emptyBody")} />
          ) : null}
          {assignedWorkoutsQuery.data?.map((workout) => (
            <View key={workout.id} style={styles.item}>
              <Text style={styles.name}>{workout.workout_templates?.name ?? t("workouts")}</Text>
              {workout.workout_templates?.description ? (
                <Text style={styles.meta}>{workout.workout_templates.description}</Text>
              ) : null}
              <Text style={styles.meta}>{workout.scheduled_date}</Text>
              <Text style={styles.status}>{workout.status}</Text>
            </View>
          ))}
        </View>
      </Card>
    </PlaceholderScreen>
  );
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
  item: {
    gap: spacing.xs,
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
  status: {
    color: colors.primary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.semibold
  }
});
