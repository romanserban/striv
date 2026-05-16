const en = require("@/locales/en/common.json");
const ro = require("@/locales/ro/common.json");

describe("locale parity", () => {
  it("keeps Romanian keys aligned with English keys", () => {
    expect(getFlattenedKeys(ro).sort()).toEqual(getFlattenedKeys(en).sort());
  });
});

function getFlattenedKeys(value: unknown, prefix = ""): string[] {
  if (!isRecord(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.keys(value).flatMap((key) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    return getFlattenedKeys(value[key], nextPrefix);
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

