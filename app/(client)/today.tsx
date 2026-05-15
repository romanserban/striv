import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { assignmentsService } from "@/services/assignments";
import { colors, spacing, typography } from "@/theme";

export default function ClientTodayScreen() {
  const { t } = useTranslation();
  const assignedWorkoutsQuery = useQuery({
    queryKey: ["clientAssignedWorkouts"],
    queryFn: assignmentsService.listClientAssignedWorkouts
  });

  return (
    <PlaceholderScreen titleKey="today">
      {assignedWorkoutsQuery.isLoading ? (
        <Card>
          <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} />
        </Card>
      ) : null}
      {!assignedWorkoutsQuery.isLoading && !assignedWorkoutsQuery.data?.length ? (
        <Card>
          <EmptyState title={t("noAssignedWorkouts")} body={t("placeholder.emptyBody")} />
        </Card>
      ) : null}
      <View style={styles.list}>
        {assignedWorkoutsQuery.data?.map((workout) => (
          <Card key={workout.id}>
            <View style={styles.workout}>
              <Text style={styles.name}>{workout.workout_templates?.name ?? t("workouts")}</Text>
              {workout.workout_templates?.description ? (
                <Text style={styles.meta}>{workout.workout_templates.description}</Text>
              ) : null}
              <Text style={styles.meta}>{workout.scheduled_date}</Text>
              <Text style={styles.status}>{workout.status}</Text>
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
  workout: {
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
  status: {
    color: colors.primary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.semibold
  }
});
