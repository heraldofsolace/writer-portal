import {assignmentStatuses} from "../../constants/assignment-statuses";
import {useState} from "react";

export default function SubmitAssignment({assignment, handleSubmit}) {
    const [disabled, setDisabled] = useState(false);

    // Allow writers to submit an assignment
    const submit = async (e) => {
        setDisabled(true);
        fetch("/api/assignments/" + assignment.id + "/submit", {
            method: "POST",
        })
            .then((response) => {
                if (response.ok) {
                    handleSubmit(e.target.value);
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
            {assignment.status === assignmentStatuses.writing ? (
                <div>
                    <button className="pure-button button-success" onClick={submit} disabled={disabled}>
                        Submit Assignment
                    </button>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
