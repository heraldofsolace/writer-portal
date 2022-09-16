import Requests from "../../components/requests/requests";
import { useRouter } from "next/router";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { users } from "@clerk/nextjs/api";
import { SWRConfig } from "swr";
import Outreaches from "../../components/outreaches/outreaches";
import { getOutreaches } from "../../functions/outreaches";

export default function OutreachesPage({ fallback, type }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Outreaches type={type} />
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
          [`/api/outreaches?type=${type}`]: null,
        },
        type,
      },
    };
  }
  const user = await users.getUser(userId);
  const outreaches = await getOutreaches(
    type,
    user.emailAddresses[0].emailAddress
  );

  return {
    props: {
      fallback: {
        [`/api/outreaches?type=${type}`]: outreaches.data,
      },
      type,
    },
  };
});
