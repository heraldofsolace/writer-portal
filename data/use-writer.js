import useClerkSWR from "./use-clerk-swr";

export function useWriter(id) {
  const { data, error, mutate } = useClerkSWR(`/api/writers/${id}`);
  return {
    writer: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
