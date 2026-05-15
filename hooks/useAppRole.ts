import { useAppStore } from "@/store/appStore";

export const useAppRole = () => useAppStore((state) => state.role);
