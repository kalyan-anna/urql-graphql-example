import { useAuthState } from "./atoms";

import { gql } from "@generated/gql";
import { useNavigate } from "react-router";
import { useUIPreferenceState } from "../ui-preference";
import { useMutation } from "urql";
import { useCallback } from "react";
import { User } from "@generated/graphql";

const LOGIN_MUTATION = gql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        ...UserFragment
      }
    }
  }
`);

export const useLoginMutation = (): [
  ReturnType<typeof useMutation>[0],
  (args: { email: string; password: string }) => Promise<void>
] => {
  const navigate = useNavigate();
  const { login, logout } = useAuthState();
  const { lastVisitedProjectId } = useUIPreferenceState();

  const [result, loginMutation] = useMutation(LOGIN_MUTATION);

  const loginMutationCb = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        const result = await loginMutation({ email, password });
        if (result.data && result.data.login) {
          const { accessToken, user } = result.data.login;
          login({ accessToken, user: user as User });

          if (lastVisitedProjectId) {
            navigate(`/project/${lastVisitedProjectId}/issues`);
          } else {
            navigate("/dashboard");
          }
        }
      } catch {
        logout();
      }
    },
    [lastVisitedProjectId, login, loginMutation, logout, navigate]
  );

  return [result, loginMutationCb];
};
