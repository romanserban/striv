import { exerciseSchema } from "@/features/workouts/exerciseSchemas";

describe("exercise schema", () => {
  it("accepts a valid custom exercise", () => {
    expect(
      exerciseSchema.safeParse({
        name: "Back Squat",
        muscleGroup: "Legs",
        equipment: "Barbell",
        instructions: "Keep the torso braced.",
        mediaUrl: ""
      }).success
    ).toBe(true);
  });

  it("rejects an invalid media url", () => {
    expect(
      exerciseSchema.safeParse({
        name: "Back Squat",
        muscleGroup: "Legs",
        mediaUrl: "not-a-url"
      }).success
    ).toBe(false);
  });
});
