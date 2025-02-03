import { cacheExchange } from "@urql/exchange-graphcache";
import { Client, Exchange, fetchExchange, OperationResult } from "urql";
import { SPRINTS_QUERY } from "../state/sprint";
import { CreateSprintMutation, CreateSprintMutationVariables, Sprint } from "@generated/graphql";
import { getDefaultStore } from "jotai";
import { accessTokenAtom } from "../state/auth";
import { retryExchange } from "@urql/exchange-retry";
import { devtoolsExchange } from "@urql/devtools";
import { pipe, map } from "wonka";
import { gqlGlobalErrorAtom } from "../state/error";

const retryOptions = {
  initialDelayMs: 1000,
  maxDelayMs: 15000,
  randomDelay: true,
  maxNumberAttempts: 2,
};

export const cache = cacheExchange({
  updates: {
    Mutation: {
      createSprint(result: CreateSprintMutation, args: CreateSprintMutationVariables, cache) {
        cache.updateQuery({ query: SPRINTS_QUERY, variables: { projectId: args.input.projectId } }, (data) => {
          return {
            ...data,
            sprints: [...(data?.sprints as Sprint[]), result.createSprint],
          };
        });
      },
    },
  },
});

const errorLoggingExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      map((result: OperationResult) => {
        console.log("result:", result);
        if (result.error) {
          const graphQLErrors = result.error.graphQLErrors;
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
          );
          const shouldThrowError = !graphQLErrors.some((error) => error.extensions?.code === "BAD_USER_INPUT");

          if (shouldThrowError) {
            const messages = graphQLErrors.map((error) => error.message).join(", ");
            const store = getDefaultStore();
            store.set(gqlGlobalErrorAtom, messages);
          }
        }
        return result;
      })
    );
  };

export const client = new Client({
  url: "http://localhost:3000/graphql",
  exchanges: [devtoolsExchange, cache, retryExchange(retryOptions), errorLoggingExchange, fetchExchange],
  fetchOptions: () => {
    const store = getDefaultStore();
    const token = store.get(accessTokenAtom);
    return {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    };
  },
});
