import { gql } from "@generated/gql";
import { useAuthState } from "../auth";
import { useMemo } from "react";
import { Project } from "@generated/graphql";
import { useQuery } from "urql";

const PROJECTS_QUERY = gql(`
    query PROJECTS {
        projects {
           ...ProjectFragment
        }
    }
  `);

export const useProjectsQuery = () => {
  const [result] = useQuery({ query: PROJECTS_QUERY });
  const { currentUserId } = useAuthState();

  return useMemo(() => {
    const ownedProjects =
      (result?.data?.projects as Project[])?.filter((project) => project.ownerId === currentUserId) ?? [];
    const otherProjects =
      (result?.data?.projects as Project[])?.filter((project) => project.ownerId !== currentUserId) ?? [];

    return {
      ...result,
      data: result.data,
      ownedProjects,
      otherProjects,
    };
  }, [result, currentUserId]);
};

export const useProjectQuery = (id: string) => {
  const result = useProjectsQuery();

  return useMemo(() => {
    const matchingProj = (result.data?.projects as Project[])?.find((p) => p.id === id);

    return {
      ...result,
      data: matchingProj,
    };
  }, [id, result]);
};
