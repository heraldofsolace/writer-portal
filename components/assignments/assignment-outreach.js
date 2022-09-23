import { assignmentStatuses } from "../../constants/assignment-statuses";
import { useState } from "react";

export default function AssignmentOutreach({
  assignment,
  userData,
  handleAccept,
  handleReject,
}) {
  const [disabled, setDisabled] = useState(false);
  const [rejectDisabled, setRejectDisabled] = useState(false);
  const [message, setMessage] = useState(null);

  // Allow writers to request an assignment
  const accept = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setMessage(null);
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
    setRejectDisabled(true);
    setMessage(null);
    const reasonForRejection = document.querySelector("#reason").value;
    fetch("/api/outreaches/" + assignment.outreach_id + "/reject", {
      method: "POST",
      body: JSON.stringify({ reasonForRejection }),
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
          <label
            className="btn btn-error text-white mx-4"
            href="#"
            htmlFor="outreach-modal"
            disabled={
              rejectDisabled ||
              assignment.expired === "Yes" ||
              assignment.outreach_status
            }
          >
            Reject
          </label>

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
      <input type="checkbox" id="outreach-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle lg:left-80">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to reject this outreach? You will not be able
            to request this article afterwards
          </h3>
          <p className="py-4">
            Why are you rejecting this article? (optional)
            <br />
            <small>
              Providing a reason helps us better curate article for you in the
              future
            </small>
          </p>
          <textarea className="w-full h-32 p-4" id="reason"></textarea>
          <div className="modal-action">
            <label
              htmlFor="outreach-modal"
              className="btn btn-error text-white"
            >
              Cancel
            </label>
            <label
              htmlFor="outreach-modal"
              className="btn btn-success text-white"
              onClick={reject}
            >
              Reject
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
