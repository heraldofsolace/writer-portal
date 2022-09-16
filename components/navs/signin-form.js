import { SignIn } from "@clerk/nextjs";
import { Header } from "../header";

export default function SigninForm() {
  return (
    <div className="flex flex-col h-screen items-center">
      <Header />
      <div className="flex flex-col items-center text-center my-4">
        <p>
          This portal is exclusively for{" "}
          <a href="https://draft.dev/">Draft.dev</a> writers.
        </p>
        <p className="mb-4">Log in using the same email you used to apply.</p>
        <SignIn />
        <p className="small absolute bottom-0">
          Note: Login emails may not display properly in Outlook. Please open
          the email in your browser if you have any trouble seeing the login
          link.
        </p>
      </div>
    </div>
  );
}
