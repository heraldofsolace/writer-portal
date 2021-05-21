import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { truncate } from "lodash";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import AcceptAssignment from "../../components/assignments/accept-assignment";
import { assignmentStatuses } from "../../constants/assignment-statuses";
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
          {assignment.status === "Accepted" ? (
            <div>
              <h1>Confirm Your New Assignment</h1>
              <p>
                Please check the details of your assignment and confirm that you
                are able to complete it by the due date by clicking "Accept
                Assignment" at the bottom of this page.
              </p>
            </div>
          ) : (
            ""
          )}
          {assignment.status === "Writing" ? (
            <div>
              <h1>Assignment In Progress</h1>
              <div className="alert alert-success">
                <p>
                  This assignment has been confirmed and is now being written.
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
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
        </div>
      ) : (
        <p>No assignment found.</p>
      )}
    </main>
  );
}
