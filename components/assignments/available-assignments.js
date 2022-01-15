import {assignmentStatuses} from "../../constants/assignment-statuses";
import {useState, useEffect} from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export default function AvailableAssignments() {
    const [assignments, setAssignments] = useState(null);
    
    const getAssignments = () => {
        fetch(`/api/assignments/available`)
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
              <th>Due Date</th>
              <th>Categories</th>
          </tr>
          </thead>
          <tbody>
          {assignments && assignments.length > 0 ? (
            assignments.map((assignment) => (
              <tr key={assignment.id}>
                  <td>
                      <a href={"/assignments/" + assignment.id}>{assignment.title}</a>
                      <br/>
                      <small>{assignment.request_date ? (' ✔ Request Submitted️') : 'For ' + assignment.client_name}</small>
                  </td>
                  <td>{dayjs(assignment.writer_due_date).format("LL")}</td>
                  <td>{assignment.content_category_names}</td>
              </tr>
            ))) : (assignments && assignments.length === 0) ? (
                <tr><td colSpan="3">
                  No available assignments found. Please check back later.
                </td></tr>
            ) : (
                <tr><td colSpan="3">Loading...</td></tr>
            )}
          </tbody>
      </table>
    );
}
