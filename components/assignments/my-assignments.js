import {assignmentStatuses} from "../../constants/assignment-statuses";
import {useState, useEffect} from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import * as utc from "dayjs/plugin/utc";

dayjs.extend(localizedFormat);
dayjs.extend(utc);

export default function MyAssignments() {
    const [assignments, setAssignments] = useState(null);
    
    const getAssignments = () => {
        fetch(`/api/assignments`)
        .then(resp => resp.json())
        .then(json => setAssignments(json))
        .catch(e => {
            console.error(e);
            setAssignments(false);
        });
    }

    useEffect(() => {
      getAssignments();
    }, []);

    return (
        <table className="pure-table">
          <thead>
          <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Payment</th>
          </tr>
          </thead>
          <tbody>
          {assignments && assignments.length > 0 ? (
            assignments.map((assignment) => (
                <tr key={assignment.id}>
                    <td>
                        <a href={"/assignments/" + assignment.id}>{assignment.title}</a><br/>
                        <small>For {assignment.client_name}</small>
                    </td>
                    <td>
                        {assignment.published_url ? (
                            <a href={assignment.published_url} target="_blank">
                                Published
                            </a>
                        ) : (assignment.status)}
                    </td>
                    <td>{dayjs(assignment.writer_due_date).format("LL")}</td>
                    <td>
                        ${assignment.writer_payout}{" "}
                        {assignment.writer_paid_date ? (
                            <span
                                title={'Payment initiated on ' + dayjs(assignment.writer_paid_date).utc().format("LL")}>✅</span>
                        ) : ('')}</td>
                </tr>
            ))) : (assignments && assignments.length === 0) ? (
                <tr><td colSpan="4">
                    No assignments found. Be sure to use the same email to log in that you used to apply for
                    Draft.dev.
                    If you think you've encountered an error, <a href="mailto:editor@draft.dev">contact
                    editor@draft.dev</a>.
                </td></tr>
            ) : (
                <tr><td colSpan="4">Loading...</td></tr>
            )}
          </tbody>
      </table>
    );
}
