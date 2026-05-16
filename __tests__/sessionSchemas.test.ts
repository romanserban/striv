import { scheduledSessionSchema, toSessionDateTime } from "@/features/calendar/sessionSchemas";

describe("scheduled session schema", () => {
  it("accepts valid session input", () => {
    expect(
      scheduledSessionSchema.safeParse({
        title: "Check-in",
        description: "",
        sessionType: "Video",
        scheduledDate: "2026-05-15",
        startTime: "09:00",
        endTime: "09:30",
        location: "Zoom"
      }).success
    ).toBe(true);
  });

  it("rejects an end time before the start time", () => {
    const result = scheduledSessionSchema.safeParse({
      title: "Check-in",
      scheduledDate: "2026-05-15",
      startTime: "10:00",
      endTime: "09:30"
    });

    expect(result.success).toBe(false);
  });

  it("rejects impossible dates and times", () => {
    expect(
      scheduledSessionSchema.safeParse({
        title: "Check-in",
        scheduledDate: "2026-13-15",
        startTime: "09:00",
        endTime: "09:30"
      }).success
    ).toBe(false);

    expect(
      scheduledSessionSchema.safeParse({
        title: "Check-in",
        scheduledDate: "2026-05-15",
        startTime: "24:00",
        endTime: "25:30"
      }).success
    ).toBe(false);
  });

  it("combines date and time into an ISO string", () => {
    expect(toSessionDateTime("2026-05-15", "09:00")).toContain("T");
  });
});
