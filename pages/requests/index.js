import Requests from "../../components/requests/requests";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { users } from "@clerk/nextjs/api";
import { getRequests } from "../../functions/requests";
import { SWRConfig } from "swr";

export default function RequestsPage({ fallback, type }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Requests type={type} />
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
          [`/api/requests?type=${type}`]: null,
        },
        type,
      },
    };
  }
  const user = await users.getUser(userId);
  const requests = await getRequests(type, user.emailAddresses[0].emailAddress);

  return {
    props: {
      fallback: {
        [`/api/requests?type=${type}`]: requests.data,
      },
      type,
    },
  };
});
