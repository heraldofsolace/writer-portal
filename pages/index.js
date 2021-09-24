import Cotter from "cotter";
import {useEffect, useState} from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

const cotterApiKeyId = process.env.NEXT_PUBLIC_COTTER_API_KEY_ID;

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

    // Shows the Cotter Login form and sets Access Token when authenticated
    useEffect(() => {
        const cotter = new Cotter({ApiKeyID: cotterApiKeyId, ContainerID: "cotter-form-container-form_default"});
        cotter
            .withFormID("form_default")
            .signInWithOTP()
            .showEmailForm()
            .then(payload => {
                localStorage.setItem("ACCESS_TOKEN", payload.oauth_token.access_token);
                setIsLoggedIn(true);
            })
            .catch((err) => console.log(err));
    }, []);

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

    // Deletes Access Token and logs user out
    const logOut = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        setIsLoggedIn(false);
        window.location.reload();
    };

    // Display the login page
    return (
        <main>
            {isLoggedIn ? (
                <div>
                    <h1 style={{textAlign: 'center'}}>Writer Portal</h1>
                    {assignments && assignments.length > 0 ? (
                        <div>
                            <h2><a href={"/writers/" + assignments[0].writer}>Your Profile ↠</a></h2>
                            <h2>Your Assignments</h2>
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
                    ) : (
                        <p>
                            No assignments found. Be sure to use the same email to log in that you used to apply for Draft.dev.
                            If you think you've encountered an error, <a href="mailto:karl@draft.dev">contact karl@draft.dev</a>.</p>
                    )}
                    <p><a href="#" onClick={logOut}>Log out</a>.</p>
                </div>
            ) : (
                <div style={{textAlign: 'center'}}>
                    <h1>Writer Portal</h1>
                    <p>This portal is exclusively for <a href="https://draft.dev/">Draft.dev</a> writers.</p>
                    <p>Log in to view your assignments.</p>
                    <div id="cotter-form-container-form_default" style={{width: 300, height: 200, margin: '1rem auto'}}></div>
                </div>
            )}
        </main>
    );
}
