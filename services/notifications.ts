import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { buildNotificationPayload, notificationTypes } from "@/features/notifications/notificationPayloads";
import { supabase } from "@/lib/supabase";
import type { PushToken, PushTokenPlatform } from "@/types/notification";

type RegisterPushTokenResult = {
  status: Notifications.PermissionStatus | "unavailable" | "missing-project-id";
  token: PushToken | null;
};

type SavePushTokenInput = {
  userId: string;
  token: string;
  platform: PushTokenPlatform;
  deviceName?: string | null;
  projectId?: string | null;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export const notificationsService = {
  async getPermissionStatus() {
    const permissions = await Notifications.getPermissionsAsync();
    return permissions.status;
  },

  async requestPermission() {
    const permissions = await Notifications.requestPermissionsAsync();
    return permissions.status;
  },

  async registerPushToken(userId: string): Promise<RegisterPushTokenResult> {
    if (!Device.isDevice) {
      return { status: "unavailable", token: null };
    }

    const existingStatus = await notificationsService.getPermissionStatus();
    const finalStatus =
      existingStatus === Notifications.PermissionStatus.GRANTED
        ? existingStatus
        : await notificationsService.requestPermission();

    if (finalStatus !== Notifications.PermissionStatus.GRANTED) {
      return { status: finalStatus, token: null };
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT
      });
    }

    const projectId = getProjectId();
    if (!projectId) {
      return { status: "missing-project-id", token: null };
    }

    const expoToken = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = await notificationsService.savePushToken({
      userId,
      token: expoToken.data,
      platform: getPlatform(),
      deviceName: Device.deviceName ?? null,
      projectId
    });

    return { status: finalStatus, token };
  },

  async savePushToken({ userId, token, platform, deviceName, projectId }: SavePushTokenInput) {
    const { data, error } = await supabase
      .from("push_tokens")
      .upsert(
        {
          user_id: userId,
          token,
          platform,
          device_name: deviceName ?? null,
          project_id: projectId ?? null,
          last_seen_at: new Date().toISOString()
        },
        { onConflict: "user_id,token" }
      )
      .select("id, user_id, token, platform, device_name, project_id, last_seen_at, created_at, updated_at")
      .single<PushToken>();

    if (error) {
      throw error;
    }

    return data;
  },

  async listPushTokens(userId: string) {
    const { data, error } = await supabase
      .from("push_tokens")
      .select("id, user_id, token, platform, device_name, project_id, last_seen_at, created_at, updated_at")
      .eq("user_id", userId)
      .order("last_seen_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as PushToken[];
  },

  buildPayload: buildNotificationPayload
};

function getProjectId() {
  return Constants.easConfig?.projectId ?? Constants.expoConfig?.extra?.eas?.projectId ?? null;
}

function getPlatform(): PushTokenPlatform {
  if (Platform.OS === "ios" || Platform.OS === "android" || Platform.OS === "web") {
    return Platform.OS;
  }

  return "unknown";
}

export { notificationTypes };
