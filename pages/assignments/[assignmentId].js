import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { truncate } from "lodash";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import AcceptAssignment from "../../components/assignments/accept-assignment";
import { assignmentStatuses } from "../../constants/assignment-statuses";
import SubmitAssignment from "../../components/assignments/submit-assignment";
import AssignmentHeader from "../../components/assignments/assignment-header";
dayjs.extend(localizedFormat);

export default function Assignment() {
  const router = useRouter();
  const { assignmentId } = router.query;
  const [assignment, setAssignment] = useState(null);

  // Gets this client's projects when they're logged in
  const getAssignment = async () => {
    const resp = await fetch(`/api/assignments/${assignmentId}`);
    setAssignment(await resp.json());
  };

  const handleAccept = () => {
    setAssignment({
      ...assignment,
      status: assignmentStatuses.writing,
    });
  };

  const handleSubmit = () => {
    setAssignment({
      ...assignment,
      status: assignmentStatuses.ready_for_editing,
    });
  };

  // Get data from the API
  useEffect(() => {
    if (router.isReady) {
      getAssignment();
    }
  }, [router.isReady]);

  // Display the client portal page
  return (
    <main>
      {assignment ? (
        <div>
          <AssignmentHeader assignment={assignment} />
          <table className="pure-table">
            <tbody>
              <tr>
                <th>Title</th>
                <td>{assignment.title}</td>
              </tr>
              <tr>
                <th>Pitch</th>
                <td>{assignment.pitch}</td>
              </tr>
              <tr>
                <th>Brief URL</th>
                <td style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                  <a href={assignment.brief_url} target="_blank">
                    {truncate(assignment.brief_url, { length: 55 })}
                  </a>
                </td>
              </tr>
              <tr>
                <th>Writer Assigned</th>
                <td>{assignment.writer_email}</td>
              </tr>
              <tr>
                <th>Due Date</th>
                <td>{dayjs(assignment.writer_due_date).format("LL")}</td>
              </tr>
              <tr>
                <th>Pay Rate</th>
                <td>${assignment.writer_payout}</td>
              </tr>
            </tbody>
          </table>
          <AcceptAssignment
            assignment={assignment}
            handleAccept={handleAccept}
          />
          <SubmitAssignment
            assignment={assignment}
            handleSubmit={handleSubmit}
          />
          <p>
            Have a question? Email{" "}
            <a href="mailto:editor@draft.dev">editor@draft.dev</a>
          </p>
        </div>
      ) : (
        <p>No assignment found.</p>
      )}
    </main>
  );
}
