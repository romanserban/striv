import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationsService } from "@/services/notifications";

export function usePushNotifications(userId?: string) {
  const queryClient = useQueryClient();
  const permissionQuery = useQuery({
    queryKey: ["notificationPermission", userId],
    queryFn: notificationsService.getPermissionStatus,
    enabled: Boolean(userId)
  });
  const pushTokensQuery = useQuery({
    queryKey: ["pushTokens", userId],
    queryFn: () => notificationsService.listPushTokens(userId ?? ""),
    enabled: Boolean(userId)
  });
  const registerMutation = useMutation({
    mutationFn: () => {
      if (!userId) {
        throw new Error("Missing user.");
      }

      return notificationsService.registerPushToken(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationPermission", userId] });
      queryClient.invalidateQueries({ queryKey: ["pushTokens", userId] });
    }
  });

  return {
    permissionStatus: permissionQuery.data,
    isPermissionLoading: permissionQuery.isLoading,
    pushTokens: pushTokensQuery.data ?? [],
    isPushTokenLoading: pushTokensQuery.isLoading,
    registerForPushNotifications: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerResult: registerMutation.data,
    registerError: registerMutation.error
  };
}

