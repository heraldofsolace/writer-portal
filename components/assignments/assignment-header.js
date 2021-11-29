import { assignmentStatuses } from "../../constants/assignment-statuses";

export default function AssignmentHeader({ assignment }) {
  return (
      <>
        {assignment.status === assignmentStatuses.assigning && assignment.writer_email.length > 0 ? (
            <div>
              <h1 style={{textAlign: 'center'}}>Confirm Your New Assignment</h1>
              <p>
                Please check the details of your assignment and confirm that you
                are able to complete it by the due date by clicking "Accept
                Assignment" at the bottom of this page.
              </p>
            </div>
        ) : assignment.status === assignmentStatuses.assigning && assignment.writer_email.length === 0 ? (
            <div>
                <a href={"/assignments/available"}>⬅ All Available Assignments</a>
                <h1 style={{textAlign: 'center'}}>Request Assignment</h1>
                <p>
                    Click the link below to request this assignment and our editors will follow up soon (typically within 3 days).
                </p>
            </div>
        ) : assignment.status === assignmentStatuses.writing ? (
            <div>
              <a href={"/"}>⬅ All Your Assignments</a>
              <h1 style={{textAlign: 'center'}}>Assignment In Progress</h1>
              <p>
                This assignment has been confirmed and is now being written.
              </p>
            </div>
        ) : assignment.status === assignmentStatuses.ready_for_editing ? (
            <div>
              <a href={"/assignments"}>⬅ All Your Assignments</a>
              <h1 style={{textAlign: 'center'}}>Assignment Submitted</h1>
              <p>
                This assignment has been submitted to our editors. We'll let you know
                when we have feedback (usually within 1-3 weeks).
              </p>
            </div>
        ) : (
            <div>
              <a href={"/assignments"}>⬅ All Your Assignments</a>
              <h1 style={{textAlign: 'center'}}>Assignment Details</h1>
            </div>
        )}
      </>
  );
}
