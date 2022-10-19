import { useWriter } from "../../data/use-writer";

export default function PendingOutreachesCount() {
  const { writer, isLoading, isError } = useWriter("me");
  if (isLoading || isError) return "";
  return writer.pending_outreaches_count !== "0" ? (
    <span
      className="inline-flex justify-center items-center px-2 ml-3 text-sm
    font-medium text-gray-800 bg-warning rounded-full dark:bg-warning
    dark:text-gray-300"
    >
      {writer.pending_outreaches_count}
    </span>
  ) : (
    ""
  );
}
