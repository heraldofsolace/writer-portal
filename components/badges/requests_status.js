export default function RequestStatus({ status }) {
  const color =
    status === "Pending"
      ? "badge-primary"
      : status === "Accepted"
      ? "badge-success"
      : "badge-error";
  return (
    <span className={"badge badge-lg text-sm text-white " + color}>
      {status}
    </span>
  );
}
