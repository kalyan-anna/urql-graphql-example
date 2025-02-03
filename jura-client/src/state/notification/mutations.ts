import { MutationResult, useMutation } from "@apollo/client";
import { gql } from "@generated/gql";
import { Notification, NotificationStatus, UpdateNotificationMutation } from "@generated/graphql";

const UPDATE_NOTIFICATION_MUTATION = gql(`
    mutation UpdateNotification($id: String!, $status: NotificationStatus!) {
        updateNotification(id: $id, status: $status) {
            ...NotificationFragment
        }
    }
`);

export const useReadNotificationMutation = (): [
  (item: Notification) => void,
  MutationResult<UpdateNotificationMutation>
] => {
  const [readNotification, result] = useMutation(UPDATE_NOTIFICATION_MUTATION);

  const readNotificationCb = (item: Notification) => {
    readNotification({
      variables: {
        id: item.id,
        status: NotificationStatus.Read,
      },
      optimisticResponse: {
        updateNotification: {
          ...item,
          __typename: "Notification",
          status: NotificationStatus.Read,
        },
      },
    });
  };

  return [readNotificationCb, result];
};
