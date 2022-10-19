import Assignments from "../components/assignments/assignments";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { users } from "@clerk/nextjs/api";
import { getAssignments } from "../functions/assignments";
import { SWRConfig } from "swr";

export default function Home({ fallback, type }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Assignments type="current" />
    </SWRConfig>
  );
}

export const getServerSideProps = withServerSideAuth(async ({ req, query }) => {
  const { type } = query;
  const { userId } = req.auth;
  if (!userId) {
    return {
      props: {
        fallback: {
          [`/api/assignments?type=${type}`]: null,
        },
        type,
      },
    };
  }
  const user = await users.getUser(userId);
  const assignments = await getAssignments(
    type,
    user.emailAddresses[0].emailAddress
  );

  return {
    props: {
      fallback: {
        [`/api/assignments?type=${type}`]: assignments.data,
      },
      type,
    },
  };
});
