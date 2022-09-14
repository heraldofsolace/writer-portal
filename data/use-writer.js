import useSWR from "swr";
import fetcher from "./api-fetcher";
export function useWriter(id) {
  const { data, error } = useSWR(`/api/writers/${id}`, fetcher);

  return {
    writer: data,
    isLoading: !error && !data,
    isError: error,
  };
}
