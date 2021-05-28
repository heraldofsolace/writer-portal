import { assignmentStatuses } from "../../constants/assignment-statuses";

export default function AssignmentHeader({ assignment }) {
  return (
      <>
        {assignment.status === assignmentStatuses.accepted ? (
            <div>
              <h1>Confirm Your New Assignment</h1>
              <p>
                Please check the details of your assignment and confirm that you
                are able to complete it by the due date by clicking "Accept
                Assignment" at the bottom of this page.
              </p>
            </div>
        ) : assignment.status === assignmentStatuses.writing ? (
            <div>
              <h1>Assignment In Progress</h1>
              <p>
                This assignment has been confirmed and is now being written.
              </p>
            </div>
        ) : assignment.status === assignmentStatuses.ready_for_editing ? (
            <div>
              <h1>Assignment Submitted</h1>
              <p>
                This assignment has been submitted to our editors. We'll let you know
                when we have feedback (usually within 1-3 weeks).
              </p>
            </div>
        ) : (
            <div>
              <h1>Assignment Details</h1>
            </div>
        )}
      </>
  );
}
