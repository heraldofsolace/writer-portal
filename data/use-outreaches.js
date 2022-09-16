import useSWR from "swr";
import useClerkSWR from "./use-clerk-swr";

export function useOutreaches(type) {
  let url = `/api/outreaches?type=${type}`;

  const { data, error } = useClerkSWR(url);

  return {
    outreaches: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useSingleOutreach(id) {
  const { data, error, mutate } = useClerkSWR(`/api/outreaches/${id}`);

  return {
    outreach: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
