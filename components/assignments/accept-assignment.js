export default function AcceptAssignment({ assignment, handleAccept }) {
  // Allow writers to accept an assignment
  const accept = async (e) => {
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
      });
  };

  return (
    <div className="assignment-actions">
      {assignment.status === "Accepted" ? (
        <div>
          <button className="pure-button button-success" onClick={accept}>
            Accept Assignment
          </button>
        </div>
      ) : (
        ""
      )}
      <p>
        Have a question? Email{" "}
        <a href="mailto:editor@draft.dev">editor@draft.dev</a>
      </p>
    </div>
  );
}
