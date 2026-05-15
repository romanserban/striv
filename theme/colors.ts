export const colors = {
  background: "#0F1115",
  surface: "#171A21",
  card: "#1E222B",
  primary: "#7C5CFF",
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A7B5",
  border: "#2A2F3A",
  success: "#22C55E",
  error: "#EF4444",
  warning: "#F59E0B"
} as const;

export type ColorToken = keyof typeof colors;
