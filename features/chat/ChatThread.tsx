import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { MessageBubble } from "@/components/ui/MessageBubble";
import { messageSchema, type MessageFormValues } from "@/features/chat/chatSchemas";
import { messagesService } from "@/services/messages";
import { colors, spacing, typography } from "@/theme";

type ChatThreadProps = {
  conversationId: string;
  currentUserId: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

export function ChatThread({ conversationId, currentUserId, title, subtitle, onBack }: ChatThreadProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      body: ""
    }
  });
  const messagesQuery = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => messagesService.listMessages(conversationId)
  });
  const sendMessageMutation = useMutation({
    mutationFn: (values: MessageFormValues) =>
      messagesService.sendMessage({
        conversationId,
        senderId: currentUserId,
        body: values.body
      }),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });

  useEffect(() => {
    return messagesService.subscribeToMessages(conversationId, () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });
  }, [conversationId, queryClient]);

  const onSubmit = (values: MessageFormValues) => {
    sendMessageMutation.mutate(values);
  };

  return (
    <Card>
      <View style={styles.thread}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {onBack ? <Button label={t("back")} onPress={onBack} variant="ghost" /> : null}
        </View>
        {messagesQuery.isLoading ? <LoadingSkeleton accessibilityLabel={t("placeholder.loading")} /> : null}
        {!messagesQuery.isLoading && !messagesQuery.data?.length ? (
          <EmptyState title={t("noMessages")} body={t("placeholder.emptyBody")} />
        ) : null}
        <View style={styles.messages}>
          {messagesQuery.data?.map((message) => (
            <MessageBubble
              key={message.id}
              body={message.body}
              createdAt={message.created_at}
              isOwn={message.sender_id === currentUserId}
            />
          ))}
        </View>
        <View style={styles.form}>
          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("message")}
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.body?.message ? t(errors.body.message) : undefined}
              />
            )}
          />
          {sendMessageMutation.error ? <Text style={styles.error}>{sendMessageMutation.error.message}</Text> : null}
          <Button label={t("send")} loading={sendMessageMutation.isPending} onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  thread: {
    gap: spacing.lg
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  headerText: {
    flex: 1,
    gap: spacing.xs
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  },
  messages: {
    gap: spacing.md
  },
  form: {
    gap: spacing.md
  },
  error: {
    color: colors.error,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm
  }
});
