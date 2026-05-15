import { workoutAssignmentSchema } from "@/features/workouts/assignmentSchemas";

describe("workout assignment schema", () => {
  it("accepts an ISO date", () => {
    expect(workoutAssignmentSchema.safeParse({ scheduledDate: "2026-05-15" }).success).toBe(true);
  });

  it("rejects a non-ISO date", () => {
    expect(workoutAssignmentSchema.safeParse({ scheduledDate: "15/05/2026" }).success).toBe(false);
  });
});
