import type { NotificationPayload, NotificationType } from "@/types/notification";

type BuildNotificationPayloadInput =
  | {
      type: "workout_assigned";
      workoutName: string;
      scheduledDate: string;
      assignedWorkoutId: string;
    }
  | {
      type: "message";
      senderName: string;
      conversationId: string;
    }
  | {
      type: "session_reminder";
      sessionTitle: string;
      startsAt: string;
      sessionId: string;
    };

export const notificationTypes: NotificationType[] = ["workout_assigned", "message", "session_reminder"];

export function buildNotificationPayload(input: BuildNotificationPayloadInput): NotificationPayload {
  if (input.type === "workout_assigned") {
    return {
      title: "New workout assigned",
      body: `${input.workoutName} is scheduled for ${input.scheduledDate}.`,
      data: {
        type: input.type,
        assignedWorkoutId: input.assignedWorkoutId,
        scheduledDate: input.scheduledDate
      }
    };
  }

  if (input.type === "message") {
    return {
      title: `Message from ${input.senderName}`,
      body: "Open Striv to read the latest message.",
      data: {
        type: input.type,
        conversationId: input.conversationId
      }
    };
  }

  return {
    title: "Session reminder",
    body: `${input.sessionTitle} starts at ${input.startsAt}.`,
    data: {
      type: input.type,
      sessionId: input.sessionId,
      startsAt: input.startsAt
    }
  };
}

