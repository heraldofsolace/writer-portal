import { SignedIn, SignedOut } from "@clerk/nextjs";
import SigninForm from "./navs/signin-form";
import LogUser from "./log-user";
import { useWriter } from "../data/use-writer";
import { Error } from "./error";

export default function AuthedOnly({ children }) {
  const { user, isError } = useWriter("me");
  if (isError) {
    return (
      <Error code="401" message="We couldn't find an account with that email" />
    );
  }
  return (
    <main>
      <SignedIn>
        <LogUser />
        {children}
      </SignedIn>
      <SignedOut>
        <SigninForm />
      </SignedOut>
    </main>
  );
}
