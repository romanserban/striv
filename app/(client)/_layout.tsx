import { Tabs } from "expo-router";
import {
  Calendar,
  ChartNoAxesColumnIncreasing,
  MessageCircle,
  Settings,
  Sun,
  type LucideIcon
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { colors, typography } from "@/theme";

export default function ClientLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border
        },
        tabBarLabelStyle: {
          fontSize: typography.size.xs,
          fontWeight: typography.weight.medium
        }
      }}
    >
      <Tabs.Screen name="today" options={{ title: t("today"), tabBarIcon: createTabIcon(Sun) }} />
      <Tabs.Screen
        name="progress"
        options={{ title: t("progress"), tabBarIcon: createTabIcon(ChartNoAxesColumnIncreasing) }}
      />
      <Tabs.Screen name="calendar" options={{ title: t("calendar"), tabBarIcon: createTabIcon(Calendar) }} />
      <Tabs.Screen name="chat" options={{ title: t("chat"), tabBarIcon: createTabIcon(MessageCircle) }} />
      <Tabs.Screen name="profile" options={{ title: t("profile"), tabBarIcon: createTabIcon(Settings) }} />
      <Tabs.Screen name="workout/[assignedWorkoutId]" options={{ href: null }} />
    </Tabs>
  );
}

function createTabIcon(Icon: LucideIcon) {
  function TabIcon({ color, size }: { color: string; size: number }) {
    return <Icon size={size} stroke={color} />;
  }

  TabIcon.displayName = `${Icon.displayName ?? Icon.name}TabIcon`;
  return TabIcon;
}
