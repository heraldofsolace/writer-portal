import useClerkSWR from "./use-clerk-swr";

export function useAssignments(type) {
  let url = `/api/assignments/?type=${type}`;

  const { data, error } = useClerkSWR(url);

  return {
    assignments: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useAvailableAssignments() {
  const { data, error, mutate } = useClerkSWR("/api/assignments/available");

  return {
    assignments: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useSingleAssignment(id) {
  const { data, error, mutate } = useClerkSWR(`/api/assignments/${id}`);

  return {
    assignment: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
