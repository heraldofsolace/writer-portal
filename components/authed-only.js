import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import SigninForm from "./navs/signin-form";
import LogUser from "./log-user";
import { useWriter } from "../data/use-writer";
import { Error } from "./error";

export default function AuthedOnly({ children }) {
  const { writer, isError } = useWriter("me");
  return (
    <main>
      <SignedIn>
        {isError ? (
          <Error
            code="401"
            message="We couldn't find an account with that email"
            error={isError}
          />
        ) : (
          children
        )}
      </SignedIn>
      <SignedOut>
        <SigninForm />
      </SignedOut>
    </main>
  );
}
