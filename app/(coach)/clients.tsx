import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { profilesService } from "@/services/profiles";
import { colors, spacing, typography } from "@/theme";

export default function CoachClientsScreen() {
  const { t } = useTranslation();
  const clientsQuery = useQuery({
    queryKey: ["assignedClients"],
    queryFn: profilesService.getAssignedClients
  });

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
  client: {
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
  }
});
