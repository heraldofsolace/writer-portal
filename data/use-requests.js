import useSWR from "swr";
import useClerkSWR from "./use-clerk-swr";

export function useRequests(type) {
  let url = `/api/requests?type=${type}`;

  const { data, error } = useClerkSWR(url);
  console.log(data, error);
  return {
    requests: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useSingleRequest(id) {
  const { data, error, mutate } = useClerkSWR(`/api/requests/${id}`);

  return {
    request: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
