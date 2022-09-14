import useSWR from "swr";
import fetcher from "./api-fetcher";

export function useAssignments(type) {
  let url;
  if (type === "all") {
    url = "/api/assignments";
  } else {
    url = "/api/assignments/current";
  }

  const { data, error } = useSWR(url, fetcher);

  return {
    assignments: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useAvailableAssignments() {
  const { data, error, mutate } = useSWR("/api/assignments/available", fetcher);

  return {
    assignments: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useSingleAssignment(id) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error, mutate } = useSWR(`/api/assignments/${id}`, fetcher);

  return {
    assignment: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
