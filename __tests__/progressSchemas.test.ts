import { progressEntrySchema } from "@/features/progress/progressSchemas";

describe("progress entry schema", () => {
  it("accepts valid progress values", () => {
    expect(
      progressEntrySchema.safeParse({
        weightKg: "82.5",
        waistCm: "90",
        chestCm: "",
        hipsCm: "",
        armCm: "",
        energyLevel: "4",
        notes: "Felt strong"
      }).success
    ).toBe(true);
  });

  it("rejects invalid energy level", () => {
    expect(
      progressEntrySchema.safeParse({
        weightKg: "",
        waistCm: "",
        chestCm: "",
        hipsCm: "",
        armCm: "",
        energyLevel: "9",
        notes: ""
      }).success
    ).toBe(false);
  });
});
