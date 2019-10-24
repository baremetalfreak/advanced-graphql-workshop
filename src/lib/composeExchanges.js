import { CombinedError } from "./CombineErrors";

export const composeExchanges = (client, exchanges) =>
  exchanges.reduceRight(
    (inner, exchange) => exchange({ client, forward: inner }),
    fallback
  );

const fallback = sendResult => operation => {
  if (operation.operation.name !== "teardown") {
    sendResult({
      operation,
      data: undefined,
      error: new CombinedError({
        networkError: new Error("UnhandledOperation")
      })
    });
  }
};
