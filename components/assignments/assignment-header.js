import { assignmentStatuses } from "../../constants/assignment-statuses";

export default function AssignmentHeader({ assignment }) {
  return (
    <>
      {assignment.status === assignmentStatuses.assigning &&
      assignment.writer_email.length > 0 ? (
        <div>
          <h1 className="my-4 text-center">Confirm Your New Assignment</h1>
          <div className="alert alert-warning shadow-lg text-white my-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Please check the details of your assignment and confirm that you
              are able to complete it by the due date by clicking &ldquo;Accept
              Assignment&rdquo; at the bottom of this page.
            </div>
          </div>
        </div>
      ) : assignment.request_id ? (
        <div>
          <a href={"/"}>⬅ All Your Assignments</a>
          <h1 className="my-4 text-center">Assignment Requested</h1>
          <div className="alert alert-success shadow-lg text-white my-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              You have requested this article.
            </div>
          </div>
        </div>
      ) : assignment.status === assignmentStatuses.assigning &&
        assignment.writer_email.length === 0 ? (
        <div>
          <a href={"/assignments/available"}>⬅ All Available Assignments</a>
          <div className="alert alert-warning shadow-lg text-white my-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Click the link below to request this assignment. We will email you
              if you are assigned to this article.
            </div>
          </div>
        </div>
      ) : assignment.status === assignmentStatuses.writing ? (
        <div>
          <a href={"/"}>⬅ Your Current Assignments</a>
          <div className="alert alert-success shadow-lg text-white my-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              This assignment has been confirmed and is now being written.
            </div>
          </div>
        </div>
      ) : assignment.status === assignmentStatuses.tech_review ? (
        <div>
          <a href={"/"}>⬅ All Your Assignments</a>
          <h1 className="my-4 text-center">Assignment Submitted</h1>
          <div className="alert alert-success shadow-lg text-white my-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              This assignment has been submitted to our editors. We&#39;ll let
              you know when we have feedback (usually within 1-3 weeks).
            </div>
          </div>
        </div>
      ) : (
        <div>
          <a href={"/"}>⬅ All Your Assignments</a>
          <h1 className="my-4 text-center">Assignment Details</h1>
        </div>
      )}
    </>
  );
}
