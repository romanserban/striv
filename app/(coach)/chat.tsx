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

export default function CoachChatScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);
  const userId = session?.user.id;
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: messagesService.listConversations
  });
  const clientsQuery = useQuery({
    queryKey: ["assignedClients"],
    queryFn: profilesService.getAssignedClients
  });
  const openConversationMutation = useMutation({
    mutationFn: messagesService.getOrCreateConversation,
    onSuccess: (conversationId) => {
      setSelectedConversationId(conversationId);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });

  const selectedConversation = conversationsQuery.data?.find(
    (conversation) => conversation.id === selectedConversationId
  );
  const selectedClientName =
    selectedConversation?.client_profiles?.profiles?.full_name ??
    clientsQuery.data?.find((client) => client.client_profile_id === selectedConversation?.client_id)
      ?.client_full_name ??
    t("client");

  return (
    <PlaceholderScreen titleKey="chat">
      {selectedConversationId && userId ? (
        <ChatThread
          conversationId={selectedConversationId}
          currentUserId={userId}
          title={selectedClientName}
          subtitle={t("conversation")}
          onBack={() => setSelectedConversationId(null)}
        />
      ) : null}
      {!selectedConversationId ? (
        <>
          <Card>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("conversations")}</Text>
              {conversationsQuery.isLoading ? (
                <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} />
              ) : null}
              {conversationsQuery.isError ? (
                <ErrorState
                  title={t("errors.title")}
                  message={conversationsQuery.error.message}
                  retryLabel={t("retry")}
                  onRetry={() => conversationsQuery.refetch()}
                />
              ) : null}
              {!conversationsQuery.isLoading && !conversationsQuery.isError && !conversationsQuery.data?.length ? (
                <EmptyState title={t("noConversations")} body={t("placeholder.emptyBody")} />
              ) : null}
              {conversationsQuery.data?.map((conversation) => (
                <View key={conversation.id} style={styles.row}>
                  <View style={styles.rowText}>
                    <Text style={styles.name}>
                      {conversation.client_profiles?.profiles?.full_name ?? t("client")}
                    </Text>
                    <Text style={styles.meta}>{new Date(conversation.created_at).toLocaleDateString()}</Text>
                  </View>
                  <Button
                    label={t("open")}
                    onPress={() => setSelectedConversationId(conversation.id)}
                    variant="secondary"
                  />
                </View>
              ))}
            </View>
          </Card>
          <Card>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("startConversation")}</Text>
              {clientsQuery.isLoading ? <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} /> : null}
              {clientsQuery.isError ? (
                <ErrorState
                  title={t("errors.title")}
                  message={clientsQuery.error.message}
                  retryLabel={t("retry")}
                  onRetry={() => clientsQuery.refetch()}
                />
              ) : null}
              {!clientsQuery.isLoading && !clientsQuery.isError && !clientsQuery.data?.length ? (
                <EmptyState title={t("noClients")} body={t("placeholder.emptyBody")} />
              ) : null}
              {clientsQuery.data?.map((client) => (
                <View key={client.client_profile_id} style={styles.row}>
                  <View style={styles.rowText}>
                    <Text style={styles.name}>{client.client_full_name}</Text>
                    <Text style={styles.meta}>{client.goal ?? t("goal")}</Text>
                  </View>
                  <Button
                    label={t("message")}
                    loading={
                      openConversationMutation.isPending &&
                      openConversationMutation.variables === client.client_profile_id
                    }
                    onPress={() => openConversationMutation.mutate(client.client_profile_id)}
                  />
                </View>
              ))}
              {openConversationMutation.error ? (
                <Text style={styles.error}>{openConversationMutation.error.message}</Text>
              ) : null}
            </View>
          </Card>
        </>
      ) : null}
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingTop: spacing.sm
  },
  rowText: {
    flex: 1,
    gap: spacing.xs
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
