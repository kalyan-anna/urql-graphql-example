import { gql } from "@generated/gql";
import { Notification, NotificationStatus } from "@generated/graphql";
import { useCallback } from "react";
import { useMutation } from "urql";

const UPDATE_NOTIFICATION_MUTATION = gql(`
    mutation UpdateNotification($id: String!, $status: NotificationStatus!) {
        updateNotification(id: $id, status: $status) {
            ...NotificationFragment
        }
    }
`);

export const useReadNotificationMutation = (): [
  ReturnType<typeof useMutation>[0],
  (item: Notification) => Promise<void>
] => {
  const [result, readNotification] = useMutation(UPDATE_NOTIFICATION_MUTATION);

  const readNotificationCb = useCallback(
    async (item: Notification) => {
      await readNotification({
        id: item.id,
        status: NotificationStatus.Read,
      });
    },
    [readNotification]
  );

  return [result, readNotificationCb];
};
