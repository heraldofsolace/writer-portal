import {assignmentStatuses} from "../../constants/assignment-statuses";
import {useState} from "react";

export default function RequestAssignment({assignment}) {
    const [disabled, setDisabled] = useState(false);
    const [message, setMessage] = useState(false);
    const [email, setEmail] = useState('');

    // Allow writers to accept an assignment
    const request = async (e) => {
        e.preventDefault();
        setDisabled(true);
        setMessage(false);
        fetch("/api/assignments/" + assignment.id + "/request", {
            method: "POST",
            body: JSON.stringify({email}),
        })
            .then((response) => {
                if (response.ok) {
                    setMessage({
                        body: "Success! Your request has been submitted. You should hear back within 3 days.",
                        type: "success",
                    });
                    setDisabled(true);
                } else {
                    throw new Error("Invalid response from backend");
                }
            })
            .catch((error) => {
                setMessage({
                    body: "Whoops, something went wrong. Most likely your email address is not correct, but let us know if this might be an error.",
                    type: "error",
                });
                console.error(error);
                setDisabled(false);
            });
    };

    return (
        <div className="assignment-actions">
            {assignment.status === assignmentStatuses.assigning && assignment.writer_email.length === 0 ? (
                <form className="pure-form" onSubmit={request}>
                    <label>Your Email Address</label>
                    <p className="small">Must match the email you used when applying to Draft.dev</p>
                    <div style={{"margin-bottom": ".5rem"}}>
                        <input name="email" type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <button className="pure-button button-success" type="submit" disabled={disabled || !email}>
                        Request Assignment
                    </button>
                    {message ? (
                        <p className={message.type}>{message.body}</p>
                    ) : null}
                </form>
            ) : (
                ""
            )}
        </div>
    );
}
