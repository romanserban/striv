export const radius = {
  sm: 8,
  md: 12,
  card: 16,
  modal: 24,
  pill: 999
} as const;

export type RadiusToken = keyof typeof radius;
