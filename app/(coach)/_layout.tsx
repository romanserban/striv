import { Tabs } from "expo-router";
import {
  Calendar,
  Dumbbell,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Users,
  type LucideIcon
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { colors, typography } from "@/theme";

export default function CoachLayout() {
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
      <Tabs.Screen name="dashboard" options={{ title: t("dashboard"), tabBarIcon: createTabIcon(LayoutDashboard) }} />
      <Tabs.Screen name="clients" options={{ title: t("clients"), tabBarIcon: createTabIcon(Users) }} />
      <Tabs.Screen name="workouts" options={{ title: t("workouts"), tabBarIcon: createTabIcon(Dumbbell) }} />
      <Tabs.Screen name="calendar" options={{ title: t("calendar"), tabBarIcon: createTabIcon(Calendar) }} />
      <Tabs.Screen name="chat" options={{ title: t("chat"), tabBarIcon: createTabIcon(MessageCircle) }} />
      <Tabs.Screen name="settings" options={{ title: t("settings"), tabBarIcon: createTabIcon(Settings) }} />
    </Tabs>
  );
}

function createTabIcon(Icon: LucideIcon) {
  function TabIcon({ color, size }: { color: string; size: number }) {
    return <Icon color={color} size={size} />;
  }

  TabIcon.displayName = `${Icon.displayName ?? Icon.name}TabIcon`;
  return TabIcon;
}
