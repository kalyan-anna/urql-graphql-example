import { gql } from "@generated/gql";
import { useAuthState } from "../auth";
import { useMemo } from "react";
import { useQuery } from "urql";
import { User } from "@generated/graphql";

const USERS_QUERY = gql(`
    query USERS {
        users {
            ...UserFragment
        }
    }
`);

export const USER_QUERY = gql(`
    query USER($id: String!) {
        user(id: $id) {
            ...UserFragment
        }
    }
`);

export const useUsersQuery = () => {
  return useQuery({ query: USERS_QUERY });
};

export const useCurrentUserQuery = () => {
  const { currentUserId } = useAuthState();
  const [result] = useQuery({
    query: USER_QUERY,
    variables: {
      id: currentUserId ?? "",
    },
  });

  return useMemo(() => {
    const firstName = (result.data?.user as User)?.name.split(" ")[0];

    return {
      ...result,
      data: {
        ...(result.data?.user as User),
        firstName,
      },
    };
  }, [result]);
};
