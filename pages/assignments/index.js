import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import Assignments from "../../components/assignments/assignments";
import { SWRConfig } from "swr";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { users } from "@clerk/nextjs/api";
import { getAssignments } from "../../functions/assignments";

dayjs.extend(localizedFormat);

export default function AssignmentsPage({ fallback, type }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Assignments type={type} />
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
