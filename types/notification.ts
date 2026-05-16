export type PushTokenPlatform = "ios" | "android" | "web" | "unknown";

export type PushToken = {
  id: string;
  user_id: string;
  token: string;
  platform: PushTokenPlatform;
  device_name: string | null;
  project_id: string | null;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
};

export type NotificationType = "workout_assigned" | "message" | "session_reminder";

export type NotificationDeliveryStatus = "queued" | "sent" | "failed" | "skipped";

export type NotificationEvent = {
  id: string;
  recipient_id: string;
  actor_id: string | null;
  type: NotificationType;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  delivery_status: NotificationDeliveryStatus;
  scheduled_for: string | null;
  sent_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type NotificationPayload = {
  title: string;
  body: string;
  data: {
    type: NotificationType;
    [key: string]: string | number | boolean | null;
  };
};

