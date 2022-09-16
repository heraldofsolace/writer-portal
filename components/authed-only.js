import { SignedIn, SignedOut } from "@clerk/nextjs";
import SigninForm from "./navs/signin-form";
import LogUser from "./log-user";

export default function AuthedOnly({ children }) {
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
