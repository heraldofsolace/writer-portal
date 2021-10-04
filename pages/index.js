import {useEffect, useState} from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import SecondaryNav from "../components/navs/secondary-nav";
import AuthedOnly from "../components/authed-only";

dayjs.extend(localizedFormat);

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [assignments, setAssignments] = useState(null);

    const getAssignments = () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        fetch(`/api/assignments`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then(resp => resp.json())
            .then(json => setAssignments(json))
            .catch(e => {
                console.error(e);
                setAssignments(false);
            });
    };

    // Sets local isLoggedIn variable
    useEffect(() => {
        if (localStorage.getItem("ACCESS_TOKEN") !== null) {
            setIsLoggedIn(true);
        }
    }, []);

    // Get assignments, profile data for this user
    useEffect(() => {
        if (isLoggedIn) {
            getAssignments();
        }
    }, [isLoggedIn]);

    // Display the login page
    return (
        <AuthedOnly>
            <h1 style={{textAlign: 'center'}}>Writer Portal</h1>
            {assignments && assignments.length > 0 ? (
                <div>
                    <SecondaryNav currentPage='assignments'></SecondaryNav>
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
                        {assignments.map((assignment) => (
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
                                            title={'Payment initiated on ' + dayjs(assignment.writer_paid_date).format("LL")}>✅</span>
                                    ) : ('')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (assignments && assignments.length === 0) ? (
                <p>
                    No assignments found. Be sure to use the same email to log in that you used to apply for
                    Draft.dev.
                    If you think you've encountered an error, <a href="mailto:karl@draft.dev">contact
                    karl@draft.dev</a>.
                </p>
            ) : (
                <p>Loading...</p>
            )}
        </AuthedOnly>
    );
}
