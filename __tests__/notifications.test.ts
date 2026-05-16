import { buildNotificationPayload, notificationTypes } from "@/features/notifications/notificationPayloads";

describe("notifications service", () => {
  it("declares the MVP notification types", () => {
    expect(notificationTypes).toEqual(["workout_assigned", "message", "session_reminder"]);
  });

  it("builds a workout assigned payload", () => {
    const payload = buildNotificationPayload({
      type: "workout_assigned",
      workoutName: "Lower Body",
      scheduledDate: "2026-05-16",
      assignedWorkoutId: "assigned-1"
    });

    expect(payload.data.type).toBe("workout_assigned");
    expect(payload.data.assignedWorkoutId).toBe("assigned-1");
    expect(payload.title).toBe("New workout assigned");
  });

  it("builds a message payload", () => {
    const payload = buildNotificationPayload({
      type: "message",
      senderName: "Alex",
      conversationId: "conversation-1"
    });

    expect(payload.data.type).toBe("message");
    expect(payload.data.conversationId).toBe("conversation-1");
    expect(payload.title).toBe("Message from Alex");
  });

  it("builds a session reminder payload", () => {
    const payload = buildNotificationPayload({
      type: "session_reminder",
      sessionTitle: "Check-in",
      startsAt: "2026-05-16T09:00:00.000Z",
      sessionId: "session-1"
    });

    expect(payload.data.type).toBe("session_reminder");
    expect(payload.data.sessionId).toBe("session-1");
    expect(payload.title).toBe("Session reminder");
  });
});
