import { gql } from "@generated/gql";

export const IssueFragment = gql(`
 fragment IssueFragment on Issue {
    id
    issueNumber
    summary
    description
    type
    status
    storyPoints
    projectId
    sprintId
    assigneeUserId
    assignee {
      ...UserFragment
    }
    reporterUserId  
    reporter {
      ...UserFragment
    }  
  }
`);
