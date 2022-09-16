export default function OutreachStatus({ status }) {
  const color =
    status === "Accepted"
      ? "badge-success"
      : status === "Rejected"
      ? "badge-error"
      : "badge-primary";
  return (
    <span className={"badge badge-lg text-sm text-white " + color}>
      {status}
    </span>
  );
}
