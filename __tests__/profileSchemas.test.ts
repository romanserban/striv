import { clientProfileSchema, coachProfileSchema } from "@/features/settings/profileSchemas";

describe("profile schemas", () => {
  it("accepts valid coach profile input", () => {
    expect(
      coachProfileSchema.safeParse({
        fullName: "Alex Coach",
        bio: "Strength coach",
        specialty: "Hypertrophy"
      }).success
    ).toBe(true);
  });

  it("rejects invalid client profile numbers", () => {
    const result = clientProfileSchema.safeParse({
      fullName: "Ana Client",
      goal: "Build strength",
      trainingLevel: "Beginner",
      heightCm: "tall",
      startingWeightKg: "70"
    });

    expect(result.success).toBe(false);
  });
});
