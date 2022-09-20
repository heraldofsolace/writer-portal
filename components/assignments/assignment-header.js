import { assignmentStatuses } from "../../constants/assignment-statuses";
import dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import * as utc from "dayjs/plugin/utc";
import * as relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);

function getMessageFromStatus(assignment, writerEmail) {
  // If it's been published
  if (assignment.status === assignmentStatuses.published) {
    return {
      type: "info",
      heading: "Article published",
      top_link: {
        to: "/assignments?type=available",
        message: "All available assignments",
      },
      message: `This article has been published`,
    };
  }
  // The assignment doesn't belong to this writer
  if (assignment.writer_email[0] !== writerEmail) {
    if (assignment.status === assignmentStatuses.assigning) {
      // If there's a pending outreach and it hasn't been accepted yet.
      if (
        assignment.outreach_id &&
        !assignment.outreach_status &&
        assignment.expired === "No"
      ) {
        return {
          type: "warning",
          heading: "Outreach",
          top_link: { to: "/", message: "Your current assignments" },
          message: ` Are you interested in writing this article? Click on the
              'Accept' button to accept the assignment. Otherwise,
              click on the 'Reject' button. You have until ${dayjs(
                assignment.reached_out_on
              )
                .add(2, "day")
                .utc()
                .format("LL LT")}
              to respond.`,
        };
      }

      // If outreach has been rejected
      if (assignment.outreach_id && assignment.outreach_status === "Rejected") {
        return {
          type: "info",
          heading: "Outreach",
          top_link: { to: "/", message: "Your current assignments" },
          message: "You have rejected this article",
        };
      }

      // Is it still available for requesting and there is already a request made
      if (assignment.request_id) {
        return {
          type: "info",
          heading: "Request made",
          top_link: {
            to: "/assignments?type=available",
            message: "All available assignments",
          },
          message: "You have requested this article",
        };
      }

      // No request made
      return {
        type: "info",
        heading: "Request this article",
        top_link: {
          to: "/assignments?type=available",
          message: "All available assignments",
        },
        message:
          "Click on the button below to request this article. We'll email you if you're assigned this article",
      };
    }

    // Show only the return link for any other status
    return {
      top_link: { to: "/", message: "Your current assignments" },
    };
  } else {
    // Not confirmed yet
    if (assignment.status === assignmentStatuses.assigning) {
      return {
        type: "info",
        heading: "Confirm your new assignment",
        top_link: { to: "/", message: "Your current assignments" },
        message:
          "Please check the details of your assignment and confirm that you are able to complete it by the due date by clicking 'Accept Assignment' at the bottom of this page.",
      };
    }
    // Is being written
    if (assignment.status === assignmentStatuses.writing) {
      return {
        type: "info",
        heading: "Article confirmed",
        top_link: { to: "/", message: "Your current assignments" },
        message: "This assignment has been confirmed and is now being written.",
      };
    }

    if (
      assignment.status === assignmentStatuses.tech_review ||
      assignment.status === assignmentStatuses.editing
    ) {
      return {
        type: "info",
        heading: "Article submitted",
        top_link: { to: "/", message: "Your current assignments" },
        message:
          "This assignment has been submitted to our editors. We'll let you know when we have feedback (usually within 1-3 weeks).",
      };
    }
    //Show only the return link in other statuses
    return {
      top_link: { to: "/", message: "Your current assignments" },
    };
  }
}

export default function AssignmentHeader({ assignment, writerEmail }) {
  const data = getMessageFromStatus(assignment, writerEmail);
  return (
    <>
      <div>
        {data.top_link && (
          <a href={data.top_link.to}>⬅ {data.top_link.message}</a>
        )}
        {data.heading && (
          <h1 className="my-4 text-center">Confirm Your New Assignment</h1>
        )}
        {data.type && (
          <div className={`alert shadow-lg text-white my-4 alert-${data.type}`}>
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
              {data.message}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
