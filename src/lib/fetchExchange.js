import { CombinedError } from "./CombineErrors";
import { print } from "graphql";

export const fetchExchange = ({
  client,
  forward
}) => sendResult => operation => {
  const { query, variables, context } = operation;
  const { fetchOptions, url, fetch } = context;

  const options = {
    method: "POST",
    body: JSON.stringify({
      query: print(query),
      variables
    }),
    headers: {
      "content-type": "application/json",
      ...fetchOptions.headers
    },
    ...fetchOptions
  };

  return fetch(url, options)
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.statusText);
      } else {
        return res.json();
      }
    })
    .then(({ data, errors }) => ({
      operation,
      data,
      error: errors ? new CombinedError({ grapnQLErrors: errors }) : undefined
    }))
    .catch(networkError => ({
      operation,
      data: undefined,
      errors: new CombinedError({ networkError })
    }))
    .then(result => {
      sendResult(result);
    });
};
