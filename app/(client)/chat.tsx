import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { ChatThread } from "@/features/chat/ChatThread";
import { messagesService } from "@/services/messages";
import { profilesService } from "@/services/profiles";
import { useAuthStore } from "@/store/authStore";
import { colors, spacing, typography } from "@/theme";

export default function ClientChatScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);
  const userId = session?.user.id;
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const clientProfileQuery = useQuery({
    queryKey: ["clientProfile", userId],
    queryFn: () => profilesService.getClientProfile(userId ?? ""),
    enabled: Boolean(userId)
  });
  const assignedCoachQuery = useQuery({
    queryKey: ["assignedCoach", userId],
    queryFn: profilesService.getAssignedCoach,
    enabled: Boolean(userId)
  });
  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: messagesService.listConversations
  });
  const openConversationMutation = useMutation({
    mutationFn: messagesService.getOrCreateConversation,
    onSuccess: (conversationId) => {
      setSelectedConversationId(conversationId);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });

  const existingConversation = conversationsQuery.data?.[0];
  const activeConversationId = selectedConversationId ?? existingConversation?.id ?? null;
  const clientProfileId = clientProfileQuery.data?.id;
  const canOpenConversation = Boolean(clientProfileId && assignedCoachQuery.data);

  return (
    <PlaceholderScreen titleKey="chat">
      {activeConversationId && userId ? (
        <ChatThread
          conversationId={activeConversationId}
          currentUserId={userId}
          title={assignedCoachQuery.data?.coach_full_name ?? t("coach")}
          subtitle={t("conversation")}
        />
      ) : (
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("assignedCoach")}</Text>
            {clientProfileQuery.isLoading || assignedCoachQuery.isLoading || conversationsQuery.isLoading ? (
              <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} />
            ) : null}
            {clientProfileQuery.isError ? (
              <ErrorState
                title={t("errors.title")}
                message={clientProfileQuery.error.message}
                retryLabel={t("retry")}
                onRetry={() => clientProfileQuery.refetch()}
              />
            ) : null}
            {assignedCoachQuery.isError ? (
              <ErrorState
                title={t("errors.title")}
                message={assignedCoachQuery.error.message}
                retryLabel={t("retry")}
                onRetry={() => assignedCoachQuery.refetch()}
              />
            ) : null}
            {conversationsQuery.isError ? (
              <ErrorState
                title={t("errors.title")}
                message={conversationsQuery.error.message}
                retryLabel={t("retry")}
                onRetry={() => conversationsQuery.refetch()}
              />
            ) : null}
            {!assignedCoachQuery.isLoading && !assignedCoachQuery.isError && !assignedCoachQuery.data ? (
              <EmptyState title={t("noCoachAssigned")} body={t("placeholder.emptyBody")} />
            ) : null}
            {assignedCoachQuery.data ? (
              <>
                <Text style={styles.name}>{assignedCoachQuery.data.coach_full_name}</Text>
                <Text style={styles.meta}>{t("conversation")}</Text>
                <Button
                  label={t("openConversation")}
                  disabled={!canOpenConversation}
                  loading={openConversationMutation.isPending}
                  onPress={() => {
                    if (clientProfileId) {
                      openConversationMutation.mutate(clientProfileId);
                    }
                  }}
                />
              </>
            ) : null}
            {openConversationMutation.error ? (
              <Text style={styles.error}>{openConversationMutation.error.message}</Text>
            ) : null}
          </View>
        </Card>
      )}
    </PlaceholderScreen>
  );
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
  }
});
