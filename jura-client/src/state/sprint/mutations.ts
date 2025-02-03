import { gql } from "@generated/gql";
import { SprintCreateInput, SprintStatus } from "@generated/graphql";
import { useParams } from "react-router";
import { useMutation } from "urql";
import { sprintDialog } from "../ui-dialog";

const CREATE_SPRINT_MUTATION = gql(`
    mutation CreateSprint($input: SprintCreateInput!) {
        createSprint(sprintCreateInput: $input) {
            ...SprintFragment
        }
    }
`);

const UPDATE_SPRINT_MUTATION = gql(`
    mutation UpdateSprint($input: SprintUpdateInput!) {
        updateSprint(sprintUpdateInput: $input) {
            ...SprintFragment
        }
    }
`);

export const useCreateSprintMutation = (): [
  ReturnType<typeof useMutation>[0],
  (data: SprintCreateInput) => Promise<void>
] => {
  const [result, createSprint] = useMutation(CREATE_SPRINT_MUTATION);
  const { closeDialog } = sprintDialog.useDialogState();
  const { projectId = "" } = useParams();

  const createSprintCb = async (data: SprintCreateInput) => {
    await createSprint({
      input: {
        ...data,
        projectId,
      },
    });
    closeDialog();
  };

  return [result, createSprintCb];
};

export const useCompleteSprintMutation = (): [
  ReturnType<typeof useMutation>[0],
  (sprintId: string) => Promise<void>
] => {
  const [result, updateSprint] = useMutation(UPDATE_SPRINT_MUTATION);

  const updateSprintFn = async (sprintId: string) => {
    await updateSprint({
      input: {
        id: sprintId,
        status: SprintStatus.Completed,
      },
    });
  };

  return [result, updateSprintFn];
};

export const useStartSprintMutation = (): [ReturnType<typeof useMutation>[0], (sprintId: string) => Promise<void>] => {
  const [result, updateSprint] = useMutation(UPDATE_SPRINT_MUTATION);

  const updateSprintFn = async (sprintId: string) => {
    await updateSprint({
      input: {
        id: sprintId,
        status: SprintStatus.Active,
      },
    });
  };

  return [result, updateSprintFn];
};
