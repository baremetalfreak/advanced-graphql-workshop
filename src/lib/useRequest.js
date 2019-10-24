import { useMemo } from "react";
import { parse, print } from "graphql";
import hash from "djb2a";
import stringify from "fast-json-stable-stringify";

export const createRequest = (operationName, query, variables) => {
  let str = typeof query !== "string" ? print(query) : query;
  if (variables) {
    str += stringify(variables);
  }

  return {
    key: hash(str),
    operationName,
    query: typeof query === "string" ? parse(query) : query,
    variables
  };
};

export const useRequest = (operationName, query, variables) => {
  const request = createRequest(operationName, query, variables);

  return useMemo(() => request, [request.key]);
};
