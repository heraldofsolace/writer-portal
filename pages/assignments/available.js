import * as dayjs from "dayjs";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import AvailableAssignments from "../../components/assignments/available-assignments";
import { SWRConfig } from "swr";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { users } from "@clerk/nextjs/api";
import { getAvailableAssignments } from "../../functions/assignments";
import { getCurrentWriter } from "../../functions/writers";

dayjs.extend(localizedFormat);

export default function AvailableAssignmentsPage({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <AvailableAssignments />
    </SWRConfig>
  );
}

export const getServerSideProps = withServerSideAuth(async ({ req }) => {
  const { userId } = req.auth;
  if (!userId) {
    return {
      props: {
        fallback: {
          "/api/assignments/available": null,
        },
      },
    };
  }
  const user = await users.getUser(userId);
  const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);
  const assignments = await getAvailableAssignments(
    user.emailAddresses[0].emailAddress
  );

  return {
    props: {
      fallback: {
        "/api/assignments/available": assignments.data,
        "/api/writers/me": writer.data,
      },
    },
  };
});
