import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { createPlaceholderItems } from "@/utils/createPlaceholderItems";

type LoadingSkeletonProps = {
  count?: number;
  accessibilityLabel: string;
};

export function LoadingSkeleton({ count = 3, accessibilityLabel }: LoadingSkeletonProps) {
  return (
    <View accessibilityLabel={accessibilityLabel} accessibilityRole="progressbar" style={styles.wrapper}>
      {createPlaceholderItems(count).map((item) => (
        <View key={item} style={styles.line} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md
  },
  line: {
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.surface
  }
});
