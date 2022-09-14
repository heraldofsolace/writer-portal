import { assignmentStatuses } from "../../constants/assignment-statuses";
import { useState } from "react";

export default function SubmitAssignment({ assignment, handleSubmit }) {
  const [disabled, setDisabled] = useState(false);

  // Allow writers to submit an assignment
  const submit = async (e) => {
    setDisabled(true);
    fetch("/api/assignments/" + assignment.id + "/submit", {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          handleSubmit(e.target.value);
        } else {
          throw new Error("Invalid response from backend");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setDisabled(false));
  };

  return (
    <div className="assignment-actions">
      {assignment.status === assignmentStatuses.writing ? (
        <div>
          <p className="my-4">
            Are you <strong>totally finished</strong> with this assignment?
          </p>
          <label
            htmlFor="submit-modal"
            className="btn btn-success text-white"
            disabled={disabled}
          >
            Submit for Editorial Review
          </label>
        </div>
      ) : (
        ""
      )}
      <input type="checkbox" id="submit-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to submit?
          </h3>
          <p className="py-4">
            Make sure you&apos;re totally finished with writing before
            submitting
          </p>
          <div className="modal-action">
            <label htmlFor="submit-modal" className="btn btn-error text-white">
              Cancel
            </label>
            <label
              htmlFor="submit-modal"
              className="btn btn-success text-white"
              onClick={submit}
            >
              Submit
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
