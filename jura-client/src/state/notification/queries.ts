import { gql } from "@generated/gql";
import { Notification, NotificationStatus } from "@generated/graphql";
import { useMemo } from "react";
import { useQuery } from "urql";

const NOTIFICATIONS_QUERY = gql(`
    query NOTIFICATIONS {
        notifications {
           ...NotificationFragment
        }
    }
  `);

export const useNotificationsQuery = () => {
  return useQuery({ query: NOTIFICATIONS_QUERY });
};

export const useNotificationsCountQuery = () => {
  const [result] = useNotificationsQuery();

  return useMemo(() => {
    const unreadCount =
      (result.data?.notifications as Notification[])?.filter((item) => item.status === NotificationStatus.Unread)
        .length || 0;

    return {
      ...result,
      data: unreadCount,
      length: unreadCount,
    };
  }, [result]);
};
