import { messageSchema } from "@/features/chat/chatSchemas";

describe("chat schemas", () => {
  it("accepts a message with body text", () => {
    expect(
      messageSchema.safeParse({
        body: "Can you review today's workout?"
      }).success
    ).toBe(true);
  });

  it("rejects an empty message", () => {
    const result = messageSchema.safeParse({
      body: "   "
    });

    expect(result.success).toBe(false);
  });
});
