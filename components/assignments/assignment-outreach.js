import { assignmentStatuses } from "../../constants/assignment-statuses";
import { useEffect, useState } from "react";
export default function AssignmentOutreach({
  assignment,
  userData,
  handleAccept,
  handleReject,
}) {
  const [disabled, setDisabled] = useState(false);
  const [rejectDisabled, setRejectDisabled] = useState(false);
  const [message, setMessage] = useState(false);

  // Allow writers to request an assignment
  const accept = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setMessage(false);
    fetch("/api/outreaches/" + assignment.outreach_id + "/accept", {
      method: "POST",
      body: JSON.stringify({ email: userData.email }),
    })
      .then((response) => {
        if (response.ok) {
          setMessage({
            body: "Success! You should receive a confirmation email shortly.",
            type: "success",
          });
          setDisabled(true);
          setRejectDisabled(true);
          response.json().then(({ outreachId }) => {
            handleAccept(outreachId);
          });
        } else {
          throw new Error("Invalid response from backend");
        }
      })
      .catch((error) => {
        setMessage({
          body: "Whoops, something went wrong. Please reach out to editor@draft.dev to manually accept this assignment.",
          type: "error",
        });
        console.error(error);
        setDisabled(false);
      });
  };

  // Allow writers to unrequest an assignment
  const reject = async (e) => {
    e.preventDefault();
    setRejectDisabled(true);
    setMessage(false);
    fetch("/api/outreaches/" + assignment.outreach_id + "/reject", {
      method: "POST",
      body: JSON.stringify({ email: userData.email }),
    })
      .then((response) => {
        if (response.ok) {
          setMessage({
            body: "Success! You have rejected this article.",
            type: "success",
          });
          setRejectDisabled(true);
          setDisabled(true);
          handleReject();
        } else {
          throw new Error("Invalid response from backend");
        }
      })
      .catch((error) => {
        setMessage({
          body: "Whoops, something went wrong. Please reach out to editor@draft.dev to manually cancel this request.",
          type: "error",
        });
        console.error(error);
        setRejectDisabled(false);
      });
  };

  return (
    <div className="assignment-actions">
      {assignment.status === assignmentStatuses.assigning &&
      assignment.writer_email.length === 0 &&
      assignment.outreach_id &&
      !assignment.outreach_status &&
      assignment.expired === "No" ? (
        <form className="mt-4" onSubmit={accept}>
          <button
            className="btn btn-success text-white"
            type="submit"
            disabled={
              disabled ||
              assignment.expired === "Yes" ||
              assignment.outreach_status
            }
          >
            Accept
          </button>
          <a
            className="btn btn-error text-white mx-4"
            href="#"
            onClick={reject}
            disabled={
              rejectDisabled ||
              assignment.expired === "Yes" ||
              assignment.outreach_status
            }
          >
            Reject
          </a>

          {message ? (
            <div
              className={`alert alert-${message.type} shadow-lg text-white my-4`}
            >
              <div>{message.body}</div>
              <p className="alert-error hidden"></p>
            </div>
          ) : null}
        </form>
      ) : (
        ""
      )}
      {assignment.outreach_id && assignment.outreach_status === "Rejected" ? (
        <div className={`alert alert-info shadow-lg text-white my-4`}>
          <div>You have rejected this article</div>
        </div>
      ) : null}
    </div>
  );
}
