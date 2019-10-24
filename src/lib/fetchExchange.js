import { CombinedError } from "./CombineErrors";
import { print } from "graphql";

export const fetchExchange = ({ client, forward }) => sendResult => {
  const next = forward(sendResult);
  const controllers = new Map();

  return operation => {
    if (operation.operationName === "teardown") {
      const controller = controllers.get(operation.key);
      if (controller !== undefined) controller.abort();
      return next(operation);
    } else if (operation.operationName === "subscription") {
      return next(operation);
    }

    const { query, variables, context } = operation;
    const { fetchOptions, url, fetch } = context;

    const controller = new AbortController();
    controllers.set(operation.key, controller);

    const options = {
      signal: controller.signal,
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
      .then(({ data, errors }) => {
        return {
          operation,
          data,
          error: errors
            ? new CombinedError({ grapnQLErrors: errors })
            : undefined
        };
      })
      .catch(networkError => {
        if (networkError.name === "AbortError") return;

        return {
          operation,
          data: undefined,
          errors: new CombinedError({ networkError })
        };
      })
      .then(result => {
        sendResult(result);
      });
  };
};
