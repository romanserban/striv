import { workoutTemplateExerciseSchema, workoutTemplateSchema } from "@/features/workouts/workoutSchemas";

describe("workout template schema", () => {
  it("accepts a valid workout template", () => {
    expect(
      workoutTemplateSchema.safeParse({
        name: "Upper Body Strength",
        description: "Push and pull focus"
      }).success
    ).toBe(true);
  });

  it("rejects a missing workout name", () => {
    expect(
      workoutTemplateSchema.safeParse({
        name: "",
        description: "No name"
      }).success
    ).toBe(false);
  });

  it("accepts valid workout exercise targets", () => {
    expect(
      workoutTemplateExerciseSchema.safeParse({
        sets: "4",
        reps: "8-10",
        targetWeight: "80kg",
        restSeconds: "120",
        tempo: "",
        notes: ""
      }).success
    ).toBe(true);
  });
});
