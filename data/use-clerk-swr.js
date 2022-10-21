import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { log } from "next-axiom";
export default function useClerkSWR(url) {
  const { getToken } = useAuth();
  const fetcher = async (...args) => {
    const res = await fetch(...args, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.");
      // Attach extra info to the error object.
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }

    return res.json();
  };
  return useSWR(url, fetcher);
}
