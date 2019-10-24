import { useState, useEffect } from "react";
import { useRequest } from "./useRequest";
import { print } from "graphql";

export const useQuery = ({operationName, query, variables }) => {
  const request = useRequest(operationName, query, variables);
  const [result, setResult] = useState({
    data: undefined,
    error: undefined,
    fetching: true
  });

  console.log("---- REQUEST --------------", request);

  useEffect(() => {
    setResult(res => ({ ...res, fetching: true }));
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        query: print(request.query),
        variables: request.variables
      })
    };

    console.log("---- FETCH  --------------", request);
    fetch("https://threed-test-api.herokuapp.com/graphql", options)
      .then(res => {
        if (res.status < 200 || res.status >= 300) {
          throw new Error(res.statusText);
        } else {
          return res.json();
        }
      })
      .then(({ data, errors }) => {
        setResult({
          data,
          errors,
          fetching: false
        });
      })
      .catch(error => {
        setResult({
          data: undefined,
          errors: [error],
          fetching: false
        });
      });
  }, [request]);

  return result;
};
