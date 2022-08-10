import {useState, useEffect} from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import * as utc from "dayjs/plugin/utc";
import {truncate} from "lodash";
import AcceptAssignment from "../../components/assignments/accept-assignment";
import RequestAssignment from "../../components/assignments/request-assignment";
import {assignmentStatuses} from "../../constants/assignment-statuses";
import SubmitAssignment from "../../components/assignments/submit-assignment";
import AssignmentHeader from "../../components/assignments/assignment-header";
import dynamic from 'next/dynamic';
const ReactMarkdown= dynamic(() => import('react-markdown'),{ ssr: false });

dayjs.extend(localizedFormat);
dayjs.extend(utc);

export default function SingleAssignment({assignmentId}) {
    const [assignment, setAssignment] = useState(null);
    const [userData, setUserData] = useState(null);
    
    const getAssignment = () => {
        fetch(`/api/assignments/${assignmentId}`)
        .then(resp => resp.json())
        .then(json => setAssignment(json))
        .catch(e => {
            console.error(e);
            setAssignment(false);
        });
    }

    const getUserData = () => {
        fetch(`/api/writers/me`)
            .then(resp => resp.json())
            .then(json => setUserData(json))
            .catch(e => {
                console.error(e);
                setUserData(false);
            });
    };

    const belongsToCurrentUser = () => {
        return userData && assignment.writer_email &&
            assignment.writer_email.length > 0 &&
            assignment.writer_email[0] &&
            assignment.writer_email[0] === userData.email
    }

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

    useEffect(() => {
        if (assignmentId) {
            getAssignment();
            getUserData();
        }
    }, [assignmentId]);

    return (
      <div>
        {assignment ? (
          <>
          <AssignmentHeader assignment={assignment}/>
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
                <th>Client Name</th>
                <td>{assignment.client_name}</td>
              </tr>
              {belongsToCurrentUser() ? (
                  <tr>
                      <th>Brief URL</th>
                      <td style={{overflow: "hidden", whiteSpace: "nowrap"}}>
                          <a href={assignment.brief_url} target="_blank">
                              {truncate(assignment.brief_url, {length: 55})}
                          </a>
                      </td>
                  </tr>) : null}
                  <tr>
                    <th>Outline</th>
                    <td>
                      <ReactMarkdown children={assignment.outline} />
                    </td>
                  </tr>
              {assignment.published_url ? (
                  <tr>
                      <th>Published URL</th>
                      <td style={{overflow: "hidden", whiteSpace: "nowrap"}}>
                          <a href={assignment.published_url} target="_blank">
                              {truncate(assignment.published_url, {length: 55})}
                          </a>
                      </td>
                  </tr>
              ) : null}
              {belongsToCurrentUser() ? (
                  <>
                      <tr>
                          <th>Writer Assigned</th>
                          <td>{assignment.writer_email}</td>
                      </tr>
                      <tr>
                          <th>Pay Rate</th>
                          <td>${assignment.writer_payout}</td>
                      </tr>
                      <tr>  
                        <th>Target keyword</th>
                        <td>{assignment.target_keyword}</td>
                      </tr>
                      <tr>
                        <th>What problem is {assignment.client_name} trying to solve? What sets them apart?</th>
                        <td>{assignment.what_sets_the_company_apart}</td>
                      </tr>
                      <tr>  
                        <th>Include a call to action?</th>
                        <td>{assignment.call_to_action || "No"}</td>
                      </tr>
                      <tr>  
                        <th>Expected technical level</th>
                        <td>{assignment.technical_level}</td>
                      </tr>
                      <tr>  
                        <th>Tools that should be used</th>
                        <td>{assignment.tools_to_be_used}</td>
                      </tr>
                      <tr>  
                        <th>Tools that should not be used</th>
                        <td>{assignment.tools_to_be_excluded}</td>
                      </tr>
                      <tr>
                        <th>Competitors of {assignment.client_name}</th>
                        <td>{assignment.competitors}</td>
                      </tr>
                      <tr>  
                        <th>How should the product(s) of {assignment.client_name} be mentioned?</th>
                        <td>{assignment.mention_of_product}</td>
                      </tr>
                  </>) : null}
              <tr>
                  <th>Due Date</th>
                  <td>{dayjs(assignment.writer_due_date).utc().format("LL")}</td>
              </tr>
              <tr>
                <th>Deliverables</th>
                <td>{assignment.writer_deliverables.join(", ")}</td>
              </tr>
              <tr>  
                <th>Audience</th>
                <td>{assignment.audience}</td>
              </tr>
              </tbody>
          </table>
          <RequestAssignment
              assignment={assignment}
              userData={userData}
          />
          {belongsToCurrentUser() ? (
              <>
                  <AcceptAssignment
                      assignment={assignment}
                      handleAccept={handleAccept}
                  />
                  <SubmitAssignment
                      assignment={assignment}
                      handleSubmit={handleSubmit}
                  />
              </>
          ) : (null)}
          <p>
              Have a question about this assignment? Email{" "}
              <a href="mailto:editor@draft.dev">editor@draft.dev</a>
          </p>
          </>
        ) : assignment === false ? (
            <p>Assignment not found.</p>
        ) : (
            <p>Loading assignment...</p>
        )}
      </div>
    );
}
