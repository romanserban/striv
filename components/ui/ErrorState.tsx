import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { colors, spacing, typography } from "@/theme";

type ErrorStateProps = {
  title: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({ title, message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && retryLabel ? <Button label={retryLabel} onPress={onRetry} variant="secondary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
    paddingVertical: spacing.lg
  },
  title: {
    color: colors.error,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.bold
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md
  }
});

