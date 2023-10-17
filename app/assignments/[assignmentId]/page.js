import SingleAssignmentPage from "./single-assignment-page";
import { currentUser } from "@clerk/nextjs";

export default async function Page({ params }) {
  const user = await currentUser();
  return (
    <SingleAssignmentPage
      assignmentId={params.assignmentId}
      emailId={user.emailAddresses[0].emailAddress}
    />
  );
}
