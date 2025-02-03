import { gql } from "@generated/gql";
import {
  CreateIssueMutation,
  DeleteIssueMutation,
  Issue,
  IssueCreateInput,
  IssueStatus,
  IssueUpdateInput,
  UpdateIssueMutation,
} from "@generated/graphql";
import { useParams } from "react-router";
import { IssueFragment } from "../../fragments/issue.fragment";
import { SPRINTS_QUERY } from "../sprint";
import { issueDialog } from "../ui-dialog";
import { useToastState } from "../ui-toast";
import { BACKLOG_ISSUES_QUERY } from "./queries";
import { useMutation } from "urql";

const UPDATE_ISSUE_MUTATION = gql(`
    mutation UpdateIssue($input: IssueUpdateInput!) {
        updateIssue(issueUpdateInput: $input) {
            ...IssueFragment
        }
    }
`);

const CREATE_ISSUE_MUTATION = gql(`
  mutation CreateIssue($input: IssueCreateInput!) {
      createIssue(issueCreateInput: $input) {
          ...IssueFragment
      }
  }
`);

const DELETE_ISSUE_MUTATION = gql(`
  mutation DeleteIssue($id: String!) {
      deleteIssue(id: $id)
  }
`);

export const useUpdateIssueMutation = ({
  showNotificationOnUpdate = true,
}: {
  showNotificationOnUpdate?: boolean;
} = {}): [ReturnType<typeof useMutation>[0], (data: IssueUpdateInput, oldIssue?: Issue) => Promise<void>] => {
  const [result, updateIssue] = useMutation(UPDATE_ISSUE_MUTATION);
  const { closeDialog } = issueDialog.useDialogState();
  const { projectId = "" } = useParams();
  const { addToast } = useToastState();

  const updateIssueCb = async (data: IssueUpdateInput, oldIssue?: Issue) => {
    await updateIssue({
      input: {
        ...data,
      },
    });
  };

  // const updateIssueCb = (data: IssueUpdateInput, oldIssue?: Issue) => {
  //   updateIssue({
  //     variables: {
  //       input: {
  //         ...data,
  //       },
  //     },
  //     onCompleted: () => {
  //       closeDialog();
  //       if (showNotificationOnUpdate) {
  //         addToast(`${oldIssue?.issueNumber} has been updated.`);
  //       }
  //     },
  //     refetchQueries: () => {
  //       return oldIssue?.sprintId !== data?.sprintId
  //         ? [
  //             { query: SPRINTS_QUERY, variables: { projectId } },
  //             { query: BACKLOG_ISSUES_QUERY, variables: { projectId } },
  //           ]
  //         : [];
  //     },
  //   });
  // };

  return [result, updateIssueCb];
};

export const useCreateIssueMutation = (): [
  ReturnType<typeof useMutation>[0],
  (data: IssueCreateInput) => Promise<void>
] => {
  const [result, createIssue] = useMutation(CREATE_ISSUE_MUTATION);
  const { closeDialog } = issueDialog.useDialogState();
  const { addToast } = useToastState();

  const createIssueCb = async (data: IssueCreateInput) => {
    await createIssue({
      input: {
        ...data,
      },
    });
  };

  // const createIssueCb = (data: IssueCreateInput) => {
  //   createIssue({
  //     variables: {
  //       input: {
  //         ...data,
  //       },
  //     },
  //     onCompleted: (data) => {
  //       closeDialog();
  //       addToast(`${data.createIssue.issueNumber} has been added.`);
  //     },
  //     update: (cache, { data }) => {
  //       const newIssue = data?.createIssue;

  //       if (!newIssue || !newIssue.id) {
  //         console.error("Invalid data returned from createIssue mutation");
  //         return;
  //       }

  //       if (newIssue.sprintId) {
  //         cache.modify({
  //           id: cache.identify({
  //             __typename: "Sprint",
  //             id: newIssue.sprintId,
  //           }),
  //           fields: {
  //             issues(existingIssues = []) {
  //               const newIssueRef = cache.writeFragment({
  //                 data: newIssue,
  //                 fragment: IssueFragment,
  //                 fragmentName: "IssueFragment",
  //               });
  //               return [...existingIssues, newIssueRef];
  //             },
  //           },
  //         });
  //       } else {
  //         cache.modify({
  //           fields: {
  //             issues(existingIssues = [], { readField }) {
  //               const newIssueRef = cache.writeFragment({
  //                 data: newIssue,
  //                 fragment: IssueFragment,
  //                 fragmentName: "IssueFragment",
  //               });

  //               // Avoid adding duplicates
  //               const isDuplicate = existingIssues.some(
  //                 (issueRef: Reference) => readField("id", issueRef) === newIssue.id
  //               );

  //               if (isDuplicate) return existingIssues;

  //               return [...existingIssues, newIssueRef];
  //             },
  //           },
  //         });
  //       }
  //     },
  //   });
  // };

  return [result, createIssueCb];
};

export const useDeleteIssueMutation = (): [ReturnType<typeof useMutation>[0], (issue?: Issue) => Promise<void>] => {
  const [result, deleteIssue] = useMutation(DELETE_ISSUE_MUTATION);
  const { closeDialog } = issueDialog.useDialogState();
  const { addToast } = useToastState();

  const deleteIssueCb = async (issue?: Issue) => {
    await deleteIssue({
      id: issue?.id ?? "",
    });
  };

  // const deleteIssueCb = (issue?: Issue) => {
  //   deleteIssue({
  //     variables: {
  //       id: issue?.id ?? "",
  //     },
  //     onCompleted: () => {
  //       closeDialog();
  //       addToast(`${issue?.issueNumber} has been deleted.`);
  //     },
  //     update: (cache) => {
  //       if (issue?.sprintId) {
  //         cache.modify({
  //           id: cache.identify({
  //             __typename: "Sprint",
  //             id: issue?.sprintId,
  //           }),
  //           fields: {
  //             issues(existingIssues = [], { readField }) {
  //               return existingIssues.filter((issueRef: Reference) => readField("id", issueRef) !== issue?.id);
  //             },
  //           },
  //         });
  //       } else {
  //         cache.modify({
  //           fields: {
  //             issues(existingIssues = [], { readField }) {
  //               return existingIssues.filter((issueRef: Reference) => readField("id", issueRef) !== issue?.id);
  //             },
  //           },
  //         });
  //       }
  //     },
  //   });
  // };

  return [result, deleteIssueCb];
};

export const useUpdateIssueCache = () => {
  // const client = useApolloClient();

  const updateIssueCache = (issue: Issue, status: IssueStatus) => {
    // client.cache.modify({
    //   id: client.cache.identify(issue),
    //   fields: {
    //     status() {
    //       return status;
    //     },
    //   },
    //   broadcast: true,
    // });
  };

  return { updateIssueCache };
};
