import { assignmentStatuses } from "../../constants/assignment-statuses";
import { useState } from "react";

export default function AcceptAssignment({ assignment, handleAccept }) {
    const [disabled, setDisabled] = useState(false);

    // Allow writers to accept an assignment
    const accept = async (e) => {
        setDisabled(true);
        fetch("/api/assignments/" + assignment.id + "/accept", {
            method: "POST",
        })
            .then((response) => {
                if (response.ok) {
                    handleAccept(e.target.value);
                } else {
                    throw new Error("Invalid response from backend");
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => setDisabled(false));
    };

    return (
        <div className="assignment-actions">
            {assignment.status === assignmentStatuses.matched && assignment.writer_email.length > 0 ? (
                <div>
                    <button className="pure-button button-success" onClick={accept} disabled={disabled}>
                        Accept Assignment
                    </button>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
