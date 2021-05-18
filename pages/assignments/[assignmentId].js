import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

export default function Assignment() {
    const router = useRouter()
    const { assignmentId } = router.query
    console.log(assignmentId);
    const [assignment, setAssignment] = useState(null);

    // Gets this client's projects when they're logged in
    const getAssignment = async () => {
        const resp = await fetch(`/api/assignments/${assignmentId}`);
        setAssignment(await resp.json());
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
            <h1>DRAFT.DEV Writer Portal</h1>
            <div>
                {assignment ? (
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
                            <td><a href={assignment.brief_url} target="_blank">{assignment.brief_url}</a></td>
                        </tr>
                        <tr>
                            <th>Due Date</th>
                            <td>{assignment.writer_due_date}</td>
                        </tr>
                        <tr>
                            <th>Pay Rate</th>
                            <td>${assignment.writer_payout}</td>
                        </tr>
                        </tbody>
                    </table>
                ) : (<p>No assignment found.</p>)}
            </div>
        </main>
    )
}
