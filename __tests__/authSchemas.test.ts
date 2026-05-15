import { loginSchema, signupSchema } from "@/features/auth/schemas";

describe("auth schemas", () => {
  it("accepts valid login input", () => {
    expect(
      loginSchema.safeParse({
        email: "coach@striv.app",
        password: "secret1"
      }).success
    ).toBe(true);
  });

  it("rejects invalid signup input", () => {
    const result = signupSchema.safeParse({
      fullName: "",
      email: "not-an-email",
      password: "123"
    });

    expect(result.success).toBe(false);
  });
});
