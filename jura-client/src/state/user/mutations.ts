import { gql } from "@generated/gql";
import { UserUpdateInput } from "@generated/graphql";
import { useMutation } from "urql";

const UPDATE_USER_MUTATION = gql(`
    mutation UpdateUser($input: UserUpdateInput!) {
        updateUser(userUpdateInput: $input) {
            ...UserFragment
        }
    }
`);

export const useUpdateUserMutation = (): [
  ReturnType<typeof useMutation>[0],
  (data: UserUpdateInput) => Promise<void>
] => {
  const [result, updateUser] = useMutation(UPDATE_USER_MUTATION);

  const updateUserFn = async (data: UserUpdateInput) => {
    await updateUser({
      input: {
        ...data,
      },
    });
  };

  return [result, updateUserFn];
};
