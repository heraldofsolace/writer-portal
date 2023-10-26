import { assignmentStatuses } from "../../constants/assignment-statuses";
import { useState } from "react";

export default function AcceptAssignment({ assignment, handleAccept }) {
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState(null);

  // Allow writers to accept an assignment
  const accept = async (e) => {
    setDisabled(true);
    setMessage({
      body: "Accepting. Please wait",
      type: "info",
    });
    const response = await fetch(
      "/api/assignments/" + assignment.id + "/accept",
      {
        method: "POST",
      },
    );
    if (response.ok) {
      setMessage({
        body: "Success! The assignment has been accepted.",
        type: "success",
      });
      setDisabled(true);
      handleAccept(e.target.value);
    } else {
      setMessage({
        body: "Whoops, something went wrong. Please reach out to portal@draft.dev to manually accept this assignment.",
        type: "error",
      });
      setDisabled(false);
    }
  };

  return (
    <div className="assignment-actions">
      {assignment.status === assignmentStatuses.assigning &&
      assignment.writer_email.length > 0 ? (
        <div>
          <button
            className="btn btn-primary"
            onClick={accept}
            disabled={disabled}
          >
            Accept Assignment
          </button>
          {message ? (
            <div
              className={`alert alert-${message.type} shadow-lg text-white my-4`}
            >
              <div>{message.body}</div>
              <p className="alert-error hidden"></p>
            </div>
          ) : null}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
