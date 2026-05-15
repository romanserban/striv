import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

type MessageBubbleProps = {
  body: string;
  createdAt: string;
  isOwn: boolean;
};

export function MessageBubble({ body, createdAt, isOwn }: MessageBubbleProps) {
  return (
    <View style={[styles.row, isOwn ? styles.ownRow : styles.otherRow]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={styles.body}>{body}</Text>
        <Text style={styles.time}>
          {new Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
            minute: "2-digit"
          }).format(new Date(createdAt))}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row"
  },
  ownRow: {
    justifyContent: "flex-end"
  },
  otherRow: {
    justifyContent: "flex-start"
  },
  bubble: {
    maxWidth: "82%",
    gap: spacing.xs,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius.sm
  },
  otherBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: radius.sm
  },
  body: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md
  },
  time: {
    color: colors.textSecondary,
    fontSize: typography.size.xs,
    lineHeight: typography.lineHeight.xs,
    alignSelf: "flex-end"
  }
});
