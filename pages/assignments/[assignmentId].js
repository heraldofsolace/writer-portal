import SingleAssignment from "../../components/assignments/single-assignment";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { users } from "@clerk/nextjs/api";
import { getSingleAssignment } from "../../functions/assignments";
import { getCurrentWriter } from "../../functions/writers";
import { SWRConfig } from "swr";

export default function Assignment({ fallback, assignmentId, emailId }) {
  return (
    <SWRConfig value={{ fallback }}>
      <SingleAssignment assignmentId={assignmentId} emailId={emailId} />
    </SWRConfig>
  );
}

export const getServerSideProps = withServerSideAuth(async ({ req, query }) => {
  const { userId } = req.auth;
  const { assignmentId } = query;
  if (!userId) {
    return {
      props: {
        fallback: {
          [`/api/assignments/${assignmentId}`]: null,
          "/api/writers/me": null,
        },
        assignmentId,
        emailId: null,
      },
    };
  }
  const user = await users.getUser(userId);
  const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);
  const assignment = await getSingleAssignment(
    assignmentId,
    user.emailAddresses[0].emailAddress
  );

  return {
    props: {
      fallback: {
        [`/api/assignments/${assignmentId}`]: assignment.data,
        "/api/writers/me": writer.data,
      },
      assignmentId,
      emailId: user.emailAddresses[0].emailAddress,
    },
  };
});
