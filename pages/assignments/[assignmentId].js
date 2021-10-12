import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {truncate} from "lodash";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import AcceptAssignment from "../../components/assignments/accept-assignment";
import RequestAssignment from "../../components/assignments/request-assignment";
import {assignmentStatuses} from "../../constants/assignment-statuses";
import SubmitAssignment from "../../components/assignments/submit-assignment";
import AssignmentHeader from "../../components/assignments/assignment-header";
import AuthedOnly from "../../components/authed-only";

dayjs.extend(localizedFormat);

export default function Assignment() {
    const router = useRouter();
    const {assignmentId} = router.query;
    const [assignment, setAssignment] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const getAssignment = () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        fetch(`/api/assignments/${assignmentId}`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then(resp => resp.json())
            .then(json => setAssignment(json))
            .catch(e => {
                console.error(e);
                setAssignment(false);
            });
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

    useEffect(() => {
        if (router.isReady) {
            getAssignment();
        }
    }, [router.isReady]);

    // Sets local user variable
    useEffect(() => {
        if (localStorage.getItem("COTTER_USER") !== null) {
            setCurrentUser(JSON.parse(localStorage.getItem("COTTER_USER")));
        }
    }, []);

    const belongsToCurrentUser = () => {
        return assignment.writer_email &&
            assignment.writer_email.length > 0 &&
            assignment.writer_email[0] &&
            assignment.writer_email[0] === currentUser.identifier
    }

    return (
        <AuthedOnly>
            {assignment ? (
                <div>
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
                        {belongsToCurrentUser() ? (
                            <tr>
                                <th>Brief URL</th>
                                <td style={{overflow: "hidden", whiteSpace: "nowrap"}}>
                                    <a href={assignment.brief_url} target="_blank">
                                        {truncate(assignment.brief_url, {length: 55})}
                                    </a>
                                </td>
                            </tr>) : null}
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
                            </>) : null}
                        <tr>
                            <th>Due Date</th>
                            <td>{dayjs(assignment.writer_due_date).format("LL")}</td>
                        </tr>
                        <tr>
                            <th>Deliverables</th>
                            <td>{assignment.writer_deliverables.join(", ")}</td>
                        </tr>
                        </tbody>
                    </table>
                    <RequestAssignment
                        assignment={assignment}
                        currentUser={currentUser}
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
                </div>
            ) : assignment === false ? (
                <p>Assignment not found.</p>
            ) : (
                <p>Loading assignment...</p>
            )}
        </AuthedOnly>
    );
}
