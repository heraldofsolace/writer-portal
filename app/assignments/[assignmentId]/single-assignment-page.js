"use client";

import SingleAssignment from "../../../components/assignments/single-assignment";

export default function SingleAssignmentPage({ assignmentId, emailId }) {
  return <SingleAssignment assignmentId={assignmentId} emailId={emailId} />;
}
