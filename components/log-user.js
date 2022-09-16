import LogRocket from "logrocket";
import { useUser } from "@clerk/nextjs";

export default function LogUser() {
  try {
    const user = useUser();
    if (
      user &&
      user.primaryEmailAddress &&
      user.primaryEmailAddress.emailAddress
    ) {
      LogRocket.identify(user.primaryEmailAddress.emailAddress);
    }
  } catch (e) {
    console.error(e);
  }

  return <></>;
}
