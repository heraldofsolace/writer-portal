import {useEffect, useState} from "react";
import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import SecondaryNav from "../../components/navs/secondary-nav";
import AuthedOnly from "../../components/authed-only";

dayjs.extend(localizedFormat);

export default function Available() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [assignments, setAssignments] = useState(null);

    const getAssignments = () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        fetch(`/api/assignments/available`, {
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
            <div>
                <h1 style={{textAlign: 'center'}}>Writer Portal</h1>
                {assignments && assignments.length > 0 ? (
                    <div>
                        <SecondaryNav currentPage='available'></SecondaryNav>
                        <table className="pure-table">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Due Date</th>
                                <th>Categories</th>
                            </tr>
                            </thead>
                            <tbody>
                            {assignments.map((assignment) => (
                                <tr key={assignment.id}>
                                    <td>
                                        <a href={"/assignments/" + assignment.id}>{assignment.title}</a><br/>
                                        <small>For {assignment.client_name}</small>
                                    </td>
                                    <td>{dayjs(assignment.writer_due_date).format("LL")}</td>
                                    <td>{assignment.content_category_names}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (assignments && assignments.length === 0) ? (
                    <p>
                        No available assignments found. Please check back later.
                    </p>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </AuthedOnly>
    );
}
